import Link from 'next/link'
import { getContentfulImage } from '../../App'
import styles from './blog.module.css'

export function BlogImage({ asset, className, decorative = false }) {
  const image = getContentfulImage(asset)
  return image?.src ? <img className={className} src={image.src} alt={decorative ? '' : image.alt || ''} /> : null
}

export function BlogHero({ asset, children }) {
  return (
    <section className={styles.hero}>
      <BlogImage asset={asset} decorative />
      <div>{children}</div>
    </section>
  )
}

export function PostDate({ value }) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return <time dateTime={value}>{date.toLocaleDateString('en-US', {
    dateStyle: 'long',
    timeZone: 'UTC',
  })}</time>
}

export function PostCard({ post, featured = false }) {
  const { title, slug, category, coverImage, excerpt, publishedDate } = post.fields
  return (
    <article className={featured ? styles.featured : styles.card}>
      <Link href={`/blog/${encodeURIComponent(slug)}/`} tabIndex={-1} aria-hidden="true">
        <BlogImage asset={coverImage} decorative />
      </Link>
      <div>
        {category && <p className={styles.label}>{category}</p>}
        <h3><Link href={`/blog/${encodeURIComponent(slug)}/`}>{title}</Link></h3>
        {featured && excerpt && <p>{excerpt}</p>}
        <PostDate value={publishedDate} />
      </div>
    </article>
  )
}

export function BlogCallToAction() {
  return (
    <section className={styles.callToAction}>
      <h2>Inspired to Experience Negril?</h2>
      <Link href="/contact-us/">Contact Us</Link>
    </section>
  )
}
