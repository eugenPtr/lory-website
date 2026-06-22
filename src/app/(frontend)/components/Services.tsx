import React from 'react'

import Reveal from './Reveal'

type Column = {
  id?: string | null
  title: string
  body: string
}

type Props = {
  heading?: string | null
  columns: Column[]
}

// Services (PRD §7.3). Two columns, no icons. Mist band for section rhythm (PRD §4).
export default function Services({ heading, columns }: Props) {
  return (
    <section id="servicii" className="scroll-mt-16 bg-mist">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        {heading && (
          <h2 className="mb-12 text-center font-display text-3xl italic leading-tight text-ink sm:text-4xl">
            {heading}
          </h2>
        )}
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          {columns.map((col, i) => (
            <Reveal key={col.id ?? i}>
              <h3 className="font-sans text-xl font-medium tracking-wide text-ink">{col.title}</h3>
              <p className="mt-4 leading-relaxed text-ink/80">{col.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
