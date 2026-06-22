import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

import config from '../src/payload.config'

// One-off seed: upload the hero photo into Media and point the Hero global at it.
// Goes through the Payload local API, so the result is a normal CMS Media doc + a
// Hero.backgroundImage relation the client can change in /admin (PRD §6).
const dirname = path.dirname(fileURLToPath(import.meta.url))
const FILE = 'R6M28666.jpg'

const payload = await getPayload({ config: await config })

const existing = await payload.find({
  collection: 'media',
  where: { filename: { equals: FILE } },
  limit: 1,
})

const mediaDoc =
  existing.docs[0] ??
  (await payload.create({
    collection: 'media',
    data: {
      alt: 'Lorena Răuță, wedding & event planner, zâmbind sprijinită de o canapea crem, în lumină naturală',
    },
    filePath: path.resolve(dirname, '..', FILE),
  }))

await payload.updateGlobal({
  slug: 'hero',
  data: {
    backgroundImage: mediaDoc.id,
    h1: 'Lorena Răuță — Wedding Planner',
  },
})

console.log(`Hero.backgroundImage → media #${mediaDoc.id} (${mediaDoc.filename})`)
process.exit(0)
