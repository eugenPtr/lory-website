import type { GlobalConfig } from 'payload'

// Site-wide settings. S1 ships the navbar labels + logo alt text.
// SEO defaults + JSON-LD org fields are added here in later slices (S10). PRD §6.
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Setări',
  },
  fields: [
    {
      name: 'logoAlt',
      type: 'text',
      required: true,
      defaultValue: 'Lorena Răuță — Wedding Planner',
      admin: {
        description: 'Text alternativ pentru logo (accesibilitate + SEO).',
      },
    },
    {
      // Navbar labels only — the scroll targets (#despre … #contact) are fixed in code.
      name: 'nav',
      type: 'group',
      label: 'Navigație',
      fields: [
        { name: 'despre', type: 'text', required: true, defaultValue: 'Despre mine' },
        { name: 'servicii', type: 'text', required: true, defaultValue: 'Servicii' },
        { name: 'pachete', type: 'text', required: true, defaultValue: 'Pachete' },
        { name: 'evenimente', type: 'text', required: true, defaultValue: 'Evenimente' },
        { name: 'testimoniale', type: 'text', required: true, defaultValue: 'Testimoniale' },
        { name: 'contact', type: 'text', required: true, defaultValue: 'Contact' },
      ],
    },
    {
      // Section intros for the collection-backed sections (PRD §6 SectionIntros).
      // Merged here to keep the global count low (PRD §11 open item).
      name: 'sections',
      type: 'group',
      label: 'Titluri secțiuni',
      fields: [
        {
          name: 'packages',
          type: 'group',
          label: 'Pachete',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'Pachete' },
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'Colaborări pe măsura evenimentului vostru',
            },
          ],
        },
        {
          name: 'events',
          type: 'group',
          label: 'Evenimente',
          fields: [
            { name: 'heading', type: 'text', defaultValue: 'Evenimente' },
          ],
        },
        {
          name: 'testimonials',
          type: 'group',
          label: 'Testimoniale',
          fields: [
            { name: 'heading', type: 'text', defaultValue: 'Ce spun cuplurile' },
          ],
        },
      ],
    },
  ],
}
