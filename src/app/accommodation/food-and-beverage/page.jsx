import FoodBeveragePage from '../../../FoodBeveragePage'
import {
  getFoodBeverageEntry,
  getFooterEntry,
  getHeaderEntry,
} from '../../../lib/contentful'
import { createMetadata } from '../../../lib/seo'

export const metadata = createMetadata("/accommodation/food-and-beverage/")
export const revalidate = 60

function withTimeout(promise, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} request timed out`)), 8000)
    }),
  ])
}

export default async function FoodBeverageRoute() {
  const [foodBeverageResult, footerResult, headerResult] =
    await Promise.allSettled([
      withTimeout(getFoodBeverageEntry(), 'Contentful food and beverage'),
      withTimeout(getFooterEntry(), 'Contentful footer'),
      withTimeout(getHeaderEntry(), 'Contentful header'),
    ])

  const foodBeverageEntry =
    foodBeverageResult.status === 'fulfilled'
      ? foodBeverageResult.value
      : null
  const footerEntry =
    footerResult.status === 'fulfilled' ? footerResult.value : null
  const headerEntry =
    headerResult.status === 'fulfilled' ? headerResult.value : null

  if (foodBeverageResult.status === 'rejected') {
    console.error(
      'Contentful food and beverage request failed:',
      foodBeverageResult.reason,
    )
  }

  if (footerResult.status === 'rejected') {
    console.error('Contentful footer request failed:', footerResult.reason)
  }

  if (headerResult.status === 'rejected') {
    console.error('Contentful header request failed:', headerResult.reason)
  }

  return (
    <FoodBeveragePage
      foodBeverageEntry={foodBeverageEntry}
      footerEntry={footerEntry}
      headerEntry={headerEntry}
    />
  )
}
