import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "packages_section_cards_card_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "packages_section_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"modal_content" jsonb,
  	"highlighted" boolean DEFAULT false
  );
  
  CREATE TABLE "testimonials_section_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"author_name" varchar NOT NULL,
  	"author_role" varchar
  );

  -- ── Data copy: collections → section-global arrays (must run BEFORE the drops). ──
  -- Seed the singleton global rows so the card arrays have a parent to hang off.
  INSERT INTO "packages_section" ("eyebrow", "hide_eyebrow", "heading", "updated_at", "created_at")
    SELECT 'Pachete', false, 'Colaborări pe măsura evenimentului vostru', now(), now()
    WHERE NOT EXISTS (SELECT 1 FROM "packages_section");
  INSERT INTO "testimonials_section" ("eyebrow", "hide_eyebrow", "heading", "updated_at", "created_at")
    SELECT 'Testimoniale', false, 'Ce spun cuplurile', now(), now()
    WHERE NOT EXISTS (SELECT 1 FROM "testimonials_section");
  -- Packages → cards. Card id is deterministic ('pkg_<oldId>') so bullets can re-link.
  INSERT INTO "packages_section_cards" ("_order", "_parent_id", "id", "title", "subtitle", "modal_content", "highlighted")
    SELECT row_number() OVER (ORDER BY p."order", p."id"),
           (SELECT "id" FROM "packages_section" ORDER BY "id" LIMIT 1),
           'pkg_' || p."id"::text,
           p."title", p."subtitle", p."modal_content", COALESCE(p."highlighted", false)
    FROM "packages" p;
  INSERT INTO "packages_section_cards_card_bullets" ("_order", "_parent_id", "id", "text")
    SELECT b."_order", 'pkg_' || b."_parent_id"::text, gen_random_uuid()::varchar, b."text"
    FROM "packages_card_bullets" b;
  -- Testimonials → cards (no nested arrays).
  INSERT INTO "testimonials_section_cards" ("_order", "_parent_id", "id", "quote", "author_name", "author_role")
    SELECT row_number() OVER (ORDER BY t."order", t."id"),
           (SELECT "id" FROM "testimonials_section" ORDER BY "id" LIMIT 1),
           gen_random_uuid()::varchar,
           t."quote", t."author_name", t."author_role"
    FROM "testimonials" t;

  ALTER TABLE "packages_card_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "packages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "testimonials" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "packages_card_bullets" CASCADE;
  DROP TABLE "packages" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  -- The two FK constraints below are already removed by the CASCADE drops above; guard
  -- with IF EXISTS so the explicit drop is a no-op rather than an error.
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_packages_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_testimonials_fk";

  DROP INDEX IF EXISTS "payload_locked_documents_rels_packages_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_testimonials_id_idx";
  ALTER TABLE "packages_section_cards_card_bullets" ADD CONSTRAINT "packages_section_cards_card_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."packages_section_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "packages_section_cards" ADD CONSTRAINT "packages_section_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."packages_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials_section_cards" ADD CONSTRAINT "testimonials_section_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."testimonials_section"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "packages_section_cards_card_bullets_order_idx" ON "packages_section_cards_card_bullets" USING btree ("_order");
  CREATE INDEX "packages_section_cards_card_bullets_parent_id_idx" ON "packages_section_cards_card_bullets" USING btree ("_parent_id");
  CREATE INDEX "packages_section_cards_order_idx" ON "packages_section_cards" USING btree ("_order");
  CREATE INDEX "packages_section_cards_parent_id_idx" ON "packages_section_cards" USING btree ("_parent_id");
  CREATE INDEX "testimonials_section_cards_order_idx" ON "testimonials_section_cards" USING btree ("_order");
  CREATE INDEX "testimonials_section_cards_parent_id_idx" ON "testimonials_section_cards" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "packages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "testimonials_id";
  ALTER TABLE "site_settings" DROP COLUMN "nav_despre";
  ALTER TABLE "site_settings" DROP COLUMN "nav_servicii";
  ALTER TABLE "site_settings" DROP COLUMN "nav_pachete";
  ALTER TABLE "site_settings" DROP COLUMN "nav_evenimente";
  ALTER TABLE "site_settings" DROP COLUMN "nav_testimoniale";
  ALTER TABLE "site_settings" DROP COLUMN "nav_contact";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "packages_card_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "packages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"modal_content" jsonb,
  	"highlighted" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"author_name" varchar NOT NULL,
  	"author_role" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  -- ── Reverse data copy: section-global arrays → collections (before dropping arrays). ──
  -- Preserve original package ids from the 'pkg_<id>' convention so bullets re-link.
  INSERT INTO "packages" ("id", "title", "subtitle", "modal_content", "highlighted", "order")
    SELECT CASE WHEN left(c."id", 4) = 'pkg_' THEN substring(c."id" FROM 5)::integer
                ELSE nextval('packages_id_seq') END,
           c."title", c."subtitle", c."modal_content", COALESCE(c."highlighted", false), c."_order"
    FROM "packages_section_cards" c;
  SELECT setval('packages_id_seq', GREATEST((SELECT COALESCE(max("id"), 1) FROM "packages"), 1));
  INSERT INTO "packages_card_bullets" ("_order", "_parent_id", "id", "text")
    SELECT b."_order", substring(b."_parent_id" FROM 5)::integer, b."id", b."text"
    FROM "packages_section_cards_card_bullets" b
    WHERE left(b."_parent_id", 4) = 'pkg_';
  INSERT INTO "testimonials" ("quote", "author_name", "author_role", "order")
    SELECT c."quote", c."author_name", c."author_role", c."_order"
    FROM "testimonials_section_cards" c;

  ALTER TABLE "packages_section_cards_card_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "packages_section_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "testimonials_section_cards" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "packages_section_cards_card_bullets" CASCADE;
  DROP TABLE "packages_section_cards" CASCADE;
  DROP TABLE "testimonials_section_cards" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "packages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "testimonials_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "nav_despre" varchar DEFAULT 'Despre mine' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "nav_servicii" varchar DEFAULT 'Servicii' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "nav_pachete" varchar DEFAULT 'Pachete' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "nav_evenimente" varchar DEFAULT 'Evenimente' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "nav_testimoniale" varchar DEFAULT 'Testimoniale' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "nav_contact" varchar DEFAULT 'Contact' NOT NULL;
  ALTER TABLE "packages_card_bullets" ADD CONSTRAINT "packages_card_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "packages_card_bullets_order_idx" ON "packages_card_bullets" USING btree ("_order");
  CREATE INDEX "packages_card_bullets_parent_id_idx" ON "packages_card_bullets" USING btree ("_parent_id");
  CREATE INDEX "packages_updated_at_idx" ON "packages" USING btree ("updated_at");
  CREATE INDEX "packages_created_at_idx" ON "packages" USING btree ("created_at");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_packages_fk" FOREIGN KEY ("packages_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_packages_id_idx" ON "payload_locked_documents_rels" USING btree ("packages_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");`)
}
