import OverviewLocationPage from '../../../OverviewLocationPage'
import {
  getFooterEntry,
  getHeaderEntry,
  getOverviewLocationEntry,
} from '../../../lib/contentful'
import { createMetadata } from '../../../lib/seo'

export const metadata = createMetadata("/overview/pattoo-castle-location/")
export const revalidate = 60

function withTimeout(promise, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} request timed out`)), 8000)
    }),
  ])
}

export default async function OverviewLocationRoute() {
  const [overviewLocationResult, footerResult, headerResult] =
    await Promise.allSettled([
      withTimeout(getOverviewLocationEntry(), 'Contentful overview location'),
      withTimeout(getFooterEntry(), 'Contentful footer'),
      withTimeout(getHeaderEntry(), 'Contentful header'),
    ])
  const overviewLocationEntry =
    overviewLocationResult.status === 'fulfilled'
      ? overviewLocationResult.value
      : null
  const footerEntry =
    footerResult.status === 'fulfilled' ? footerResult.value : null
  const headerEntry =
    headerResult.status === 'fulfilled' ? headerResult.value : null

  if (overviewLocationResult.status === 'rejected') {
    console.error(
      'Contentful overview location request failed:',
      overviewLocationResult.reason,
    )
  }

  if (footerResult.status === 'rejected') {
    console.error('Contentful footer request failed:', footerResult.reason)
  }

  if (headerResult.status === 'rejected') {
    console.error('Contentful header request failed:', headerResult.reason)
  }

  return (
    <OverviewLocationPage
      footerEntry={footerEntry}
      headerEntry={headerEntry}
      overviewLocationEntry={overviewLocationEntry}
    />
  )
}
