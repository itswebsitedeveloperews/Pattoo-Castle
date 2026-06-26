import App from '../App'
import { getHomePageEntry } from '../lib/contentful'

export default async function HomePage() {
  let homePageEntry = null

  try {
    homePageEntry = await getHomePageEntry()
  } catch (error) {
    console.error('Contentful homePage request failed:', error)
  }

  return <App homePageEntry={homePageEntry} />
}
