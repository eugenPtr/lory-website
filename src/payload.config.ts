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
    // Never auto-sync schema on boot. Dev connects to the prod DB for real data,
    // but must NOT mutate its tables (push wiped the users table before).
    // Schema changes go through migrations (payload migrate:create + migrate).
    push: false,
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      // Wait out Neon cold start (scale-to-zero wake ~0.5-3s) instead of ETIMEDOUT.
      connectionTimeoutMillis: 15000,
      // Homepage fires 6 parallel queries; allow them without exhausting Neon's pooler.
      max: 10,
      // Stop idle sockets being silently dropped → no stale-connection errors.
      keepAlive: true,
    },
  }),
  sharp,
  plugins: [
    // Persistent media on Vercel (serverless disk is ephemeral). PRD §3.
    // Disabled without a token → falls back to local disk for dev.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      // Unique blob name per upload. Without it, two files with the same name (common
      // camera names like IMG_1234.jpg, or re-uploads) collide → "blob already exists".
      addRandomSuffix: true,
      // Direct browser→Blob upload to bypass Vercel's 4.5MB serverless body limit.
      // Only on Vercel: client uploads need a public callbackUrl to register the Media
      // doc, which localhost can't provide (callback never fires → upload lost). Locally
      // the server-upload path has no body limit and needs no callback.
      clientUploads: Boolean(process.env.VERCEL),
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
