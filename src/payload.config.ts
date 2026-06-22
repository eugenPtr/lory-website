import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { seoPlugin } from '@payloadcms/plugin-seo'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Packages } from './collections/Packages'
import { Testimonials } from './collections/Testimonials'
import { Events } from './collections/Events'
import { SiteSettings } from './globals/SiteSettings'
import { Hero } from './globals/Hero'
import { About } from './globals/About'
import { Services } from './globals/Services'
import { Contact } from './globals/Contact'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Packages, Testimonials, Events],
  globals: [SiteSettings, Hero, About, Services, Contact],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    // Persistent media on Vercel (serverless disk is ephemeral). PRD §3.
    // Disabled without a token → falls back to local disk for dev.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
    // Per-event SEO overrides (PRD §6 Events SEO group / §7 detail metadata).
    // Adds a `meta` group (title/description/image) to events; sensible defaults generated.
    seoPlugin({
      collections: ['events'],
      uploadsCollection: 'media',
      tabbedUI: false,
      generateTitle: ({ doc }: { doc?: { title?: string } }) =>
        doc?.title ? `${doc.title} — Lorena Răuță` : 'Lorena Răuță — Wedding Planner',
      generateDescription: ({ doc }: { doc?: { title?: string } }) =>
        doc?.title ? `${doc.title} — eveniment realizat de Lorena Răuță, Wedding Planner.` : '',
    }),
  ],
})
