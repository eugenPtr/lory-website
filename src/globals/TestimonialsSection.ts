import type { GlobalConfig } from 'payload'

// Testimonials section (PRD §7.6). Intro (eyebrow/heading) + the quote cards live in one
// place, mirroring the Services global. Replaces the former `testimonials` collection +
// `testimonials-section` intro global. Slug stays `testimonials-section`
// (table `testimonials_section`) to avoid a table rename; the admin label is "Testimonials".
export const Testimonials: GlobalConfig = {
  slug: 'testimonials-section',
  access: { read: () => true },
  label: 'Testimonials',
  admin: { group: 'Conținut' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Testimoniale',
      admin: { description: 'Eticheta mică deasupra titlului.' },
    },
    {
      name: 'hideEyebrow',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Ascunde eticheta.' },
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Ce spun cuplurile',
      admin: { description: 'Titlu opțional al secțiunii.' },
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Testimoniale',
      admin: { description: '~4 testimoniale. Ordinea de aici = ordinea de afișare.' },
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'authorName', type: 'text', required: true },
        {
          name: 'authorRole',
          type: 'text',
          admin: { description: 'Rol / context (ex. „Mireasă, nuntă 2025”).' },
        },
      ],
    },
  ],
}
