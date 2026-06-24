import type { GlobalConfig } from 'payload'

// Services: 2 columns, no icons (PRD §7.3). Fixed at 2 rows to protect the layout.
export const Services: GlobalConfig = {
  slug: 'services',
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
      defaultValue: 'Servicii',
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
      admin: {
        description: 'Titlu opțional al secțiunii.',
      },
    },
    {
      name: 'columns',
      type: 'array',
      label: 'Coloane',
      minRows: 2,
      maxRows: 2,
      defaultValue: [
        {
          title: 'Full-Service Wedding Planning',
          body: 'Coordonare completă, de la concept la ziua nunții — furnizori, buget, calendar și logistică, gestionate cap-coadă.',
        },
        {
          title: 'Event Design',
          body: 'Direcție vizuală și design de eveniment care transformă spațiul într-o poveste coerentă, fidelă stilului vostru.',
        },
      ],
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
  ],
}
