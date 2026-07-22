import App from '../App'
import HomeBodyClass from './HomeBodyClass'
import { getFooterEntry, getHeaderEntry, getHomePageEntry } from '../lib/contentful'

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

export default async function HomePage() {
  const [homePageResult, footerResult, headerResult] = await Promise.allSettled([
    withTimeout(getHomePageEntry(), 'Contentful homePage'),
    withTimeout(getFooterEntry(), 'Contentful footer'),
    withTimeout(getHeaderEntry(), 'Contentful header'),
  ])
  const homePageEntry =
    homePageResult.status === 'fulfilled' ? homePageResult.value : null
  const footerEntry =
    footerResult.status === 'fulfilled' ? footerResult.value : null
  const headerEntry =
    headerResult.status === 'fulfilled' ? headerResult.value : null

  if (homePageResult.status === 'rejected') {
    console.error('Contentful homePage request failed:', homePageResult.reason)
  }

  if (footerResult.status === 'rejected') {
    console.error('Contentful footer request failed:', footerResult.reason)
  }

  if (headerResult.status === 'rejected') {
    console.error('Contentful header request failed:', headerResult.reason)
  }

  return (
    <>
      <HomeBodyClass />
      <App
        footerEntry={footerEntry}
        headerEntry={headerEntry}
        homePageEntry={homePageEntry}
      />
    </>
  )
}
