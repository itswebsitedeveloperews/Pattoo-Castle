import ContactPage from '../../ContactPage'
import { getContactEntry, getFooterEntry, getHeaderEntry } from '../../lib/contentful'

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

export default async function ContactRoute() {
  const [contactResult, footerResult, headerResult] = await Promise.allSettled([
    withTimeout(getContactEntry(), 'Contentful contact'),
    withTimeout(getFooterEntry(), 'Contentful footer'),
    withTimeout(getHeaderEntry(), 'Contentful header'),
  ])
  const contactEntry =
    contactResult.status === 'fulfilled' ? contactResult.value : null
  const footerEntry =
    footerResult.status === 'fulfilled' ? footerResult.value : null
  const headerEntry =
    headerResult.status === 'fulfilled' ? headerResult.value : null

  if (contactResult.status === 'rejected') {
    console.error('Contentful contact request failed:', contactResult.reason)
  }

  if (footerResult.status === 'rejected') {
    console.error('Contentful footer request failed:', footerResult.reason)
  }

  if (headerResult.status === 'rejected') {
    console.error('Contentful header request failed:', headerResult.reason)
  }

  return (
    <ContactPage
      contactEntry={contactEntry}
      footerEntry={footerEntry}
      headerEntry={headerEntry}
    />
  )
}
