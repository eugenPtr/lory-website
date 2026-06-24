import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "packages_section" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Pachete',
  	"hide_eyebrow" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Colaborări pe măsura evenimentului vostru',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "events_section" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Evenimente',
  	"hide_eyebrow" boolean DEFAULT false,
  	"heading" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "testimonials_section" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Testimoniale',
  	"hide_eyebrow" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Ce spun cuplurile',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "about" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "about" ADD COLUMN "hide_eyebrow" boolean DEFAULT false;
  ALTER TABLE "services" ADD COLUMN "eyebrow" varchar DEFAULT 'Servicii';
  ALTER TABLE "services" ADD COLUMN "hide_eyebrow" boolean DEFAULT false;
  INSERT INTO "packages_section" (eyebrow, hide_eyebrow, heading)
    SELECT sections_packages_eyebrow, false, sections_packages_heading FROM "site_settings" LIMIT 1;
  INSERT INTO "events_section" (eyebrow, hide_eyebrow, heading)
    SELECT 'Evenimente', false, sections_events_heading FROM "site_settings" LIMIT 1;
  INSERT INTO "testimonials_section" (eyebrow, hide_eyebrow, heading)
    SELECT 'Testimoniale', false, sections_testimonials_heading FROM "site_settings" LIMIT 1;
  ALTER TABLE "site_settings" DROP COLUMN "sections_packages_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "sections_packages_heading";
  ALTER TABLE "site_settings" DROP COLUMN "sections_events_heading";
  ALTER TABLE "site_settings" DROP COLUMN "sections_testimonials_heading";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "packages_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "testimonials_section" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "packages_section" CASCADE;
  DROP TABLE "events_section" CASCADE;
  DROP TABLE "testimonials_section" CASCADE;
  ALTER TABLE "about" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "sections_packages_eyebrow" varchar DEFAULT 'Pachete';
  ALTER TABLE "site_settings" ADD COLUMN "sections_packages_heading" varchar DEFAULT 'Colaborări pe măsura evenimentului vostru';
  ALTER TABLE "site_settings" ADD COLUMN "sections_events_heading" varchar DEFAULT 'Evenimente';
  ALTER TABLE "site_settings" ADD COLUMN "sections_testimonials_heading" varchar DEFAULT 'Ce spun cuplurile';
  ALTER TABLE "about" DROP COLUMN "hide_eyebrow";
  ALTER TABLE "services" DROP COLUMN "eyebrow";
  ALTER TABLE "services" DROP COLUMN "hide_eyebrow";`)
}
