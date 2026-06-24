import type { GlobalConfig } from 'payload'

// Events section intro (eyebrow/heading). Events themselves stay a collection (each has
// its own /evenimente/[slug] page + SEO), so this intro can't fold into an array like
// Packages/Testimonials. Instead it's hidden from the nav and edited inline above the
// Events list via the `beforeList` component on the Events collection.
export const Events: GlobalConfig = {
  slug: 'events-section',
  access: { read: () => true },
  label: 'Evenimente',
  admin: { group: 'Conținut', hidden: true },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Evenimente',
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
      admin: { description: 'Titlu opțional al secțiunii.' },
    },
  ],
}
