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
  ],
}
