import LocationPage from '../../LocationPage'
import {
  getFooterEntry,
  getHeaderEntry,
  getLocationEntry,
  getLocationEntryBySlug,
} from '../../lib/contentful'
import { createMetadata } from '../../lib/seo'

export const metadata = createMetadata("/explore-negril/")
export const revalidate = 60
const pageSlug = 'explore-negril'

function withTimeout(promise, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} request timed out`)), 8000)
    }),
  ])
}

export default async function ExploreNegrilRoute() {
  const [locationResult, footerResult, headerResult] = await Promise.allSettled([
    withTimeout(getLocationEntryBySlug(pageSlug), 'Contentful location'),
    withTimeout(getFooterEntry(), 'Contentful footer'),
    withTimeout(getHeaderEntry(), 'Contentful header'),
  ])
  let locationEntry =
    locationResult.status === 'fulfilled' ? locationResult.value : null
  const footerEntry =
    footerResult.status === 'fulfilled' ? footerResult.value : null
  const headerEntry =
    headerResult.status === 'fulfilled' ? headerResult.value : null

  if (!locationEntry) {
    locationEntry = await getLocationEntry()
  }

  if (locationResult.status === 'rejected') {
    console.error('Contentful location request failed:', locationResult.reason)
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
