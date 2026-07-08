import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {HOME_PAGE_QUERY, SITE_SETTINGS_QUERY} from '@/sanity/lib/queries'
import {Header} from '@/components/shared/Header'
import {Footer} from '@/components/shared/Footer'
import {SectionRenderer} from '@/components/SectionRenderer'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const [{data: page}, {data: settings}] = await Promise.all([
    sanityFetch({query: HOME_PAGE_QUERY}),
    sanityFetch({query: SITE_SETTINGS_QUERY}),
  ])

  const seo = page?.seo
  const siteName = settings?.siteName

  return {
    title: seo?.metaTitle || siteName || 'Home',
    description: seo?.metaDescription || undefined,
    robots: seo?.noIndex ? {index: false, follow: false} : undefined,
    openGraph: seo?.ogImage?.asset?.url
      ? {images: [{url: seo.ogImage.asset.url}]}
      : undefined,
  }
}

export default async function HomePage() {
  const [{data: page}, {data: settings}] = await Promise.all([
    sanityFetch({query: HOME_PAGE_QUERY}),
    sanityFetch({query: SITE_SETTINGS_QUERY}),
  ])

  return (
    <>
      <Header settings={settings} />
      <main className="flex-1">
        <SectionRenderer sections={page?.pageBuilder} />
      </main>
      <Footer settings={settings} />
    </>
  )
}
