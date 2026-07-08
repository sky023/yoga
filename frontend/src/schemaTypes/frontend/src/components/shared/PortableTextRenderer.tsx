import {PortableText, type PortableTextComponents} from 'next-sanity'
import type {PortableTextBlock} from '@portabletext/types'

type PortableTextInput = PortableTextBlock[] | Array<Record<string, unknown>>
import {Image} from 'next-sanity/image'
import {urlFor} from '@/sanity/lib/image'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function extractText(children: React.ReactNode): string {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.map(extractText).join('')
  if (children && typeof children === 'object' && 'props' in children) {
    return extractText((children as {props: {children?: React.ReactNode}}).props.children)
  }
  return ''
}

const components: PortableTextComponents = {
  types: {
    image: ({value}) => {
      if (!value?.asset) return null
      return (
        <figure className="my-6">
          <Image
            src={urlFor(value).width(1200).fit('max').url()}
            alt={value.alt || ''}
            width={1200}
            height={750}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
            quality={75}
            className="rounded-lg"
          />
          {value.alt && (
            <figcaption className="mt-2 text-center text-sm text-muted">{value.alt}</figcaption>
          )}
        </figure>
      )
    },
  },
  marks: {
    link: ({value, children}) => {
      const isExternal = value?.href?.startsWith('http')
      return (
        <a
          href={value?.href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-primary underline underline-offset-2 hover:text-primary/80"
        >
          {children}
        </a>
      )
    },
  },
  block: {
    h2: ({children}) => {
      const id = slugify(extractText(children))
      return <h2 id={id} className="mt-8 mb-4 text-3xl font-bold scroll-mt-20">{children}</h2>
    },
    h3: ({children}) => {
      const id = slugify(extractText(children))
      return <h3 id={id} className="mt-6 mb-3 text-2xl font-semibold scroll-mt-20">{children}</h3>
    },
    h4: ({children}) => {
      const id = slugify(extractText(children))
      return <h4 id={id} className="mt-4 mb-2 text-xl font-semibold scroll-mt-20">{children}</h4>
    },
    normal: ({children}) => <p className="mb-4 leading-relaxed">{children}</p>,
    blockquote: ({children}) => (
      <blockquote className="my-6 border-l-4 border-primary/30 pl-4 italic text-muted">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({children}) => <ul className="mb-4 ml-6 list-disc space-y-1">{children}</ul>,
    number: ({children}) => <ol className="mb-4 ml-6 list-decimal space-y-1">{children}</ol>,
  },
}

export function PortableTextRenderer({value}: {value: PortableTextInput}) {
  if (!value || value.length === 0) return null
  return <PortableText value={value as PortableTextBlock[]} components={components} />
}
