import PrivacyPolicyPage from '../../PrivacyPolicyPage'
import {
  getFooterEntry,
  getHeaderEntry,
  getPrivacyPolicyEntry,
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

export default async function PrivacyPolicyRoute() {
  const [privacyPolicyResult, footerResult, headerResult] =
    await Promise.allSettled([
      withTimeout(getPrivacyPolicyEntry(), 'Contentful privacy policy'),
      withTimeout(getFooterEntry(), 'Contentful footer'),
      withTimeout(getHeaderEntry(), 'Contentful header'),
    ])

  const privacyPolicyEntry =
    privacyPolicyResult.status === 'fulfilled'
      ? privacyPolicyResult.value
      : null
  const footerEntry =
    footerResult.status === 'fulfilled' ? footerResult.value : null
  const headerEntry =
    headerResult.status === 'fulfilled' ? headerResult.value : null

  if (privacyPolicyResult.status === 'rejected') {
    console.error(
      'Contentful privacy policy request failed:',
      privacyPolicyResult.reason,
    )
  }

  if (footerResult.status === 'rejected') {
    console.error('Contentful footer request failed:', footerResult.reason)
  }

  if (headerResult.status === 'rejected') {
    console.error('Contentful header request failed:', headerResult.reason)
  }

  return (
    <PrivacyPolicyPage
      footerEntry={footerEntry}
      headerEntry={headerEntry}
      privacyPolicyEntry={privacyPolicyEntry}
    />
  )
}
