import React from 'react'

import { inter, ivyOra } from './fonts'
import './styles.css'

export const metadata = {
  title: 'Lorena Răuță — Wedding Planner',
  description:
    'Wedding & Event planning în România. Where planning starts with clarity — Lorena Răuță.',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="ro" className={`${ivyOra.variable} ${inter.variable}`}>
      <body className="font-inter">
        <a href="#main-content" className="skip-link">
          Sari la conținut
        </a>
        {children}
      </body>
    </html>
  )
}
