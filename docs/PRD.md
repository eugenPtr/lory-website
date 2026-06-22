# PRD — Lorena Răuță Wedding Planner Website

**Status:** Draft for build · **Owner:** Eugen · **Date:** 2026-06-22
**Glossary:** see [`/CONTEXT.md`](../CONTEXT.md) for the ubiquitous language used below.

---

## 1. Overview

A sleek, mobile-first one-page marketing site for **Lorena Răuță**, a Romanian wedding &
event planner, plus dynamic per-event detail pages. The client edits all content, swaps
photos, and adds events/testimonials/packages from the Payload CMS without being able to
break the layout. Discoverability (SEO + AIO) is a first-class goal: humans via Google and
agents/LLMs via structured data + an `llms.txt` summary.

**Voice:** first-person, elegant, warm — "Where planning starts with clarity."
**Language:** Romanian (`lang="ro"`); industry terms kept in English verbatim
("Wedding Planner", "Event Design", "Full-Service planning"). No localization layer.

## 2. Goals & non-goals

**Goals**
- Pixel-considered, on-brand, mobile-first responsive site.
- Full content editability via Payload (text, photos, events, testimonials, packages).
- Strong SEO + AIO so couples and LLM agents find Lorena easily.
- Accessible (WCAG-minded): keyboard, screen-reader, reduced-motion, contrast.

**Non-goals (v1)**
- No contact form (direct links only — mailto/tel/Instagram/Facebook).
- No second language / Payload localization.
- No block-based page builder (fixed structured fields; see §10 decision log).
- No blog, no e-commerce, no client portal, no WhatsApp widget, no FAQ section.

## 3. Tech stack

- **Framework:** Next.js 16 (App Router) + React 19 — already installed.
- **CMS:** Payload 3.85 (`@payloadcms/db-postgres`) — already installed.
- **DB:** Neon Postgres (swap connection string; Supabase works too — any Postgres).
- **Media storage:** `@payloadcms/storage-vercel-blob` (serverless disk is ephemeral).
- **Hosting:** Vercel (single Next app serves frontend `/` + admin `/admin`).
- **Styling:** Tailwind v4 with brand tokens exposed via `@theme` (CSS custom properties).
- **Carousel:** Embla (headless, touch + keyboard + a11y).
- **Lightbox:** `yet-another-react-lightbox` (swipe, arrows, zoom, "n / N" counter).
- **SEO:** `@payloadcms/plugin-seo` for per-document/global meta.
- **Motion:** CSS + IntersectionObserver (subtle reveals); honors `prefers-reduced-motion`.
- **Fonts:** self-hosted via `next/font/local` from `/Fonts` — IvyOra Display, Times, Inter.

## 4. Brand identity → design tokens

Source of truth = `Lorena_Raută_Branding.pdf`. Reference screenshots are used for **layout
only**; all color/type/voice come from the branding doc.

**Colors (CSS vars / Tailwind theme)**
| Token | Hex | Use |
|---|---|---|
| `--color-black` | `#000000` | footer bg, max-contrast text |
| `--color-ink` | `#333333` | primary body text |
| `--color-mist` | `#E6E7E8` | section background bands |
| `--color-white` | `#FFFFFF` | base background |
| `--color-oxblood` | `#4F060C` | accent: CTAs, links, headings, highlights |

**Type**
- `--font-display` → **IvyOra Display** — display titles & subtitles (elegant italic serif).
- `--font-serif` → **Times** — serif accents / optional serif body (testimonial quotes).
- `--font-sans` → **Inter** — predominant body & UI ("clean and sharp").

**Logo:** LR script monogram + "LORENA RĂUȚĂ" + "WEDDING PLANNER". Ship as static SVG/PNG in
`/public` (from `/Logo/vector` + `/Logo/png`); light variant for dark backgrounds, dark for
light. Not a CMS asset (brand-fixed). Provide accessible name "Lorena Răuță — Wedding Planner".

## 5. Information architecture

**Home `/`** (single scroll; navbar items smooth-scroll to anchors):
`#hero` → `#despre` (About) → `#servicii` (Services) → `#pachete` (Packages) →
`#evenimente` (Events) → `#testimoniale` (Testimonials) → `#contact` (Footer).

**Navbar:** Despre mine · Servicii · Pachete · Evenimente · Testimoniale + oxblood **Contact**
button (scrolls to footer). Logo left = scroll to top. Behavior: sticky; **hides on scroll
down, reappears on scroll up**. Mobile = hamburger → full-screen overlay menu (focus-trapped).

