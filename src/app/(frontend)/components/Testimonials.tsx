import React from 'react'

import Reveal from './Reveal'
import type { TestimonialsSection } from '@/payload-types'

// Cards now live on the `testimonials-section` global as an array (array ids are strings).
type Testimonial = NonNullable<TestimonialsSection['cards']>[number]

type Props = {
  eyebrow?: string | null
  hideEyebrow?: boolean | null
  heading?: string | null
  testimonials: Testimonial[]
}

// Testimonials (PRD §7.6). ~4 serif-quote cards; 4-up desktop → stack on mobile.
// Review JSON-LD (itemReviewed = Lorena) for AIO (PRD §8).
export default function Testimonials({ eyebrow, hideEyebrow, heading, testimonials }: Props) {
  const showEyebrow = !hideEyebrow && !!eyebrow
  const showIntro = showEyebrow || !!heading
  if (testimonials.length === 0) return null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': testimonials.map((t) => ({
      '@type': 'Review',
      reviewBody: t.quote,
      author: { '@type': 'Person', name: t.authorName },
      itemReviewed: { '@type': 'Person', name: 'Lorena Răuță' },
    })),
  }

  return (
    <section id="testimoniale" className="scroll-mt-16 bg-mist">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        {showIntro && (
          <div className="mb-12">
            {showEyebrow && (
              <p className="text-center text-xs uppercase tracking-[0.2em] text-oxblood">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="mx-auto mt-4 max-w-2xl text-center font-ivyora italic text-3xl leading-tight text-ink sm:text-4xl">
                {heading}
              </h2>
            )}
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <Reveal key={t.id}>
              <figure className="flex h-full flex-col rounded-lg bg-white p-6 shadow-sm">
                <blockquote className="flex-1 font-times text-lg italic leading-relaxed text-ink">
                  <span aria-hidden="true" className="text-oxblood">
                    “
                  </span>
                  {t.quote}
                  <span aria-hidden="true" className="text-oxblood">
                    ”
                  </span>
                </blockquote>
                <figcaption className="mt-6">
                  <p className="font-medium text-ink">{t.authorName}</p>
                  {t.authorRole && <p className="text-sm text-ink/60">{t.authorRole}</p>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  )
}
