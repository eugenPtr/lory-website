# PRD — Consistent Section Intros (Eyebrow + Toggle + Heading)

**Status:** Draft for build · **Owner:** Eugen · **Date:** 2026-06-24
**Glossary:** [`/CONTEXT.md`](../CONTEXT.md) · **Decision:** [`docs/adr/0001-section-intro-globals.md`](./adr/0001-section-intro-globals.md)

---

## 1. Overview

Give all 5 content Sections (About, Services, Packages, Events, Testimonials) a single,
uniform intro pattern editable from the CMS: an **Eyebrow** (small upper-case oxblood
label), a **hide-eyebrow toggle**, and an **optional Section heading**. Each Section is
configured on its own Payload global page that looks like the existing About page. The
Hero and the Footer are out of scope.

## 2. Goals & non-goals

**Goals**
- Every Section configured the same way — same three fields, same page shape.
- Eyebrow text editable per Section, defaulted to that Section's navlink wording.
- Eyebrow hideable per Section; Heading omittable per Section.
- A schema migration that **preserves all existing database content** except the four
  fields being intentionally moved/dropped.

**Non-goals**
- No change to Hero or Footer/Contact.
- No change to the card data (Packages/Events/Testimonials items, Galleries, Media).
- No second eyebrow style; reuse the existing eyebrow styling already in the components.
- Eyebrow is **not** derived from the navlink (explicitly rejected — see ADR-0001).

## 3. Data model (CMS)

Every Section page ends with the same trio:

| Field | Type | Required | Default |
|---|---|---|---|
| `eyebrow` | text | no | the Section's navlink wording (e.g. "Despre mine") |
| `hideEyebrow` | checkbox | no | `false` (eyebrow shown) |
| `heading` | text | no | section-specific (may be empty) |

**Per-section delta**

| Section | Global slug | Has today | Add / change |
|---|---|---|---|
| About | `about` (existing) | `eyebrow`, `heading` (required), `body`, `photo` | add `hideEyebrow`; `heading` → **optional** |
| Services | `services` (existing) | `heading`, `columns` | add `eyebrow`, `hideEyebrow` |
| Packages | `packages-section` (**new**) | — | `eyebrow`, `hideEyebrow`, `heading` |
| Events | `events-section` (**new**) | — | `eyebrow`, `hideEyebrow`, `heading` |
| Testimonials | `testimonials-section` (**new**) | — | `eyebrow`, `hideEyebrow`, `heading` |

The 3 new globals are **section-intro only**; the repeating Cards stay in the existing
`packages` / `events` / `testimonials` collections (see CONTEXT "Section settings vs
Cards"). The `SiteSettings.sections` group is **removed**.

## 4. Admin UX

Reorganize the admin nav into two groups:

- **Conținut** — `About`, `Services`, `Pachete`, `Evenimente`, `Testimoniale`
  (the 5 section globals; labels Romanian, order matches the page).
- **Carduri** — `Packages`, `Events`, `Testimonials` collections (card lists).

`Media` and `Users` keep their current grouping. Slugs are internal; menu shows the
Romanian labels. New-global labels: "Pachete", "Evenimente", "Testimoniale".

## 5. Rendering

Shared intro block in each of the 5 section components:

- Wrapper owns the bottom margin to the content (the gap currently on the heading).
- Render eyebrow **only if** `!hideEyebrow` — styled exactly as today
  (`text-xs uppercase tracking-[0.2em] text-oxblood`, centered where the section centers).
- Render heading **only if** non-empty.
- If **both** absent → emit **no markup** (no wrapper, no ghost margin); content starts
  at the section's normal padding.
- Eyebrow always sits above the heading.

`page.tsx` rewiring: fetch the 3 new globals; pass each section its `eyebrow`,
`hideEyebrow`, `heading`. The eyebrow no longer comes from `nav.*` — it comes from each
Section's own global field.

## 6. Migration — data preservation (the critical part)

Postgres (Neon), `push: false`, **empty migration history**. Per project rules,
`migrate:create` will emit a full from-scratch baseline against an already-populated DB.
**The generated SQL must be hand-edited down to only the delta below** — it must not
attempt to recreate or drop any existing table beyond what is listed here.

**Up — delta only:**

1. `CREATE TABLE packages_section / events_section / testimonials_section` — Payload
   global tables: `id` PK, `eyebrow varchar`, `hide_eyebrow boolean DEFAULT false`,
   `heading varchar`, `updated_at`, `created_at`.
2. `ALTER TABLE about ADD COLUMN hide_eyebrow boolean DEFAULT false;`
   `ALTER TABLE about ALTER COLUMN heading DROP NOT NULL;`
3. `ALTER TABLE services ADD COLUMN eyebrow varchar; ADD COLUMN hide_eyebrow boolean DEFAULT false;`
4. **Copy before drop** — seed the new globals from the old values so nothing is lost:
   - `packages_section` ← (`site_settings.sections_packages_eyebrow`, `sections_packages_heading`)
   - `events_section.heading` ← `site_settings.sections_events_heading`; eyebrow default "Evenimente"
   - `testimonials_section.heading` ← `site_settings.sections_testimonials_heading`; eyebrow default "Testimoniale"
5. `ALTER TABLE site_settings DROP COLUMN sections_packages_eyebrow, sections_packages_heading, sections_events_heading, sections_testimonials_heading;`

**Down:** drop the 3 new tables; drop the added `about`/`services` columns; re-add the
`site_settings.sections_*` columns; restore `about.heading` NOT NULL.

**Untouched (must survive verbatim):** `site_settings` nav + logoAlt, `about`
eyebrow/heading/body/photo, `services` heading + columns, Hero, Contact, all of
`packages`/`events`/`testimonials`/galleries, `media`, `users`. Acceptable loss: the
four `sections_*` columns (and only those) — and even those are copied into the new
globals first.

**Verification:** before writing the migration, introspect the live schema for the
exact column names (group fields flatten to `sections_packages_eyebrow`, etc.); after
running, confirm row counts on every untouched table are unchanged and the 3 new globals
hold the copied values.

## 7. Acceptance criteria

- All 5 section globals expose the identical `eyebrow` + `hideEyebrow` + `heading` trio.
- Admin menu shows Conținut (5 section globals) + Carduri (3 collections); no orphaned
  "section titles" group.
- Front-end renders the 4 intro states correctly, incl. **both-absent → nothing**.
- `pnpm exec payload migrate` applies cleanly against the populated DB with **zero loss**
  on untouched tables; new globals carry the previously-set headings.
- `tsc --noEmit` clean; `payload-types.ts` regenerated.

## 8. Out of scope

Footer/Hero changes, card-data changes, navlink↔eyebrow binding, any visual restyle of
the eyebrow/heading beyond what already shipped.
