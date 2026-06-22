# Context — Lorena Răuță Wedding Planner Site

Ubiquitous language for this project. Glossary only — no implementation details, no specs.

## Terms

### Lorena Răuță
The client. A wedding & event planner. The site is her personal brand site. All
content speaks in her first-person voice ("I", not a company/agency byline).

### Section
A fixed region of the single scrolling homepage. The site is a **one-pager**:
Hero → About → Services → Packages → Events → Testimonials → Footer, in that order.
Navbar items are anchor links that scroll to a Section, not separate pages. Each
Section is editable in the CMS but cannot be reordered or removed by the client.

### Event
A past celebration Lorena organized (a wedding, baptism/botez, civil union/cununie
civilă, etc.). Has a title, an **event date**, a body text telling its story, and a
**Gallery**. Appears as a card in the homepage **Events carousel** and as its own
detail page. Events are listed newest-first by event date. There is no author byline —
everything is Lorena's voice.

### Gallery
The ordered set of photos belonging to one Event, shown as a grid on the event detail
page. Clicking a photo opens the **Lightbox**.

### Lightbox
The full-screen image viewer launched from a Gallery — shows one photo large, with
next/previous navigation and a position counter (e.g. "2 / 34").

### Package
One of Lorena's service offerings, shown as a card in the Packages section
(e.g. Basic Coordination, Full-Service Planning, Partial Planning). Each has a short
bullet list on its card and fuller detail revealed in a **modal**. One package may be
marked as highlighted/featured.

### Testimonial
A short client quote shown in the Testimonials section, with the author's name and a
role/label. Around four are shown.

### Language
Site language is **Romanian** (`lang="ro"`). Specific industry terms stay in English
verbatim as content (e.g. "Wedding Planner", "Event Design", "Full-Service planning").
There is no second-language translation layer.
