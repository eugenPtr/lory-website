// Throwaway dev seed for verifying S5 (Packages), S8 (Testimonials), S9 (Contact).
// Idempotent: skips collections that already have docs. Run: pnpm tsx scripts/seed-s5-s8-s9.ts
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const rt = (text: string) => ({
  root: {
    type: 'root',
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children: [
      {
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
      },
    ],
  },
})

const run = async () => {
  const payload = await getPayload({ config: await config })

  // Packages & Testimonials are now arrays on their section globals (not collections).
  const pkgGlobal = await payload.findGlobal({ slug: 'packages-section' })
  if (!pkgGlobal.cards || pkgGlobal.cards.length === 0) {
    await payload.updateGlobal({
      slug: 'packages-section',
      data: {
        cards: [
          {
            title: 'Essential',
            subtitle: 'Coordonare în ziua nunții',
            highlighted: false,
            cardBullets: [{ text: 'Calendar detaliat al zilei' }, { text: 'Coordonare furnizori' }, { text: 'Prezență pe tot parcursul evenimentului' }],
            modalContent: rt('Pachetul Essential acoperă coordonarea completă a zilei nunții, astfel încât voi să vă bucurați fără griji.'),
          },
          {
            title: 'Signature',
            subtitle: 'Planificare completă + design',
            highlighted: true,
            cardBullets: [{ text: 'Tot din Essential' }, { text: 'Concept & design de eveniment' }, { text: 'Gestionare buget & furnizori' }, { text: 'Întâlniri lunare' }],
            modalContent: rt('Pachetul Signature combină planificarea cap-coadă cu direcția vizuală completă a evenimentului.'),
          },
          {
            title: 'Full-Service',
            subtitle: 'Experiență fără compromisuri',
            highlighted: false,
            cardBullets: [{ text: 'Tot din Signature' }, { text: 'Disponibilitate prioritară' }, { text: 'Producție & logistică extinsă' }],
            modalContent: rt('Pachetul Full-Service oferă o experiență completă, de la primul concept până la ultimul dans.'),
          },
        ],
      },
    })
    console.log('seeded packages')
  } else console.log('packages exist, skip')

  const tGlobal = await payload.findGlobal({ slug: 'testimonials-section' })
  if (!tGlobal.cards || tGlobal.cards.length === 0) {
    await payload.updateGlobal({
      slug: 'testimonials-section',
      data: {
        cards: [
          { quote: 'Lorena a transformat ziua noastră într-o poveste perfectă, fără niciun stres.', authorName: 'Ana & Mihai', authorRole: 'Mireasă & mire, 2025' },
          { quote: 'Profesionalism și eleganță în fiecare detaliu. Recomand din toată inima.', authorName: 'Ioana P.', authorRole: 'Mireasă, 2024' },
          { quote: 'Ne-a ascultat dorințele și le-a depășit. O experiență de neuitat.', authorName: 'Cristina & Radu', authorRole: 'Cuplu, 2025' },
          { quote: 'Cea mai bună decizie din tot procesul de planificare a fost colaborarea cu Lorena.', authorName: 'Elena D.', authorRole: 'Mireasă, 2024' },
        ],
      },
    })
    console.log('seeded testimonials')
  } else console.log('testimonials exist, skip')

  await payload.updateGlobal({
    slug: 'contact',
    data: {
      email: 'events@lorenarauta.com',
      phone: '+40 712 345 678',
      instagramUrl: 'https://instagram.com/lorenarauta',
      facebookUrl: 'https://facebook.com/lorenarauta',
      copyright: '© Lorena Răuță — Wedding Planner',
    },
  })
  console.log('contact global set')

  process.exit(0)
}

run()
