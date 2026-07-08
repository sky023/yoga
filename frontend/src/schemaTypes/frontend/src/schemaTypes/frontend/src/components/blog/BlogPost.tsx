import {Image} from 'next-sanity/image'
import {urlFor} from '@/sanity/lib/image'
import {PortableTextRenderer} from '../shared/PortableTextRenderer'
import type {BlogPostData} from '@/types/sanity'

export function BlogPost({post}: {post: BlogPostData}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted">
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
          {post.author && (
            <>
              <span>&middot;</span>
              <span>{post.author}</span>
            </>
          )}
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tighter text-foreground sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>
      </header>

      {/* Cover image */}
      {post.coverImage?.asset && (
        <div className="mb-10 overflow-hidden rounded-2xl">
          <Image
            src={urlFor(post.coverImage).width(1200).fit('max').url()}
            alt={post.coverImage.alt || post.title || ''}
            width={post.coverImage.asset.metadata?.dimensions?.width || 1200}
            height={post.coverImage.asset.metadata?.dimensions?.height || 675}
            sizes="(max-width: 768px) 100vw, 768px"
            quality={80}
            className="w-full"
            priority
            placeholder={post.coverImage.asset.metadata?.lqip ? 'blur' : undefined}
            blurDataURL={post.coverImage.asset.metadata?.lqip || undefined}
          />
        </div>
      )}

      {/* Body */}
      {post.body && post.body.length > 0 && (
        <div className="prose prose-slate prose-lg max-w-none">
          <PortableTextRenderer value={post.body} />
        </div>
      )}
    </article>
  )
}
