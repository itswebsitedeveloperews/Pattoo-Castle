import VillaInclusionPage from '../../../VillaInclusionPage'
import {
  getFooterEntry,
  getHeaderEntry,
  getVillaInclusionEntry,
} from '../../../lib/contentful'
import { createMetadata } from '../../../lib/seo'

export const metadata = createMetadata("/accommodation/villa-inclusion/")
export const revalidate = 60

function withTimeout(promise, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} request timed out`)), 8000)
    }),
  ])
}

export default async function VillaInclusionRoute() {
  const [villaInclusionResult, footerResult, headerResult] =
    await Promise.allSettled([
      withTimeout(getVillaInclusionEntry(), 'Contentful villa inclusion'),
      withTimeout(getFooterEntry(), 'Contentful footer'),
      withTimeout(getHeaderEntry(), 'Contentful header'),
    ])

  const villaInclusionEntry =
    villaInclusionResult.status === 'fulfilled'
      ? villaInclusionResult.value
      : null
  const footerEntry =
    footerResult.status === 'fulfilled' ? footerResult.value : null
  const headerEntry =
    headerResult.status === 'fulfilled' ? headerResult.value : null

  if (villaInclusionResult.status === 'rejected') {
    console.error(
      'Contentful villa inclusion request failed:',
      villaInclusionResult.reason,
    )
  }

  if (footerResult.status === 'rejected') {
    console.error('Contentful footer request failed:', footerResult.reason)
  }

  if (headerResult.status === 'rejected') {
    console.error('Contentful header request failed:', headerResult.reason)
  }

  return (
    <VillaInclusionPage
      footerEntry={footerEntry}
      headerEntry={headerEntry}
      villaInclusionEntry={villaInclusionEntry}
    />
  )
}
