'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

import { resolveMedia } from './media'
import type { Event } from '@/payload-types'

type Props = {
  heading?: string | null
  events: Event[]
}

const dateFmt = new Intl.DateTimeFormat('ro-RO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

// Events carousel (PRD §7.5). Embla cards (cover + title/date overlay), newest-first,
// prev/next + dots. Each card → /evenimente/[slug]. Touch + keyboard + a11y out of the box.
export default function Events({ heading, events }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: false })
  const [selected, setSelected] = useState(0)
  const [snaps, setSnaps] = useState<number[]>([])
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  useEffect(() => {
    if (!emblaApi) return
    const update = () => {
      setSelected(emblaApi.selectedScrollSnap())
      setSnaps(emblaApi.scrollSnapList())
      setCanPrev(emblaApi.canScrollPrev())
      setCanNext(emblaApi.canScrollNext())
    }
    // Embla has no post-subscribe init event, so seed once from the fresh instance, then
    // sync on its events.
    update()
    emblaApi.on('select', update).on('reInit', update)
    return () => {
      emblaApi.off('select', update).off('reInit', update)
    }
  }, [emblaApi])

  // Autoplay: advance every 5s, wrapping to the start once the last snap is reached.
  useEffect(() => {
    if (!emblaApi) return
    const id = setInterval(() => {
      if (emblaApi.canScrollNext()) emblaApi.scrollNext()
      else emblaApi.scrollTo(0)
    }, 5000)
    return () => clearInterval(id)
  }, [emblaApi])

  if (events.length === 0) return null

  return (
    <section id="evenimente" className="scroll-mt-16 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        {heading && (
          <h2 className="mb-12 text-center font-display text-3xl italic leading-tight text-ink sm:text-4xl">
            {heading}
          </h2>
        )}

        <div className="overflow-hidden" ref={emblaRef}>
          <ul className="-ml-6 flex">
            {events.map((event) => {
              const cover = resolveMedia(event.coverImage)
              return (
                <li
                  key={event.id}
                  className="min-w-0 shrink-0 grow-0 basis-full pl-6 sm:basis-1/2 lg:basis-1/3"
                >
                  <Link
                    href={`/evenimente/${event.slug}`}
                    className="group relative block aspect-[3/4] overflow-hidden rounded-lg bg-mist focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oxblood"
                  >
                    {cover?.url && (
                      <Image
                        src={cover.url}
                        alt={cover.alt ?? ''}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      {event.eventDate && (
                        <p className="text-xs uppercase tracking-[0.2em] text-white/80">
                          {dateFmt.format(new Date(event.eventDate))}
                        </p>
                      )}
                      <h3 className="mt-2 font-display text-2xl italic text-white">{event.title}</h3>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {snaps.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canPrev}
              aria-label="Evenimentul anterior"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-oxblood text-oxblood transition-opacity hover:opacity-70 disabled:opacity-30"
            >
              <span aria-hidden="true">‹</span>
            </button>

            <div className="flex items-center gap-2">
              {snaps.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Mergi la grupul ${i + 1}`}
                  aria-current={i === selected}
                  className={`h-2 rounded-full transition-all ${
                    i === selected ? 'w-6 bg-oxblood' : 'w-2 bg-ink/25 hover:bg-ink/40'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canNext}
              aria-label="Evenimentul următor"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-oxblood text-oxblood transition-opacity hover:opacity-70 disabled:opacity-30"
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
