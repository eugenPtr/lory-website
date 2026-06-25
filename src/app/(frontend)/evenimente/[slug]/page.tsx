import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import config from '@/payload.config'
import type { Event, Media } from '@/payload-types'
import { resolveMedia } from '../../components/media'
import Gallery, { type GallerySlide } from '../../components/Gallery'
import SiteHeader from '../../components/SiteHeader'
import '../../styles.css'

// Fallback ISR alongside on-demand revalidation (Payload Events hooks). Also lets newly
// published events not present at build time render + cache on first request.
export const revalidate = 300

const dateFmt = new Intl.DateTimeFormat('ro-RO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

// Fetch one published event by slug (read access is public; published gate is explicit).
async function getEvent(slug: string): Promise<Event | null> {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'events',
    where: { and: [{ slug: { equals: slug } }, { published: { equals: true } }] },
    limit: 1,
  })
  return docs[0] ?? null
}

// Pre-render every published event at build (PRD §8 perf). New events fall back to
// on-demand render until the next build, then get cached.
export async function generateStaticParams() {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'events',
    where: { published: { equals: true } },
    limit: 1000,
    select: { slug: true },
  })
  return docs.map((d) => ({ slug: d.slug as string }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) return {}

  const meta = event.meta ?? {}
  const title = meta.title ?? `${event.title} — Lorena Răuță`
  const description =
    meta.description ?? `${event.title} — eveniment realizat de Lorena Răuță, Wedding Planner.`
  const ogImage = resolveMedia(meta.image as Media | number | null) ?? resolveMedia(event.coverImage)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      ...(ogImage?.url ? { images: [{ url: ogImage.url, alt: ogImage.alt ?? event.title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage?.url ? { images: [ogImage.url] } : {}),
    },
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) notFound()

  const payload = await getPayload({ config: await config })
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  const navLabels = {
    despre: 'Despre mine',
    servicii: 'Servicii',
    pachete: 'Pachete',
    evenimente: 'Evenimente',
    testimoniale: 'Testimoniale',
    contact: 'Contact',
  }

  const cover = resolveMedia(event.coverImage)
  const slides: GallerySlide[] = (event.gallery ?? []).flatMap((item) => {
    const img = resolveMedia(item)
    if (!img?.url) return []
    return [
      {
        src: img.url,
        alt: img.alt ?? event.title,
        width: img.width ?? undefined,
        height: img.height ?? undefined,
      },
    ]
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: event.title,
    ...(event.eventDate ? { dateCreated: event.eventDate } : {}),
    ...(cover?.url ? { image: cover.url } : {}),
    creator: { '@type': 'Person', name: 'Lorena Răuță' },
  }

  return (
    <>
      <SiteHeader
        logoAlt={settings.logoAlt ?? 'Lorena Răuță — Wedding Planner'}
        labels={navLabels}
        anchorBase="/"
        forceSolid
      />
      <main id="main-content" className="bg-white">
      <article className="mx-auto max-w-3xl px-6 py-20 lg:py-28">
        <Link
          href="/#evenimente"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-oxblood transition-opacity hover:opacity-70"
        >
          <span aria-hidden="true">←</span>
          Înapoi la evenimente
        </Link>

        <header className="mt-8">
          {event.eventDate && (
            <p className="text-xs uppercase tracking-[0.2em] text-oxblood">
              {dateFmt.format(new Date(event.eventDate))}
            </p>
          )}
          <h1 className="mt-3 font-ivyora text-4xl italic leading-tight text-ink sm:text-5xl">
            {event.title}
          </h1>
        </header>

        {event.body && (
          <div className="mt-8 space-y-4 leading-relaxed text-ink/80 [&_a]:text-oxblood [&_a]:underline [&_h2]:mt-8 [&_h2]:font-ivyora [&_h2]:text-2xl [&_h2]:italic [&_li]:ml-4 [&_li]:list-disc">
            <RichText data={event.body} />
          </div>
        )}

        {slides.length > 0 && (
          <div className="mt-12">
            <Gallery images={slides} />
          </div>
        )}
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      </main>
    </>
  )
}
