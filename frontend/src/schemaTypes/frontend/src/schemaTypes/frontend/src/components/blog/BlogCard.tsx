import {Image} from 'next-sanity/image'
import Link from 'next/link'
import {urlFor} from '@/sanity/lib/image'
import type {BlogPostListItem} from '@/types/sanity'

export function BlogCard({post}: {post: BlogPostListItem}) {
  const slug = post.slug?.current
  if (!slug) return null

  return (
    <article className="group">
      <Link href={`/blog/${slug}`} className="block">
        {post.coverImage?.asset && (
          <div className="overflow-hidden rounded-xl">
            <Image
              src={urlFor(post.coverImage).width(600).height(340).fit('max').url()}
              alt={post.coverImage.alt || post.title || ''}
              width={600}
              height={340}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={75}
              className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-105"
              placeholder={post.coverImage.asset.metadata?.lqip ? 'blur' : undefined}
              blurDataURL={post.coverImage.asset.metadata?.lqip || undefined}
            />
          </div>
        )}
        <div className="mt-4">
          <div className="flex items-center gap-2 text-xs text-muted">
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
          <h2 className="mt-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="mt-1 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
          )}
        </div>
      </Link>
    </article>
  )
}
