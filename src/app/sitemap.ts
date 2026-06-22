import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'

import config from '@/payload.config'

// Dynamic sitemap: home + every published event (PRD §8). Base URL from env, defaults to
// the implied production domain (PRD §11). S10 expands robots.ts / OG defaults / llms.txt.
const SITE_URL = (process.env.SITE_URL ?? 'https://lorenarauta.com').replace(/\/$/, '')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'events',
    where: { published: { equals: true } },
    limit: 1000,
    select: { slug: true, updatedAt: true },
  })

  const events: MetadataRoute.Sitemap = docs.map((d) => ({
    url: `${SITE_URL}/evenimente/${d.slug}`,
    lastModified: d.updatedAt ? new Date(d.updatedAt) : undefined,
  }))

  return [{ url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 }, ...events]
}
