import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import SiteHeader from './components/SiteHeader'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Packages from './components/Packages'
import Events from './components/Events'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import './styles.css'

export default async function HomePage() {
  const payload = await getPayload({ config: await config })
  const [settings, hero, about, services, packages, events, testimonials, eventsCards, contact] =
    await Promise.all([
      payload.findGlobal({ slug: 'site-settings' }),
      payload.findGlobal({ slug: 'hero' }),
      payload.findGlobal({ slug: 'about' }),
      payload.findGlobal({ slug: 'services' }),
      payload.findGlobal({ slug: 'packages-section' }),
      payload.findGlobal({ slug: 'events-section' }),
      payload.findGlobal({ slug: 'testimonials-section' }),
      payload.find({
        collection: 'events',
        where: { published: { equals: true } },
        sort: '-eventDate',
        limit: 24,
      }),
      payload.findGlobal({ slug: 'contact' }),
    ])

  const labels = {
    despre: 'Despre mine',
    servicii: 'Servicii',
    pachete: 'Pachete',
    evenimente: 'Evenimente',
    testimoniale: 'Testimoniale',
    contact: 'Contact',
  }

  return (
    <>
      <SiteHeader logoAlt={settings.logoAlt ?? 'Lorena Răuță — Wedding Planner'} labels={labels} />
      <main id="main-content">
        <Hero
          h1={hero.h1}
          scrollCueLabel={hero.scrollCueLabel}
          backgroundImage={hero.backgroundImage}
        />
        <About
          eyebrow={about.eyebrow}
          hideEyebrow={about.hideEyebrow}
          heading={about.heading}
          body={about.body}
          photo={about.photo}
        />
        <Services
          eyebrow={services.eyebrow}
          hideEyebrow={services.hideEyebrow}
          heading={services.heading}
          columns={services.columns ?? []}
        />
        <Packages
          eyebrow={packages.eyebrow}
          hideEyebrow={packages.hideEyebrow}
          heading={packages.heading}
          packages={packages.cards ?? []}
        />
        <Events
          eyebrow={events.eyebrow}
          hideEyebrow={events.hideEyebrow}
          heading={events.heading}
          events={eventsCards.docs}
        />
        <Testimonials
          eyebrow={testimonials.eyebrow}
          hideEyebrow={testimonials.hideEyebrow}
          heading={testimonials.heading}
          testimonials={testimonials.cards ?? []}
        />
      </main>
      <Contact heading={labels.contact} contact={contact} />
    </>
  )
}
