import type { GlobalConfig } from 'payload'

// Packages section (PRD §7.4). Intro (eyebrow/heading) + the package cards live in one
// place, mirroring the Services global. Replaces the former `packages` collection +
// `packages-section` intro global. Slug stays `packages-section` (table `packages_section`)
// to avoid a table rename; the admin label is "Packages".
export const Packages: GlobalConfig = {
  slug: 'packages-section',
  access: { read: () => true },
  label: 'Packages',
  admin: { group: 'Conținut' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Pachete',
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
      defaultValue: 'Colaborări pe măsura evenimentului vostru',
      admin: { description: 'Titlu opțional al secțiunii.' },
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Pachete',
      admin: { description: '2–5 pachete. Ordinea de aici = ordinea de afișare.' },
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
      ],
    },
  ],
}
