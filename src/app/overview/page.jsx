import OverviewPage from '../../OverviewPage'
import {
  getFooterEntry,
  getHeaderEntry,
  getOverviewEntry,
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

export default async function OverviewRoute() {
  const [overviewResult, footerResult, headerResult] = await Promise.allSettled([
    withTimeout(getOverviewEntry(), 'Contentful overview'),
    withTimeout(getFooterEntry(), 'Contentful footer'),
    withTimeout(getHeaderEntry(), 'Contentful header'),
  ])
  const overviewEntry =
    overviewResult.status === 'fulfilled' ? overviewResult.value : null
  const footerEntry =
    footerResult.status === 'fulfilled' ? footerResult.value : null
  const headerEntry =
    headerResult.status === 'fulfilled' ? headerResult.value : null

  if (overviewResult.status === 'rejected') {
    console.error('Contentful overview request failed:', overviewResult.reason)
  }

  if (footerResult.status === 'rejected') {
    console.error('Contentful footer request failed:', footerResult.reason)
  }

  if (headerResult.status === 'rejected') {
    console.error('Contentful header request failed:', headerResult.reason)
  }

  return (
    <OverviewPage
      footerEntry={footerEntry}
      headerEntry={headerEntry}
      overviewEntry={overviewEntry}
    />
  )
}
