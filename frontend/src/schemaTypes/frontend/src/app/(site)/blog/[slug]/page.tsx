import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {client} from '@/sanity/lib/client'
import {BLOG_POST_QUERY, BLOG_SLUGS_QUERY, SITE_SETTINGS_QUERY} from '@/sanity/lib/queries'
import {Header} from '@/components/shared/Header'
import {Footer} from '@/components/shared/Footer'
import {BlogPost} from '@/components/blog/BlogPost'

export const revalidate = 86400

export async function generateStaticParams() {
  const data = await client.withConfig({useCdn: false}).fetch(BLOG_SLUGS_QUERY)
  return (data ?? []).map((post) => ({slug: post.slug}))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{slug: string}>
}): Promise<Metadata> {
  const {slug} = await params
  const {data: post} = await sanityFetch({query: BLOG_POST_QUERY, params: {slug}})

  if (!post) return {}

  const seo = post.seo

  return {
    title: seo?.metaTitle || post.title || undefined,
    description: seo?.metaDescription || post.excerpt || undefined,
    robots: seo?.noIndex ? {index: false, follow: false} : undefined,
    openGraph: seo?.ogImage?.asset?.url
      ? {images: [{url: seo.ogImage.asset.url}]}
      : undefined,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params

  const [{data: post}, {data: settings}] = await Promise.all([
    sanityFetch({query: BLOG_POST_QUERY, params: {slug}}),
    sanityFetch({query: SITE_SETTINGS_QUERY}),
  ])

  if (!post) notFound()

  return (
    <>
      <Header settings={settings} />
      <main className="flex-1">
        <BlogPost post={post} />
      </main>
      <Footer settings={settings} />
    </>
  )
}
