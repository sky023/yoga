'use client'

import {stegaClean} from 'next-sanity'
import {useState, useCallback} from 'react'
import {Image} from 'next-sanity/image'
import {urlFor} from '@/sanity/lib/image'
import type {ImageGalleryData} from '@/types/sanity'

type GalleryImage = ImageGalleryData['images'][number]

const COLS_MAP: Record<string, string> = {
  '2': 'sm:columns-2',
  '3': 'sm:columns-2 lg:columns-3',
  '4': 'sm:columns-2 lg:columns-4',
}

const GRID_COLS_MAP: Record<string, string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
}

export function ImageGalleryContent({data}: {data: ImageGalleryData}) {
  const images = data.images || []
  const layout = data.layout || 'grid'
  const columns = data.columns || '3'

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const openLightbox = useCallback(
    (idx: number) => {
      if (data.enableLightbox) setLightboxIdx(idx)
    },
    [data.enableLightbox],
  )

  const closeLightbox = useCallback(() => setLightboxIdx(null), [])

  if (images.length === 0) return null

  const cleanLayout = stegaClean(layout)
  const cleanColumns = stegaClean(columns)
  const isMasonry = cleanLayout === 'masonry'

  return (
    <div>
      {data.title && (
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {data.title}
        </h2>
      )}

      {isMasonry ? (
        <div className={`columns-1 gap-4 ${COLS_MAP[cleanColumns] || COLS_MAP['3']}`}>
          {images.map((img, idx) => (
            <GalleryItem
              key={img._key}
              image={img}
              className="mb-4 break-inside-avoid"
              onClick={() => openLightbox(idx)}
              clickable={Boolean(data.enableLightbox)}
            />
          ))}
        </div>
      ) : (
        <div className={`grid grid-cols-1 gap-4 ${GRID_COLS_MAP[cleanColumns] || GRID_COLS_MAP['3']}`}>
          {images.map((img, idx) => (
            <GalleryItem
              key={img._key}
              image={img}
              className="aspect-square"
              onClick={() => openLightbox(idx)}
              clickable={Boolean(data.enableLightbox)}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          images={images}
          currentIdx={lightboxIdx}
          onClose={closeLightbox}
          onChange={setLightboxIdx}
        />
      )}
    </div>
  )
}

function GalleryItem({
  image,
  className,
  onClick,
  clickable,
}: {
  image: GalleryImage
  className?: string
  onClick: () => void
  clickable: boolean
}) {
  if (!image.image?.asset) return null

  const asset = image.image.asset as Record<string, unknown> | undefined
  const metadata = (asset?.metadata ?? null) as {lqip?: string | null; dimensions?: {width: number; height: number} | null} | null
  const dims = metadata?.dimensions

  return (
    <figure className={className}>
      <button
        type="button"
        onClick={onClick}
        className={`block w-full overflow-hidden rounded-lg ${clickable ? 'cursor-zoom-in' : 'cursor-default'}`}
        disabled={!clickable}
      >
        <Image
          src={urlFor(image.image).width(600).fit('max').url()}
          alt={image.alt || ''}
          width={dims?.width || 600}
          height={dims?.height || 400}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          placeholder={metadata?.lqip ? 'blur' : undefined}
          blurDataURL={metadata?.lqip || undefined}
        />
      </button>
      {image.caption && (
        <figcaption className="mt-2 text-xs text-muted">{image.caption}</figcaption>
      )}
    </figure>
  )
}

function Lightbox({
  images,
  currentIdx,
  onClose,
  onChange,
}: {
  images: GalleryImage[]
  currentIdx: number
  onClose: () => void
  onChange: (idx: number) => void
}) {
  const current = images[currentIdx]
  if (!current?.image?.asset) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Close"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onChange((currentIdx - 1 + images.length) % images.length)
            }}
            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Previous"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onChange((currentIdx + 1) % images.length)
            }}
            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Next"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      <div onClick={(e) => e.stopPropagation()}>
        <Image
          src={urlFor(current.image).width(1200).fit('max').url()}
          alt={current.alt || ''}
          width={1200}
          height={800}
          className="max-h-[85vh] w-auto rounded-lg object-contain"
        />
        {current.caption && (
          <p className="mt-3 text-center text-sm text-white/70">{current.caption}</p>
        )}
      </div>
    </div>
  )
}
