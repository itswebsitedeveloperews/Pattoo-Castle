import VillaDetailsPage from '../../../VillaDetailsPage'
import {
  getFooterEntry,
  getHeaderEntry,
  getVillaDetailsEntry,
} from '../../../lib/contentful'
import { createMetadata } from '../../../lib/seo'

export const metadata = createMetadata("/accommodation/villa-details/")
export const revalidate = 60

function withTimeout(promise, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} request timed out`)), 8000)
    }),
  ])
}

export default async function VillaDetailsRoute() {
  const [villaDetailsResult, footerResult, headerResult] =
    await Promise.allSettled([
      withTimeout(getVillaDetailsEntry(), 'Contentful villa details'),
      withTimeout(getFooterEntry(), 'Contentful footer'),
      withTimeout(getHeaderEntry(), 'Contentful header'),
    ])

  const villaDetailsEntry =
    villaDetailsResult.status === 'fulfilled' ? villaDetailsResult.value : null
  const footerEntry =
    footerResult.status === 'fulfilled' ? footerResult.value : null
  const headerEntry =
    headerResult.status === 'fulfilled' ? headerResult.value : null

  if (villaDetailsResult.status === 'rejected') {
    console.error(
      'Contentful villa details request failed:',
      villaDetailsResult.reason,
    )
  }

  if (footerResult.status === 'rejected') {
    console.error('Contentful footer request failed:', footerResult.reason)
  }

  if (headerResult.status === 'rejected') {
    console.error('Contentful header request failed:', headerResult.reason)
  }

  return (
    <VillaDetailsPage
      footerEntry={footerEntry}
      headerEntry={headerEntry}
      villaDetailsEntry={villaDetailsEntry}
    />
  )
}
