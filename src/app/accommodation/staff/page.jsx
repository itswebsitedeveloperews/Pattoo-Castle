import StaffPage from '../../../StaffPage'
import {
  getFooterEntry,
  getHeaderEntry,
  getStaffEntry,
} from '../../../lib/contentful'
import { createMetadata } from '../../../lib/seo'

export const metadata = createMetadata("/accommodation/staff/")
export const revalidate = 60

function withTimeout(promise, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} request timed out`)), 8000)
    }),
  ])
}

export default async function StaffRoute() {
  const [staffResult, footerResult, headerResult] =
    await Promise.allSettled([
      withTimeout(getStaffEntry(), 'Contentful staff'),
      withTimeout(getFooterEntry(), 'Contentful footer'),
      withTimeout(getHeaderEntry(), 'Contentful header'),
    ])

  const staffEntry = staffResult.status === 'fulfilled' ? staffResult.value : null
  const footerEntry =
    footerResult.status === 'fulfilled' ? footerResult.value : null
  const headerEntry =
    headerResult.status === 'fulfilled' ? headerResult.value : null

  if (staffResult.status === 'rejected') {
    console.error('Contentful staff request failed:', staffResult.reason)
  }

  if (footerResult.status === 'rejected') {
    console.error('Contentful footer request failed:', footerResult.reason)
  }

  if (headerResult.status === 'rejected') {
    console.error('Contentful header request failed:', headerResult.reason)
  }

  return (
    <StaffPage
      footerEntry={footerEntry}
      headerEntry={headerEntry}
      staffEntry={staffEntry}
    />
  )
}
