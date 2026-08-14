import LegalPage from '../../LegalPage'
import {
  getFooterEntry,
  getHeaderEntry,
  getLegalPageEntryBySlug,
} from '../../lib/contentful'
import { createMetadata } from '../../lib/seo'

export const metadata = createMetadata("/terms-condition/")
export const revalidate = 60
const pageSlug = 'terms-condition'

function withTimeout(promise, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} request timed out`)), 8000)
    }),
  ])
}

export default async function TermsConditionRoute() {
  const [legalPageResult, footerResult, headerResult] =
    await Promise.allSettled([
      withTimeout(
        getLegalPageEntryBySlug(pageSlug),
        'Contentful terms condition',
      ),
      withTimeout(getFooterEntry(), 'Contentful footer'),
      withTimeout(getHeaderEntry(), 'Contentful header'),
    ])

  const legalEntry =
    legalPageResult.status === 'fulfilled'
      ? legalPageResult.value
      : null
  const footerEntry =
    footerResult.status === 'fulfilled' ? footerResult.value : null
  const headerEntry =
    headerResult.status === 'fulfilled' ? headerResult.value : null

  if (legalPageResult.status === 'rejected') {
    console.error(
      'Contentful terms condition request failed:',
      legalPageResult.reason,
    )
  }

  if (footerResult.status === 'rejected') {
    console.error('Contentful footer request failed:', footerResult.reason)
  }

  if (headerResult.status === 'rejected') {
    console.error('Contentful header request failed:', headerResult.reason)
  }

  return (
    <LegalPage
      footerEntry={footerEntry}
      headerEntry={headerEntry}
      legalEntry={legalEntry}
      pageId={pageSlug}
    />
  )
}
