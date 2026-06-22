import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Se completează automat din numele fișierului dacă e gol.' },
      hooks: {
        // Default alt to the uploaded file's name (without extension) when left blank.
        // Runs before the required-field check so the auto-fill satisfies validation.
        beforeValidate: [
          ({ value, data, req }) => {
            if (value) return value
            const filename = (data?.filename as string) || req?.file?.name
            return filename ? filename.replace(/\.[^.]+$/, '') : value
          },
        ],
      },
    },
  ],
  upload: true,
}
