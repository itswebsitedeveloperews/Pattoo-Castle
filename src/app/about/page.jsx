import AboutPage from '../../AboutPage'
import { getAboutEntry, getFooterEntry, getHeaderEntry } from '../../lib/contentful'

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

export default async function AboutRoute() {
  const [aboutResult, footerResult, headerResult] = await Promise.allSettled([
    withTimeout(getAboutEntry(), 'Contentful about'),
    withTimeout(getFooterEntry(), 'Contentful footer'),
    withTimeout(getHeaderEntry(), 'Contentful header'),
  ])
  const aboutEntry =
    aboutResult.status === 'fulfilled' ? aboutResult.value : null
  const footerEntry =
    footerResult.status === 'fulfilled' ? footerResult.value : null
  const headerEntry =
    headerResult.status === 'fulfilled' ? headerResult.value : null

  if (aboutResult.status === 'rejected') {
    console.error('Contentful about request failed:', aboutResult.reason)
  }

  if (footerResult.status === 'rejected') {
    console.error('Contentful footer request failed:', footerResult.reason)
  }

  if (headerResult.status === 'rejected') {
    console.error('Contentful header request failed:', headerResult.reason)
  }

  return (
    <AboutPage
      aboutEntry={aboutEntry}
      footerEntry={footerEntry}
      headerEntry={headerEntry}
    />
  )
}
