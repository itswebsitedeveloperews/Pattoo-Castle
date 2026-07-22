import TermsConditionPage from '../../TermsConditionPage'
import {
  getFooterEntry,
  getHeaderEntry,
  getTermsConditionEntry,
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

export default async function TermsConditionRoute() {
  const [termsConditionResult, footerResult, headerResult] =
    await Promise.allSettled([
      withTimeout(getTermsConditionEntry(), 'Contentful terms condition'),
      withTimeout(getFooterEntry(), 'Contentful footer'),
      withTimeout(getHeaderEntry(), 'Contentful header'),
    ])

  const termsConditionEntry =
    termsConditionResult.status === 'fulfilled'
      ? termsConditionResult.value
      : null
  const footerEntry =
    footerResult.status === 'fulfilled' ? footerResult.value : null
  const headerEntry =
    headerResult.status === 'fulfilled' ? headerResult.value : null

  if (termsConditionResult.status === 'rejected') {
    console.error(
      'Contentful terms condition request failed:',
      termsConditionResult.reason,
    )
  }

  if (footerResult.status === 'rejected') {
    console.error('Contentful footer request failed:', footerResult.reason)
  }

  if (headerResult.status === 'rejected') {
    console.error('Contentful header request failed:', headerResult.reason)
  }

  return (
    <TermsConditionPage
      footerEntry={footerEntry}
      headerEntry={headerEntry}
      termsConditionEntry={termsConditionEntry}
    />
  )
}
