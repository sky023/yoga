import {stegaClean} from 'next-sanity'
import type {MapEmbedData} from '@/types/sanity'

export function MapEmbedContent({data}: {data: MapEmbedData}) {
  if (!data.embedUrl) return null

  const resolvedHeight = stegaClean(data.height) || '400px'

  return (
    <figure className="my-4">
      <div className="overflow-hidden rounded-xl border border-border">
        <iframe
          src={data.embedUrl}
          style={{height: resolvedHeight}}
          className="w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          title="Map embed"
        />
      </div>
      {data.caption && (
        <figcaption className="mt-2 text-center text-sm text-muted">
          {data.caption}
        </figcaption>
      )}
    </figure>
  )
}
