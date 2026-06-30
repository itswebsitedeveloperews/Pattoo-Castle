import AccommodationPage from '../../AccommodationPage'
import {
  getAccommodationEntry,
  getFooterEntry,
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

export default async function AccommodationRoute() {
  const [accommodationResult, footerResult, headerResult] =
    await Promise.allSettled([
      withTimeout(getAccommodationEntry(), 'Contentful accommodation'),
      withTimeout(getFooterEntry(), 'Contentful footer'),
      withTimeout(getHeaderEntry(), 'Contentful header'),
    ])
  const accommodationEntry =
    accommodationResult.status === 'fulfilled'
      ? accommodationResult.value
      : null
  const footerEntry =
    footerResult.status === 'fulfilled' ? footerResult.value : null
  const headerEntry =
    headerResult.status === 'fulfilled' ? headerResult.value : null

  if (accommodationResult.status === 'rejected') {
    console.error(
      'Contentful accommodation request failed:',
      accommodationResult.reason,
    )
  }

  if (footerResult.status === 'rejected') {
    console.error('Contentful footer request failed:', footerResult.reason)
  }

  if (headerResult.status === 'rejected') {
    console.error('Contentful header request failed:', headerResult.reason)
  }

  return (
    <AccommodationPage
      accommodationEntry={accommodationEntry}
      footerEntry={footerEntry}
      headerEntry={headerEntry}
    />
  )
}
