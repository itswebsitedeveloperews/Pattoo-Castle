import EventsPage from '../../EventsPage'
import {
  getEventEntry,
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

export default async function EventsRoute() {
  const [eventResult, footerResult, headerResult] = await Promise.allSettled([
    withTimeout(getEventEntry(), 'Contentful event'),
    withTimeout(getFooterEntry(), 'Contentful footer'),
    withTimeout(getHeaderEntry(), 'Contentful header'),
  ])
  const eventEntry =
    eventResult.status === 'fulfilled' ? eventResult.value : null
  const footerEntry =
    footerResult.status === 'fulfilled' ? footerResult.value : null
  const headerEntry =
    headerResult.status === 'fulfilled' ? headerResult.value : null

  if (eventResult.status === 'rejected') {
    console.error('Contentful event request failed:', eventResult.reason)
  }

  if (footerResult.status === 'rejected') {
    console.error('Contentful footer request failed:', footerResult.reason)
  }

  if (headerResult.status === 'rejected') {
    console.error('Contentful header request failed:', headerResult.reason)
  }

  return (
    <EventsPage
      eventEntry={eventEntry}
      footerEntry={footerEntry}
      headerEntry={headerEntry}
    />
  )
}
