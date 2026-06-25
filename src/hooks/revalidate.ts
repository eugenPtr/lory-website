import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

// On-demand revalidation. Frontend pages are statically rendered (build-time snapshot);
// without this every CMS edit stays invisible until the next deploy. These hooks bust the
// cache for the affected paths the moment content changes.

// Every global (About, Hero, Services, etc.) is rendered into the home page, so any change
// to one must regenerate `/`.
export const revalidateHome: GlobalAfterChangeHook = ({ doc }) => {
  revalidatePath('/')
  return doc
}

// An event appears both on the home carousel (`/`) and its own detail page. Revalidate both
// on create/update so new + edited events surface immediately.
export const revalidateEvent: CollectionAfterChangeHook = ({ doc }) => {
  revalidatePath('/')
  if (doc?.slug) revalidatePath(`/evenimente/${doc.slug}`)
  return doc
}

// Same paths on delete/unpublish — `doc` is the document as it was before removal.
export const revalidateEventDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidatePath('/')
  if (doc?.slug) revalidatePath(`/evenimente/${doc.slug}`)
  return doc
}

// Media is referenced by relation (events' coverImage/gallery/meta.image, the Hero and
// About globals), so replacing a file or editing a Media doc leaves the referencing docs'
// rows untouched — their afterChange hooks never fire and the pages stay stale. (This is the
// "I changed the cover image and nothing updates" bug.) A Media change can touch the home
// page and *any* event detail page, so revalidate the home page plus every event route via
// the dynamic-segment wildcard (`'page'` busts all `/evenimente/<anything>`).
const revalidateAllMediaConsumers = () => {
  revalidatePath('/')
  revalidatePath('/evenimente/[slug]', 'page')
}

export const revalidateMedia: CollectionAfterChangeHook = ({ doc }) => {
  revalidateAllMediaConsumers()
  return doc
}

export const revalidateMediaDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidateAllMediaConsumers()
  return doc
}
