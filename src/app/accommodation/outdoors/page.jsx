import OutdoorsPage from '../../../OutdoorsPage'
import {
  getFooterEntry,
  getHeaderEntry,
  getOutdoorsEntry,
} from '../../../lib/contentful'
import { createMetadata } from '../../../lib/seo'

export const metadata = createMetadata("/accommodation/outdoors/")
export const revalidate = 60

function withTimeout(promise, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} request timed out`)), 8000)
    }),
  ])
}

export default async function OutdoorsRoute() {
  const [outdoorsResult, footerResult, headerResult] =
    await Promise.allSettled([
      withTimeout(getOutdoorsEntry(), 'Contentful outdoors'),
      withTimeout(getFooterEntry(), 'Contentful footer'),
      withTimeout(getHeaderEntry(), 'Contentful header'),
    ])

  const outdoorsEntry =
    outdoorsResult.status === 'fulfilled' ? outdoorsResult.value : null
  const footerEntry =
    footerResult.status === 'fulfilled' ? footerResult.value : null
  const headerEntry =
    headerResult.status === 'fulfilled' ? headerResult.value : null

  if (outdoorsResult.status === 'rejected') {
    console.error('Contentful outdoors request failed:', outdoorsResult.reason)
  }

  if (footerResult.status === 'rejected') {
    console.error('Contentful footer request failed:', footerResult.reason)
  }

  if (headerResult.status === 'rejected') {
    console.error('Contentful header request failed:', headerResult.reason)
  }

  return (
    <OutdoorsPage
      footerEntry={footerEntry}
      headerEntry={headerEntry}
      outdoorsEntry={outdoorsEntry}
    />
  )
}
