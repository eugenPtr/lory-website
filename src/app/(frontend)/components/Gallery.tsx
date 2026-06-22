'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/counter.css'

export type GallerySlide = {
  src: string
  alt: string
  width?: number
  height?: number
}

type Props = {
  images: GallerySlide[]
}

// Gallery grid + lightbox (PRD §7 detail). Click any photo → swipe / arrow keys / zoom /
// "n / N" counter / ESC. Lightbox is client-only; the grid keeps next/image optimisation.
export default function Gallery({ images }: Props) {
  const [index, setIndex] = useState(-1)

  if (images.length === 0) return null

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {images.map((img, i) => (
          <li key={`${img.src}-${i}`}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Deschide imaginea ${i + 1} din ${images.length}`}
              className="group relative block aspect-square w-full overflow-hidden rounded-lg bg-mist focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oxblood"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={images}
        plugins={[Counter, Zoom]}
        counter={{ container: { style: { top: 'unset', bottom: 0 } } }}
      />
    </>
  )
}
