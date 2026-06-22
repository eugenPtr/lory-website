import Image from 'next/image'
import React from 'react'

import { resolveMedia, type MediaRef } from './media'

type Props = {
  h1: string
  scrollCueLabel?: string | null
  backgroundImage?: MediaRef
  scrollCueHref?: string
}

// Hero splash (PRD §7.1). Full-bleed photo + centered white logo, no visible copy.
// The crop is pinned right so the subject stays clear of the logo; an sr-only H1 keeps
// the page's accessible name + SEO/AIO signal (PRD §8 / decision #12).
export default function Hero({
  h1,
  scrollCueLabel,
  backgroundImage,
  scrollCueHref = '#despre',
}: Props) {
  const bg = resolveMedia(backgroundImage)

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-black"
    >
      <h1 className="sr-only">{h1}</h1>

      {bg?.url && (
        <Image
          src={bg.url}
          alt={bg.alt ?? ''}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[78%_50%]"
        />
      )}
      {/* Darkening scrim → white logo stays legible over the photo. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/25 to-black/50" />

      {/* Brand mark is decorative; the sr-only H1 carries the accessible name. */}
      <Image
        src="/logo-white.png"
        alt=""
        aria-hidden="true"
        width={503}
        height={496}
        priority
        className="relative z-10 h-auto w-64 sm:w-72 lg:w-80"
      />

      {/* Subtle scroll cue. */}
      <a
        href={scrollCueHref}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/70 transition-colors hover:text-white"
      >
        <span className="text-xs uppercase tracking-[0.2em]">{scrollCueLabel}</span>
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="motion-safe:animate-bounce"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  )
}
