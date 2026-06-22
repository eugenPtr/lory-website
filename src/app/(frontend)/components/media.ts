import type { Media } from '@/payload-types'

// Upload fields come back as either a populated Media doc or its id (depth-dependent).
// Sections only ever render populated docs; this narrows the union in one place.
export type MediaRef = number | Media | null | undefined

export function resolveMedia(ref: MediaRef): Media | null {
  return ref && typeof ref === 'object' ? ref : null
}
