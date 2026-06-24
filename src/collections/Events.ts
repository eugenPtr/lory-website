import type { CollectionConfig } from 'payload'

// Slug from title: lowercase, strip Romanian diacritics (ă â î ș ț → a a i s t via NFD +
// diacritic strip), non-alphanumerics → hyphens. Editable in the sidebar; auto-filled blank.
const slugify = (input: string): string =>
  input
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Events (PRD §6 / §7.5 / §7 detail). Each published Event is both a carousel card on the
// home page and its own page at /evenimente/[slug]. The client adds events in admin — no
// page builder needed (decision #3). Presentational components receive docs via props.
export const Events: CollectionConfig = {
  slug: 'events',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Conținut',
    useAsTitle: 'title',
    defaultColumns: ['title', 'eventDate', 'published'],
    components: {
      // Section intro (eyebrow/heading) edited inline above the list, so everything under
      // "Events" lives on one page. Backed by the hidden `events-section` global.
      beforeListTable: ['/components/admin/EventsSectionIntro#EventsSectionIntro'],
    },
  },
  // Carousel order: newest first (decision #4). Detail queries hit the slug directly.
  defaultSort: '-eventDate',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL: /evenimente/[slug]. Se completează automat din titlu dacă e gol.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const source = (value as string) || (data?.title as string) || ''
            return source ? slugify(source) : value
          },
        ],
      },
    },
    {
      name: 'eventDate',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Data evenimentului (determină ordinea în carusel — cel mai nou primul).',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' },
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Afișează evenimentul în carusel și publică pagina lui.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Imaginea de copertă (card carusel + OG / SEO).' },
    },
    {
      name: 'body',
      type: 'richText',
      admin: { description: 'Conținutul paginii evenimentului.' },
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Galerie',
      admin: {
        description:
          'Fotografiile afișate în grila cu lightbox. Încarci mai multe deodată (selectează ' +
          'sau trage fișierele în zona de upload). Textul alternativ vine din fișa Media.',
      },
    },
  ],
}
