import {Image} from 'next-sanity/image'
import {urlFor} from '@/sanity/lib/image'

interface SanityImageProps {
  value: {
    asset?: {_id?: string; url?: string; metadata?: {lqip?: string | null; dimensions?: {width: number; height: number} | null} | null} | null
    alt?: string | null
    hotspot?: {x: number; y: number} | null
    crop?: {top: number; bottom: number; left: number; right: number} | null
  }
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
}

export function SanityImage({value, width = 1200, height, className, priority, fill, sizes, quality = 75}: SanityImageProps) {
  if (!value?.asset) return null

  const dimensions = value.asset.metadata?.dimensions
  const computedHeight = height || (dimensions ? Math.round(width * (dimensions.height / dimensions.width)) : Math.round(width / 1.5))

  const src = urlFor(value).width(width).height(computedHeight).fit('max').url()

  const defaultSizes = sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px'
  const placeholder = value.asset.metadata?.lqip ? 'blur' as const : 'empty' as const
  const blurDataURL = value.asset.metadata?.lqip || undefined

  if (fill) {
    return (
      <Image
        className={className}
        src={src}
        alt={value.alt || ''}
        fill
        sizes={defaultSizes}
        quality={quality}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
      />
    )
  }

  return (
    <Image
      className={className}
      src={src}
      alt={value.alt || ''}
      width={width}
      height={computedHeight}
      sizes={defaultSizes}
      quality={quality}
      priority={priority}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
    />
  )
}
