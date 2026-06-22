'use client'

import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'

type NavLabels = {
  despre: string
  servicii: string
  pachete: string
  evenimente: string
  testimoniale: string
  contact: string
}

type Props = {
  logoAlt: string
  labels: NavLabels
}

// Anchor targets are fixed in code (PRD §5 IA); only the labels come from the CMS.
const ANCHORS: { id: keyof Omit<NavLabels, 'contact'>; href: string }[] = [
  { id: 'despre', href: '#despre' },
  { id: 'servicii', href: '#servicii' },
  { id: 'pachete', href: '#pachete' },
  { id: 'evenimente', href: '#evenimente' },
  { id: 'testimoniale', href: '#testimoniale' },
]

export default function SiteHeader({ logoAlt, labels }: Props) {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastY = useRef(0)
  const overlayRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Transparent overlay over the hero; solid once past it. Hide on scroll down,
  // reveal on scroll up; never hide while the menu is open. PRD §5.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      // Switch to solid near the end of the full-height hero.
      setScrolled(y >= window.innerHeight - 80)
      if (menuOpen) return
      setHidden(y > lastY.current && y > 80)
      lastY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [menuOpen])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  // Light content (white logo/links) only over the hero with the menu closed.
  const transparent = !scrolled && !menuOpen

  // Lock body scroll, trap focus, ESC to close, restore focus to the toggle. PRD §8.
  useEffect(() => {
    if (!menuOpen) return
    const opener = toggleRef.current
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
        closeMenu()
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
  }, [menuOpen, closeMenu])

  return (
    <header
      role="banner"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        transparent
          ? 'bg-transparent'
          : 'border-b border-mist bg-white/95 backdrop-blur-sm'
      } ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <nav
        aria-label="Principal"
        className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-10"
      >
        {/* Logo → scroll to top. */}
        <a href="#hero" className="flex items-center" onClick={closeMenu}>
          <Image
            src={transparent ? '/logo-white.png' : '/logo-dark.png'}
            alt={logoAlt}
            width={120}
            height={118}
            priority
            className="h-12 w-auto"
          />
        </a>

        {/* Desktop nav. */}
        <ul className="hidden items-center gap-8 md:flex">
          {ANCHORS.map(({ id, href }) => (
            <li key={id}>
              <a
                href={href}
                className={`text-sm tracking-wide transition-colors ${
                  transparent ? 'text-white hover:text-white/70' : 'text-ink hover:text-oxblood'
                }`}
              >
                {labels[id]}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="rounded-full bg-oxblood px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {labels.contact}
            </a>
          </li>
        </ul>

        {/* Mobile hamburger. */}
        <button
          ref={toggleRef}
          type="button"
          className="flex h-11 w-11 items-center justify-center md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Închide meniul' : 'Deschide meniul'}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span aria-hidden="true" className="relative block h-4 w-6">
            <span
              className={`absolute left-0 block h-0.5 w-6 transition-transform duration-300 ${
                transparent ? 'bg-white' : 'bg-ink'
              } ${menuOpen ? 'top-1.5 rotate-45' : 'top-0'}`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-0.5 w-6 transition-opacity duration-300 ${
                transparent ? 'bg-white' : 'bg-ink'
              } ${menuOpen ? 'opacity-0' : 'opacity-100'}`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-6 transition-transform duration-300 ${
                transparent ? 'bg-white' : 'bg-ink'
              } ${menuOpen ? 'top-1.5 -rotate-45' : 'top-3'}`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile full-screen overlay menu. */}
      {menuOpen && (
        <div
          ref={overlayRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Meniu"
          className="fixed inset-0 top-16 z-40 flex flex-col bg-white px-6 pb-10 pt-8 md:hidden"
        >
          <ul className="flex flex-col gap-6">
            {ANCHORS.map(({ id, href }) => (
              <li key={id}>
                <a
                  href={href}
                  onClick={closeMenu}
                  className="font-display text-2xl text-ink transition-colors hover:text-oxblood"
                >
                  {labels[id]}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            onClick={closeMenu}
            className="mt-10 inline-block w-full rounded-full bg-oxblood px-6 py-3 text-center text-base font-medium text-white"
          >
            {labels.contact}
          </a>
        </div>
      )}
    </header>
  )
}
