import GettingHerePage from '../../../GettingHerePage'
import {
  getFooterEntry,
  getGettingHereEntry,
  getHeaderEntry,
} from '../../../lib/contentful'
import { createMetadata } from '../../../lib/seo'

export const metadata = createMetadata("/overview/getting-here/")
export const revalidate = 60

function withTimeout(promise, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} request timed out`)), 8000)
    }),
  ])
}

export default async function GettingHereRoute() {
  const [gettingHereResult, footerResult, headerResult] =
    await Promise.allSettled([
      withTimeout(getGettingHereEntry(), 'Contentful getting here'),
      withTimeout(getFooterEntry(), 'Contentful footer'),
      withTimeout(getHeaderEntry(), 'Contentful header'),
    ])
  const gettingHereEntry =
    gettingHereResult.status === 'fulfilled' ? gettingHereResult.value : null
  const footerEntry =
    footerResult.status === 'fulfilled' ? footerResult.value : null
  const headerEntry =
    headerResult.status === 'fulfilled' ? headerResult.value : null

  if (gettingHereResult.status === 'rejected') {
    console.error('Contentful getting here request failed:', gettingHereResult.reason)
  }

  if (footerResult.status === 'rejected') {
    console.error('Contentful footer request failed:', footerResult.reason)
  }

  if (headerResult.status === 'rejected') {
    console.error('Contentful header request failed:', headerResult.reason)
  }

  return (
    <GettingHerePage
      footerEntry={footerEntry}
      gettingHereEntry={gettingHereEntry}
      headerEntry={headerEntry}
    />
  )
}
