import Link from 'next/link'
import { notFound } from 'next/navigation'
import { richTextToReact } from '../../../App'
import { getBlogPosts } from '../../../lib/contentful'
import { createMetadata } from '../../../lib/seo'
import { BlogCallToAction, BlogHero, BlogImage, PostCard, PostDate } from '../BlogParts'
import styles from '../blog.module.css'

async function getPost(slug) {
  const [post] = await getBlogPosts({ 'fields.slug': slug, limit: 1 })
  if (!post) notFound()
  return post
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { fields } = await getPost(slug)
  return createMetadata(`/blog/${encodeURIComponent(slug)}/`, {
    title: fields.title,
    description: fields.excerpt,
  })
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const { fields } = await getPost(slug)
  const related = (await getBlogPosts({ 'fields.slug[ne]': slug, limit: 3 }))
    .filter(({ fields }) => fields.title && fields.slug)

  return (
    <>
      <BlogHero asset={fields.bannerImage || fields.coverImage}>
        <p className={styles.heroTitle}>Stories from Paradise</p>
        <p>Discover Negril, Jamaica, and life at Pattoo Castle.</p>
      </BlogHero>
      <div className={styles.container}>
        <div className={styles.articleLayout}>
          <article>
            <p className={styles.label}>{fields.category} {fields.category && fields.publishedDate && ' · '}<PostDate value={fields.publishedDate} /></p>
            <h1>{fields.title}</h1>
            {fields.excerpt && <p>{fields.excerpt}</p>}
            <BlogImage asset={fields.coverImage} className={styles.cover} />
            <div className={styles.body}>
              {fields.body?.content?.map((node, index) => node.nodeType === 'embedded-asset-block'
                ? <BlogImage key={index} asset={node.data?.target} className={styles.cover} />
                : richTextToReact(node, `post-${index}`))}
            </div>
          </article>
          <aside className={styles.sidebar}>
            <h2>Explore the Journal</h2>
            <Link href="/blog/">All Articles</Link>
            {fields.category && <Link href={`/blog/?category=${encodeURIComponent(fields.category)}#journal-heading`}>{fields.category}</Link>}
            <h2>Plan Your Stay</h2>
            <Link href="/contact-us/">Contact Us</Link>
          </aside>
        </div>
        {related.length > 0 && (
          <section className={styles.related} aria-labelledby="related-heading">
            <h2 id="related-heading">Related Articles</h2>
            <div className={styles.grid}>
              {related.map((post) => <PostCard key={post.sys.id} post={post} />)}
            </div>
          </section>
        )}
      </div>
      <BlogCallToAction />
    </>
  )
}
