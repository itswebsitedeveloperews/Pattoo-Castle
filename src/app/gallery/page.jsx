import GalleryPage from '../../GalleryPage'
import {
  getFooterEntry,
  getGalleryEntry,
  getHeaderEntry,
} from '../../lib/contentful'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function withTimeout(promise, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} request timed out`)), 8000)
    }),
  ])
}

export default async function GalleryRoute() {
  const [galleryResult, footerResult, headerResult] = await Promise.allSettled([
    withTimeout(getGalleryEntry(), 'Contentful gallery'),
    withTimeout(getFooterEntry(), 'Contentful footer'),
    withTimeout(getHeaderEntry(), 'Contentful header'),
  ])
  const galleryEntry =
    galleryResult.status === 'fulfilled' ? galleryResult.value : null
  const footerEntry =
    footerResult.status === 'fulfilled' ? footerResult.value : null
  const headerEntry =
    headerResult.status === 'fulfilled' ? headerResult.value : null

  if (galleryResult.status === 'rejected') {
    console.error('Contentful gallery request failed:', galleryResult.reason)
  }

  if (footerResult.status === 'rejected') {
    console.error('Contentful footer request failed:', footerResult.reason)
  }

  if (headerResult.status === 'rejected') {
    console.error('Contentful header request failed:', headerResult.reason)
  }

  return (
    <GalleryPage
      footerEntry={footerEntry}
      galleryEntry={galleryEntry}
      headerEntry={headerEntry}
    />
  )
}
