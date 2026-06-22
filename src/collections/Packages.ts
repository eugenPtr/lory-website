import type { CollectionConfig } from 'payload'

// Packages (PRD §6 / §7.4). 2–5 cards, one may be highlighted. "Detalii" opens a modal
// with modalContent. Presentational component receives docs via props (PRD §6 convention).
export const Packages: CollectionConfig = {
  slug: 'packages',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Conținut',
    useAsTitle: 'title',
    defaultColumns: ['title', 'highlighted', 'order'],
  },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'subtitle',
      type: 'text',
      admin: { description: 'Subtitlu scurt afișat pe card.' },
    },
    {
      name: 'cardBullets',
      type: 'array',
      label: 'Puncte cheie (card)',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'modalContent',
      type: 'richText',
      admin: { description: 'Conținut detaliat afișat în modalul „Detalii”.' },
    },
    {
      name: 'highlighted',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Evidențiază acest pachet (accent oxblood).' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Ordinea de afișare (crescător).' },
    },
  ],
}