**Event detail `/evenimente/[slug]`:** back button (top-left) → title → body → gallery grid →
lightbox. Linked from the Events carousel.

## 6. CMS data model

Convention: **section components are presentational** (content in via props; never fetch their
own Global). This keeps a future migration to a block-based builder to ~1–2 days. (§10)

### Globals
- **SiteSettings** — SEO defaults (title template, default description, default OG image),
  navbar labels, logo alt text, JSON-LD org fields (areaServed, founder name).
- **Hero** — `backgroundImage` (placeholder), `h1` (accessible heading), `tagline`,
  `scrollCueLabel`.
- **About** — `eyebrow` (small-caps), `heading` (italic display), `body` (rich text),
  `photo`.
- **Services** — `heading?`, `columns`: array (2) of `{ title, body }`. No icons.
- **SectionIntros** — small headings/eyebrows for the collection-backed sections:
  `packages {eyebrow, heading}`, `events {heading}`, `testimonials {heading}`.
  (May be merged into SiteSettings to reduce global count — editor-UX call at build.)
- **Contact** — `email`, `phone`, `instagramUrl`, `facebookUrl`, `copyright`.

### Collections
- **Events** — `title`, `slug` (auto from title), `eventDate`, `coverImage`,
  `body` (Lexical rich text), `gallery`: array of `{ image, alt }`, `published` (toggle),
  SEO group (plugin-seo: title/description/og override). Carousel = published, `eventDate`
  desc. No author byline.
- **Testimonials** — `quote`, `authorName`, `authorRole`, `order`. ~4 shown, no avatars.
- **Packages** — `title`, `subtitle`, `cardBullets`: array of `{ text }`,
  `modalContent` (rich text), `highlighted` (toggle), `order`. 2–5 cards render cleanly.
- **Media** — existing; all uploads get an `alt` field (a11y + SEO). Sized variants via Sharp.

## 7. Section specs (layout from references, identity from brand)

1. **Hero** (`#hero`) — full-bleed placeholder photo, centered logo, subtle scroll cue.
   Visually a splash; carries an accessible **H1** + short tagline (integrated near logo,
   not a loud headline). Strongest SEO/AIO signal on the page.
2. **About** (`#despre`) — text left / photo right (stacks on mobile). Small-caps eyebrow,
   italic IvyOra heading, first-person body. Layout per reference Image #1.
3. **Services** (`#servicii`) — 2-column, **no icons**. Column = sans heading + body.
4. **Packages** (`#pachete`) — eyebrow + heading; 2–5 cards, one `highlighted`. Hover =
   lift/emphasis. "Detalii" opens an accessible modal (focus-trap, ESC, restore focus)
   with `modalContent`.
5. **Events** (`#evenimente`) — Embla carousel of event cards (cover image + title overlay,
   prev/next + dots). Card → `/evenimente/[slug]`.
6. **Testimonials** (`#testimoniale`) — heading + ~4 quote cards (serif quote, name, role).
   Responsive: 4-up desktop → carousel/stack on mobile.
7. **Footer/Contact** (`#contact`) — dark (`--color-black`) band. CONTACT heading,
   tappable phone (`tel:`) + email (`mailto:`), Instagram (primary) + Facebook icons,
   copyright line. All fields from the Contact global.

**Event detail page** — back button (top-left, returns to `/#evenimente`), large title,
event date, rich-text body, then a responsive **gallery grid**. Clicking any photo opens the
lightbox (swipe / arrow keys / zoom / "n / N" counter / ESC to close).

## 8. Cross-cutting requirements

**Responsive (mobile-first):** design at 360px up; breakpoints sm/md/lg. Touch targets ≥44px.
Test hero, About stack, Services 2→1 col, package cards, both carousels, gallery grid, mobile
menu, lightbox on small screens.

**Accessibility:** semantic landmarks + skip link; visible focus rings; focus management for
mobile menu, package modal, and lightbox; keyboard nav for both carousels; `alt` on every
image (CMS-provided); contrast checks (avoid light-grey text on white for body); respect
`prefers-reduced-motion` (disable reveals).

**SEO + AIO**
- `generateMetadata` per route (home + each event); titles/descriptions editable in CMS.
- Open Graph + Twitter cards; per-event OG image = cover image.
- `sitemap.ts` (dynamic, includes every published event) + `robots.ts`.
- **JSON-LD:** `Person` + `LocalBusiness` (home — name, wedding-planner role,
  areaServed = Romania, `sameAs` socials, contact), `Service` (packages),
  `Review`/`AggregateRating` (testimonials), `CreativeWork`/`Article` per event page.
