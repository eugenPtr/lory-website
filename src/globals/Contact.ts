import type { GlobalConfig } from 'payload'

import { revalidateHome } from '../hooks/revalidate'

// Contact / footer (PRD §6 / §7.7). Direct links only (decision #10): tel/mailto + socials.
export const Contact: GlobalConfig = {
  hooks: { afterChange: [revalidateHome] },
  slug: 'contact',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Conținut',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      defaultValue: 'events@lorenarauta.com',
    },
    {
      name: 'phone',
      type: 'text',
      admin: { description: 'Număr de telefon (afișat și folosit în link tel:).' },
    },
    { name: 'instagramUrl', type: 'text', label: 'Instagram URL' },
    { name: 'facebookUrl', type: 'text', label: 'Facebook URL' },
    {
      name: 'copyright',
      type: 'text',
      defaultValue: '© Lorena Răuță — Wedding Planner',
    },
  ],
}
