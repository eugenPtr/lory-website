'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

import Reveal from './Reveal'
import type { Package } from '@/payload-types'

type Props = {
  eyebrow?: string | null
  heading?: string | null
  packages: Package[]
}

// Packages (PRD §7.4). 2–5 cards, one may be highlighted; hover lift; "Detalii" opens an
// accessible modal (focus-trap, ESC, restore focus). Service JSON-LD for AIO (PRD §8).
export default function Packages({ eyebrow, heading, packages }: Props) {
  const [openId, setOpenId] = useState<number | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)

  const active = packages.find((p) => p.id === openId) ?? null
  const close = useCallback(() => setOpenId(null), [])

  // Lock scroll, trap focus, ESC to close, restore focus to the opener. PRD §8.
  useEffect(() => {
    if (openId === null) return
    const opener = openerRef.current
    document.body.style.overflow = 'hidden'

    const focusables = () =>
      Array.from(
        overlayRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ) ?? [],
      )
    focusables()[0]?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key !== 'Tab') return
      const els = focusables()
      if (els.length === 0) return
      const first = els[0]
      const last = els[els.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      opener?.focus()
    }
  }, [openId, close])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': packages.map((p) => ({
      '@type': 'Service',
      name: p.title,
      ...(p.subtitle ? { description: p.subtitle } : {}),
      serviceType: 'Wedding planning',
      areaServed: 'Romania',
      provider: { '@type': 'Person', name: 'Lorena Răuță' },
    })),
  }

  return (
    <section id="pachete" className="scroll-mt-16 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        {eyebrow && (
          <p className="text-center text-xs uppercase tracking-[0.2em] text-oxblood">{eyebrow}</p>
        )}
        {heading && (
          <h2 className="mx-auto mt-4 max-w-2xl text-center font-display text-3xl italic leading-tight text-ink sm:text-4xl">
            {heading}
          </h2>
        )}

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((p) => (
            <Reveal key={p.id}>
              <article
                className={`flex h-full flex-col rounded-lg border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  p.highlighted
                    ? 'border-oxblood bg-oxblood/5 shadow-md ring-1 ring-oxblood'
                    : 'border-mist bg-white'
                }`}
              >
                <h3 className="font-display text-2xl italic text-ink">{p.title}</h3>
                {p.subtitle && <p className="mt-2 text-sm text-ink/70">{p.subtitle}</p>}
                {p.cardBullets && p.cardBullets.length > 0 && (
                  <ul className="mt-6 space-y-2 text-sm leading-relaxed text-ink/80">
                    {p.cardBullets.map((b, bi) => (
                      <li key={b.id ?? bi} className="flex gap-2">
                        <span aria-hidden="true" className="mt-px text-oxblood">
                          —
                        </span>
                        <span>{b.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {p.modalContent && (
                  <button
                    type="button"
                    onClick={(e) => {
                      openerRef.current = e.currentTarget
                      setOpenId(p.id)
                    }}
                    className={`mt-8 inline-flex min-h-11 items-center justify-center self-start rounded-full px-6 text-sm font-medium transition-opacity hover:opacity-90 ${
                      p.highlighted
                        ? 'bg-oxblood text-white'
                        : 'border border-oxblood text-oxblood'
                    }`}
                    aria-haspopup="dialog"
                  >
                    Detalii
                  </button>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Accessible "Detalii" modal. */}
      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="presentation"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={close}
            aria-hidden="true"
          />
          <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-8 shadow-xl"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Închide"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center text-ink/60 transition-colors hover:text-oxblood"
            >
              <span aria-hidden="true" className="text-2xl leading-none">
                ×
              </span>
            </button>
            <h3 className="pr-10 font-display text-2xl italic text-ink">{active.title}</h3>
            {active.subtitle && <p className="mt-1 text-sm text-ink/70">{active.subtitle}</p>}
            {active.modalContent && (
              <div className="mt-6 space-y-4 leading-relaxed text-ink/80 [&_a]:text-oxblood [&_a]:underline [&_h3]:font-display [&_h3]:text-xl [&_li]:ml-4 [&_li]:list-disc">
                <RichText data={active.modalContent} />
              </div>
            )}
          </div>
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  )
}
