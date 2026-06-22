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
  const [settings, hero, about, services, packages, events, testimonials, contact] =
    await Promise.all([
      payload.findGlobal({ slug: 'site-settings' }),
      payload.findGlobal({ slug: 'hero' }),
      payload.findGlobal({ slug: 'about' }),
      payload.findGlobal({ slug: 'services' }),
      payload.find({ collection: 'packages', sort: 'order', limit: 5 }),
      payload.find({
        collection: 'events',
        where: { published: { equals: true } },
        sort: '-eventDate',
        limit: 24,
      }),
      payload.find({ collection: 'testimonials', sort: 'order', limit: 4 }),
      payload.findGlobal({ slug: 'contact' }),
    ])

  const labels = {
    despre: settings.nav?.despre ?? 'Despre mine',
    servicii: settings.nav?.servicii ?? 'Servicii',
    pachete: settings.nav?.pachete ?? 'Pachete',
    evenimente: settings.nav?.evenimente ?? 'Evenimente',
    testimoniale: settings.nav?.testimoniale ?? 'Testimoniale',
    contact: settings.nav?.contact ?? 'Contact',
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
          heading={about.heading}
          body={about.body}
          photo={about.photo}
        />
        <Services heading={services.heading} columns={services.columns ?? []} />
        <Packages
          eyebrow={settings.sections?.packages?.eyebrow}
          heading={settings.sections?.packages?.heading}
          packages={packages.docs}
        />
        <Events heading={settings.sections?.events?.heading} events={events.docs} />
        <Testimonials
          heading={settings.sections?.testimonials?.heading}
          testimonials={testimonials.docs}
        />
      </main>
      <Contact heading={labels.contact} contact={contact} />
    </>
  )
}
