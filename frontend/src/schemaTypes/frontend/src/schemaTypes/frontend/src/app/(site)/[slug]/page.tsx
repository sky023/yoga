import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {client} from '@/sanity/lib/client'
import {PAGE_QUERY, PAGE_SLUGS_QUERY, SITE_SETTINGS_QUERY} from '@/sanity/lib/queries'
import {Header} from '@/components/shared/Header'
import {Footer} from '@/components/shared/Footer'
import {SectionRenderer} from '@/components/SectionRenderer'

export const revalidate = 86400

export async function generateStaticParams() {
  const data = await client.withConfig({useCdn: false}).fetch(PAGE_SLUGS_QUERY)
  return (data ?? []).map((page) => ({slug: page.slug}))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{slug: string}>
}): Promise<Metadata> {
  const {slug} = await params
  const {data: page} = await sanityFetch({query: PAGE_QUERY, params: {slug}})

  if (!page) return {}

  const seo = page.seo

  return {
    title: seo?.metaTitle || page.title || undefined,
    description: seo?.metaDescription || undefined,
    robots: seo?.noIndex ? {index: false, follow: false} : undefined,
    openGraph: seo?.ogImage?.asset?.url
      ? {images: [{url: seo.ogImage.asset.url}]}
      : undefined,
  }
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params

  const [{data: page}, {data: settings}] = await Promise.all([
    sanityFetch({query: PAGE_QUERY, params: {slug}}),
    sanityFetch({query: SITE_SETTINGS_QUERY}),
  ])

  if (!page) notFound()

  return (
    <>
      <Header settings={settings} />
      <main className="flex-1">
        <SectionRenderer sections={page.pageBuilder} />
      </main>
      <Footer settings={settings} />
    </>
  )
}
