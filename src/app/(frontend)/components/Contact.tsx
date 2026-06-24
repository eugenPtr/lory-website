import React from 'react'

import type { Contact as ContactData } from '@/payload-types'

type Props = {
  heading: string
  contact: ContactData
}

// Footer / Contact (PRD §7.7). Oxblood band; direct links only (decision #10):
// tappable tel/mailto + Instagram (primary) + Facebook. All copy from the Contact global.
export default function Contact({ heading, contact }: Props) {
  const { email, phone, instagramUrl, facebookUrl, copyright } = contact
  // tel: needs a digits-only target; keep the human-formatted phone for display.
  const telHref = phone ? `tel:${phone.replace(/[^+\d]/g, '')}` : null

  return (
    <footer id="contact" className="scroll-mt-16 bg-oxblood text-white">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <p className="text-center text-xs uppercase tracking-[0.2em]">{heading}</p>

        <div className="mt-10 flex flex-col items-center gap-3 text-lg">
          {telHref && (
            <a
              href={telHref}
              className="inline-flex min-h-11 items-center transition-colors hover:text-white/70"
            >
              {phone}
            </a>
          )}
          <a
            href={`mailto:${email}`}
            className="inline-flex min-h-11 items-center transition-colors hover:text-white/70"
          >
            {email}
          </a>
        </div>

        {(instagramUrl || facebookUrl) && (
          <div className="mt-8 flex items-center justify-center gap-6">
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center transition-colors hover:text-white/70"
              >
                <svg
                  aria-hidden="true"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            )}
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center transition-colors hover:text-white/70"
              >
                <svg
                  aria-hidden="true"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14 9h3l.5-3H14V4.5c0-.9.3-1.5 1.6-1.5H18V.2C17.6.1 16.4 0 15.1 0 12.3 0 10.5 1.7 10.5 4.8V6H8v3h2.5v9H14V9z" />
                </svg>
              </a>
            )}
          </div>
        )}

        {copyright && <p className="mt-12 text-center text-sm text-white/50">{copyright}</p>}
      </div>
    </footer>
  )
}
