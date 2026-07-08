import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {BLOG_POSTS_QUERY, SITE_SETTINGS_QUERY} from '@/sanity/lib/queries'
import {Header} from '@/components/shared/Header'
import {Footer} from '@/components/shared/Footer'
import {BlogCard} from '@/components/blog/BlogCard'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest articles and updates',
}

export default async function BlogIndex() {
  const [{data: posts}, {data: settings}] = await Promise.all([
    sanityFetch({query: BLOG_POSTS_QUERY}),
    sanityFetch({query: SITE_SETTINGS_QUERY}),
  ])

  return (
    <>
      <Header settings={settings} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
              Blog
            </h1>
            <p className="mt-2 text-base text-muted">
              Latest articles and updates
            </p>
          </div>

          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted">No posts yet.</p>
          )}
        </div>
      </main>
      <Footer settings={settings} />
    </>
  )
}
