// Throwaway dev seed for verifying S6 (Events carousel) + S7 (Event detail page).
// Idempotent: reuses media by filename, skips events that already exist by slug.
// Run: pnpm tsx scripts/seed-s6-s7.ts
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

import config from '../src/payload.config'

const rt = (text: string) => ({
  root: {
    type: 'root',
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children: [
      {
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
      },
    ],
  },
})

const dirname = path.dirname(fileURLToPath(import.meta.url))
const FILE = 'R6M28666.jpg'

const payload = await getPayload({ config: await config })

const existing = await payload.find({
  collection: 'media',
  where: { filename: { equals: FILE } },
  limit: 1,
})

const media =
  existing.docs[0] ??
  (await payload.create({
    collection: 'media',
    data: { alt: 'Fotografie de la un eveniment realizat de Lorena Răuță' },
    filePath: path.resolve(dirname, '..', FILE),
  }))

const events = [
  {
    title: 'Nuntă la Conac',
    eventDate: '2025-09-14T00:00:00.000Z',
    body: 'O nuntă elegantă într-un conac de epocă, cu accente florale și lumină caldă de toamnă.',
  },
  {
    title: 'Eveniment Corporate',
    eventDate: '2025-06-02T00:00:00.000Z',
    body: 'Lansare de brand cu scenografie minimalistă și o experiență fluidă pentru invitați.',
  },
  {
    title: 'Botez în Grădină',
    eventDate: '2024-07-20T00:00:00.000Z',
    body: 'Un botez relaxat în aer liber, cu decor pastelat și momente pline de bucurie.',
  },
]

for (const e of events) {
  const slug = e.title
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const dupe = await payload.find({ collection: 'events', where: { slug: { equals: slug } }, limit: 1 })
  if (dupe.docs[0]) {
    console.log(`event "${e.title}" exists, skip`)
    continue
  }
  await payload.create({
    collection: 'events',
    data: {
      title: e.title,
      eventDate: e.eventDate,
      published: true,
      coverImage: media.id,
      body: rt(e.body),
      gallery: [
        { image: media.id, alt: `${e.title} — fotografie 1` },
        { image: media.id, alt: `${e.title} — fotografie 2` },
        { image: media.id, alt: `${e.title} — fotografie 3` },
      ],
    },
  })
  console.log(`seeded event "${e.title}" (/evenimente/${slug})`)
}

process.exit(0)
