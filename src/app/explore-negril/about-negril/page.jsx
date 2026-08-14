import LocationPage from '../../../LocationPage'
import {
  getFooterEntry,
  getHeaderEntry,
  getLocationEntryBySlug,
} from '../../../lib/contentful'
import { createMetadata } from '../../../lib/seo'

export const metadata = createMetadata("/explore-negril/about-negril/")
export const revalidate = 60
const pageSlug = 'about-negril'

function withTimeout(promise, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} request timed out`)), 8000)
    }),
  ])
}

export default async function AboutNegrilRoute() {
  const [locationResult, footerResult, headerResult] = await Promise.allSettled([
    withTimeout(getLocationEntryBySlug(pageSlug), 'Contentful about Negril'),
    withTimeout(getFooterEntry(), 'Contentful footer'),
    withTimeout(getHeaderEntry(), 'Contentful header'),
  ])

  const locationEntry =
    locationResult.status === 'fulfilled' ? locationResult.value : null
  const footerEntry =
    footerResult.status === 'fulfilled' ? footerResult.value : null
  const headerEntry =
    headerResult.status === 'fulfilled' ? headerResult.value : null

  if (locationResult.status === 'rejected') {
    console.error(
      'Contentful about Negril request failed:',
      locationResult.reason,
    )
  }

  if (footerResult.status === 'rejected') {
    console.error('Contentful footer request failed:', footerResult.reason)
  }

  if (headerResult.status === 'rejected') {
    console.error('Contentful header request failed:', headerResult.reason)
  }

  return (
    <LocationPage
      footerEntry={footerEntry}
      headerEntry={headerEntry}
      locationEntry={locationEntry}
    />
  )
}