- **`/llms.txt`** — generated summary: who Lorena is, services, packages, contact, event
  index — so agents parse her at a glance.
- Clean heading hierarchy (one H1/page), descriptive link text.

**Performance:** `next/image` for all media; lazy-load below-the-fold + gallery; preload
fonts with `display: swap`; keep JS light (Embla + lightbox only where used).

## 9. Build slices (vertical · tracker = this file)

Each slice is independently shippable (CMS + component + responsive + a11y + relevant SEO).
Check off as completed.

- [x] **S0 — Foundation:** install deps (tailwindcss v4, embla-carousel-react,
  yet-another-react-lightbox, @payloadcms/storage-vercel-blob, @payloadcms/plugin-seo);
  configure Tailwind `@theme` brand tokens; self-host fonts via `next/font/local`; Vercel
  Blob adapter + Neon connection string; base layout (`lang="ro"`, skip link, global CSS).
- [x] **S1 — Navbar:** sticky hide-on-down/show-on-up; anchor smooth-scroll; oxblood Contact
  CTA; mobile hamburger → full-screen focus-trapped menu; labels from SiteSettings.
- [x] **S2 — Hero:** Hero global; splash photo + centered logo + accessible H1/tagline +
  scroll cue; placeholder image.
- [x] **S3 — About:** About global; text/photo split; responsive stack; reveal-on-scroll.
- [x] **S4 — Services:** Services global (2 columns, no icons); responsive.
- [x] **S5 — Packages:** Packages collection; cards + highlighted state + hover; accessible
  "Detalii" modal; Service JSON-LD.
- [x] **S6 — Events carousel:** Events collection; Embla carousel of cards; newest-first;
  links to detail route.
- [x] **S7 — Event detail page:** `/evenimente/[slug]`; back button; title/date/body;
  gallery grid + lightbox; per-event metadata + CreativeWork JSON-LD; sitemap entry.
- [x] **S8 — Testimonials:** Testimonials collection; ~4 cards responsive; Review JSON-LD.
- [x] **S9 — Footer/Contact:** Contact global; dark band; tel/mailto/social links; copyright.
- [ ] **S10 — SEO/AIO finish:** generateMetadata + OG everywhere; Person/LocalBusiness JSON-LD;
  `sitemap.ts` + `robots.ts`; `/llms.txt`; OG image defaults.
- [ ] **S11 — Polish & QA:** cross-device responsive pass; a11y audit (keyboard, SR, contrast,
  reduced-motion); Lighthouse; seed branded placeholder content for client handoff.

## 10. Decision log

| # | Decision | Why |
|---|---|---|
| 1 | One-pager + `/evenimente/[slug]` detail pages | Matches references; simplest for a solo brand. |
| 2 | Romanian only, no localization; EN terms verbatim | Single market; halves content effort. |
| 3 | Fixed structured fields (Globals/Collections), no page builder | Editor can't break layout; faster ship. **Note:** not hard to reverse — adding a block builder later is ~1–2 days because section components are presentational; design work carries over. No ADR. |
| 4 | Events: event-date order, newest first, no byline | Byline was leftover from the reference site; it's all Lorena's voice. |
| 5 | Vercel + Vercel Blob + Neon Postgres | Native Next host; persistent media; matches db-postgres. |
| 6 | Layout from screenshots, identity from branding doc | Screenshots are another planner's site; doc is Lorena's brand. |
| 7 | Embla carousel + yet-another-react-lightbox | Accessible/touch out of the box; we keep full styling control. |
| 8 | Packages = editable collection (2–5), modal details | Flexible count; preserves the "Detalii" modal. |
| 9 | Full nav + oxblood Contact CTA; smooth-scroll | Conversion nudge for a service business. |
| 10 | Contact = direct links only (v1) | No form to secure/spam-proof; IG DM is the real channel. |
| 11 | Full SEO + AIO (JSON-LD + llms.txt) | Explicit client goal: humans + agents find her. |
| 12 | Splash hero + accessible integrated H1 | Keep minimalism without losing the page's top ranking signal. |
| 13 | Subtle CSS-driven motion | Reads "sleek", near-zero JS, reduced-motion safe. |
| 14 | Tailwind v4 + CSS-var tokens | Fast mobile-first build; tokens enforce brand consistency. |

## 11. Open items

- Confirm Neon connection string + Vercel Blob token at deploy time.
- Real photography + final Romanian copy (placeholders until provided).
- Domain (implied `lorenarauta.com` from `events@lorenarauta.com`) — DNS at deploy.
- Decide at build whether to merge SectionIntros into SiteSettings (editor-UX nicety).
