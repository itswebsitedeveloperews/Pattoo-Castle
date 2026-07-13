import StayPage from '../../StayPage'
import { getFooterEntry, getHeaderEntry, getStayEntry } from '../../lib/contentful'

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

export default async function StayRoute() {
  const [stayResult, footerResult, headerResult] = await Promise.allSettled([
    withTimeout(getStayEntry(), 'Contentful stay'),
    withTimeout(getFooterEntry(), 'Contentful footer'),
    withTimeout(getHeaderEntry(), 'Contentful header'),
  ])
  const stayEntry = stayResult.status === 'fulfilled' ? stayResult.value : null
  const footerEntry =
    footerResult.status === 'fulfilled' ? footerResult.value : null
  const headerEntry =
    headerResult.status === 'fulfilled' ? headerResult.value : null

  if (stayResult.status === 'rejected') {
    console.error('Contentful stay request failed:', stayResult.reason)
  }

  if (footerResult.status === 'rejected') {
    console.error('Contentful footer request failed:', footerResult.reason)
  }

  if (headerResult.status === 'rejected') {
    console.error('Contentful header request failed:', headerResult.reason)
  }

  return (
    <StayPage
      footerEntry={footerEntry}
      headerEntry={headerEntry}
      stayEntry={stayEntry}
    />
  )
}
