import { notFound } from 'next/navigation'
import EventDetailsPage from '../../../EventDetailsPage'
import {
  getEventDetailsEntryBySlug,
  getFooterEntry,
  getHeaderEntry,
} from '../../../lib/contentful'

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

export default async function EventDetailsRoute({ params }) {
  const { slug } = await params
  const [eventDetailsResult, footerResult, headerResult] =
    await Promise.allSettled([
      withTimeout(
        getEventDetailsEntryBySlug(slug),
        'Contentful event details',
      ),
      withTimeout(getFooterEntry(), 'Contentful footer'),
      withTimeout(getHeaderEntry(), 'Contentful header'),
    ])

  const eventDetailsEntry =
    eventDetailsResult.status === 'fulfilled'
      ? eventDetailsResult.value
      : null
  const footerEntry =
    footerResult.status === 'fulfilled' ? footerResult.value : null
  const headerEntry =
    headerResult.status === 'fulfilled' ? headerResult.value : null

  if (eventDetailsResult.status === 'rejected') {
    console.error(
      'Contentful event details request failed:',
      eventDetailsResult.reason,
    )
  }

  if (footerResult.status === 'rejected') {
    console.error('Contentful footer request failed:', footerResult.reason)
  }

  if (headerResult.status === 'rejected') {
    console.error('Contentful header request failed:', headerResult.reason)
  }

  if (!eventDetailsEntry) {
    notFound()
  }

  return (
    <EventDetailsPage
      eventDetailsEntry={eventDetailsEntry}
      footerEntry={footerEntry}
      headerEntry={headerEntry}
    />
  )
}
