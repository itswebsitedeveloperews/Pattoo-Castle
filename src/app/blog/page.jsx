import Link from 'next/link'
import { getBlogPosts } from '../../lib/contentful'
import { createMetadata } from '../../lib/seo'
import { BlogCallToAction, BlogHero, PostCard } from './BlogParts'
import styles from './blog.module.css'

export const metadata = createMetadata('/blog/', {
  title: 'Stories from Paradise',
  description: 'Explore Negril and Pattoo Castle through our journal.',
})

export default async function BlogPage({ searchParams }) {
  const { category } = await searchParams
  const posts = (await getBlogPosts()).filter(({ fields }) => fields.title && fields.slug)
  const featured = posts.find(({ fields }) => fields.featured) || posts[0]
  const categories = [...new Set(posts.map(({ fields }) => fields.category).filter(Boolean))]
  const active = categories.includes(category) ? category : null
  const visible = active
    ? posts.filter(({ fields }) => fields.category === active)
    : posts.filter((post) => post !== featured)
  const articles = !active && !visible.length ? posts : visible

  return (
    <>
      <BlogHero asset={featured?.fields.bannerImage || featured?.fields.coverImage}>
        <h1>Stories from Paradise</h1>
        <p>Discover Negril, Jamaica, and life at Pattoo Castle.</p>
      </BlogHero>
      <div className={styles.container}>
        {featured && (
          <section aria-label="Featured article">
            <PostCard post={featured} featured />
          </section>
        )}
        <section aria-labelledby="journal-heading">
          <h2 id="journal-heading">Latest from the Journal</h2>
          {categories.length > 0 && (
            <nav className={styles.filters} aria-label="Article categories">
              <Link href="/blog/#journal-heading" aria-current={active === null ? 'page' : undefined}>All</Link>
              {categories.map((name) => (
                <Link key={name} href={`/blog/?category=${encodeURIComponent(name)}#journal-heading`}
                  aria-current={active === name ? 'page' : undefined}>{name}</Link>
              ))}
            </nav>
          )}
          {articles.length ? (
            <div className={styles.grid}>
              {articles.map((post) => <PostCard key={post.sys.id} post={post} />)}
            </div>
          ) : <p>New stories will appear here soon.</p>}
        </section>
      </div>
      <BlogCallToAction />
    </>
  )
}
