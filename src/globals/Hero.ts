import type { GlobalConfig } from 'payload'

// Hero splash. Presentational component receives these via props (PRD §6 convention).
// Strongest SEO/AIO signal: carries the accessible H1. PRD §7.1 / decision #12.
export const Hero: GlobalConfig = {
  slug: 'hero',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Conținut',
  },
  fields: [
    {
      name: 'h1',
      type: 'text',
      required: true,
      defaultValue: 'Lorena Răuță — Wedding Planner',
      admin: {
        description:
          'Titlu accesibil (H1), citit de motoare de căutare/asistenți. Nu e afișat vizual — hero arată doar logo-ul.',
      },
    },
    {
      name: 'scrollCueLabel',
      type: 'text',
      defaultValue: 'Derulează',
      admin: {
        description: 'Eticheta indiciului de derulare (jos, centrat).',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Fotografie full-bleed (placeholder până la fotografia reală).',
      },
    },
  ],
}
