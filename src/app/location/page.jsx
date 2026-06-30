import LocationPage from '../../LocationPage'
import {
  getFooterEntry,
  getHeaderEntry,
  getLocationEntry,
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

export default async function LocationRoute() {
  const [locationResult, footerResult, headerResult] = await Promise.allSettled([
    withTimeout(getLocationEntry(), 'Contentful location'),
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
