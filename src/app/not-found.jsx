import NotFoundPage from '../NotFoundPage'
import { getFooterEntry, getHeaderEntry } from '../lib/contentful'

export const revalidate = 60

export const metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found.',
  alternates: {
    canonical: '/404/',
  },
  robots: { index: false, follow: false },
}

function withTimeout(promise, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} request timed out`)), 8000)
    }),
  ])
}

export default async function NotFoundRoute() {
  const [footerResult, headerResult] = await Promise.allSettled([
    withTimeout(getFooterEntry(), 'Contentful footer'),
    withTimeout(getHeaderEntry(), 'Contentful header'),
  ])
  const footerEntry =
    footerResult.status === 'fulfilled' ? footerResult.value : null
  const headerEntry =
    headerResult.status === 'fulfilled' ? headerResult.value : null

  if (footerResult.status === 'rejected') {
    console.error('Contentful footer request failed:', footerResult.reason)
  }

  if (headerResult.status === 'rejected') {
    console.error('Contentful header request failed:', headerResult.reason)
  }

  return <NotFoundPage footerEntry={footerEntry} headerEntry={headerEntry} />
}
