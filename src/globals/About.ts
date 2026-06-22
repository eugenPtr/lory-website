import type { GlobalConfig } from 'payload'

// About section content. Text left / photo right (PRD §7.2). Presentational consumer.
export const About: GlobalConfig = {
  slug: 'about',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Conținut',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Despre mine',
      admin: {
        description: 'Eticheta mică (small-caps) deasupra titlului.',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Planificare cu claritate, de la prima conversație',
      admin: {
        description: 'Titlu în display italic.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      admin: {
        description: 'Text la persoana întâi.',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
