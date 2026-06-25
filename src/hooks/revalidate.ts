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
