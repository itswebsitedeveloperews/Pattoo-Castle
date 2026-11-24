import { getFooterContent, getHeaderContent } from '../../App'
import { getFooterEntry, getHeaderEntry } from '../../lib/contentful'
import SiteHeader from '../../SiteHeader'
import SiteFooter from '../../SiteFooter'
import styles from './blog.module.css'

export default async function BlogLayout({ children }) {
  const [header, footer] = await Promise.all([getHeaderEntry(), getFooterEntry()])
  return (
    <>
      <SiteHeader header={getHeaderContent(header)} />
      <main className={styles.blog}>{children}</main>
      <SiteFooter footer={getFooterContent(footer)} />
    </>
  )
}
