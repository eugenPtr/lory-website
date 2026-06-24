import React from 'react'

import Reveal from './Reveal'

type Column = {
  id?: string | null
  title: string
  body: string
}

type Props = {
  eyebrow?: string | null
  hideEyebrow?: boolean | null
  heading?: string | null
  columns: Column[]
}

// Services (PRD §7.3). Two columns, no icons. Mist band for section rhythm (PRD §4).
export default function Services({ eyebrow, hideEyebrow, heading, columns }: Props) {
  const showEyebrow = !hideEyebrow && !!eyebrow
  const showIntro = showEyebrow || !!heading

  return (
    <section id="servicii" className="scroll-mt-16 bg-mist">
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
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          {columns.map((col, i) => (
            <Reveal key={col.id ?? i}>
              <h3 className="font-ivyora italic text-xl font-medium tracking-wide text-ink">
                {col.title}
              </h3>
              <p className="mt-4 leading-relaxed text-ink/80">{col.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
