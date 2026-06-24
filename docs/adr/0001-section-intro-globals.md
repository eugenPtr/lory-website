# Per-section intro globals with an editable eyebrow

**Status:** accepted · **Date:** 2026-06-24

## Decision

Each of the 5 content Sections (About, Services, Packages, Events, Testimonials) is
configured through its **own Payload global page** carrying a uniform trio of fields:
an **Eyebrow** (editable text), a **hide-eyebrow toggle**, and an **optional Section
heading**. About and Services already exist as globals; Packages, Events and
Testimonials gain new "section" globals (`packages-section`, `events-section`,
`testimonials-section`) that sit alongside — but separate from — their card
collections. The admin menu is reorganized into **Conținut** (the 5 section globals)
and **Carduri** (the 3 card collections). The previous `SiteSettings.sections` group is
removed and its heading values migrated into the new globals.

## Why

The client must edit every Section the same way, with no chance of the layout breaking.
A single uniform editing surface ("looks like the About page") was the explicit goal,
which outweighed keeping the admin menu untouched.

## Considered options

- **Derived eyebrow (no field), text pulled from the navlink.** Rejected: guarantees
  consistency but the client cannot word the eyebrow differently from the nav item, and
  the About page already exposed an editable Eyebrow the client expects to keep.
- **Same fields, menu unchanged** — keep the 3 collection-section intros inside Site
  Settings. Rejected: the editing experience stays split (2 sections on their own page,
  3 buried in Settings), which the client explicitly did not want.

## Consequences

- Three thin globals **shadow** the same-named collections. A future reader will see
  `packages-section` (a global) next to `packages` (a collection) and must understand
  the global holds the Section's intro while the collection holds its Cards. The
  **Carduri** menu group exists to make that split legible.
- Eyebrow and navlink can drift, since the eyebrow is now an independent value
  (defaulted to the navlink wording, not bound to it).
- Schema change requires a hand-edited Payload migration (the repo's migration history
  is empty and `push: false`).
