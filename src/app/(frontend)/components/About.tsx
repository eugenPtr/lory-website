import Image from 'next/image'
import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

import Reveal from './Reveal'
import { resolveMedia, type MediaRef } from './media'

type Props = {
  eyebrow?: string | null
  hideEyebrow?: boolean | null
  heading?: string | null
  body?: React.ComponentProps<typeof RichText>['data'] | null
  photo?: MediaRef
}

// About (PRD §7.2). Text left / photo right; stacks on mobile (photo first).
export default function About({ eyebrow, hideEyebrow, heading, body, photo }: Props) {
  const img = resolveMedia(photo)

  return (
    <section id="despre" className="scroll-mt-16 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center md:gap-16 lg:py-28">
        <Reveal className="order-2 md:order-1">
          {!hideEyebrow && eyebrow && (
            <p className="text-xs uppercase tracking-[0.2em] text-oxblood">{eyebrow}</p>
          )}
          {heading && (
            <h2 className="mt-4 font-ivyora italic text-3xl leading-tight text-ink sm:text-4xl">
              {heading}
            </h2>
          )}
          {body && (
            <div className="mt-6 space-y-4 leading-relaxed text-ink/80 [&_a]:text-oxblood [&_a]:underline">
              <RichText data={body} />
            </div>
          )}
        </Reveal>

        <Reveal className="order-1 md:order-2">
          <div className="relative aspect-[4/5] overflow-hidden bg-mist">
            {img?.url && (
              <Image
                src={img.url}
                alt={img.alt ?? ''}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
