import type { CollectionConfig } from 'payload'

// Testimonials (PRD §6 / §7.6). ~4 quote cards, no avatars. Presentational consumer.
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Conținut',
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'authorRole', 'order'],
  },
  defaultSort: 'order',
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'authorName', type: 'text', required: true },
    {
      name: 'authorRole',
      type: 'text',
      admin: { description: 'Rol / context (ex. „Mireasă, nuntă 2025”).' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Ordinea de afișare (crescător).' },
    },
  ],
}
