import {SanityImage} from '../../shared/SanityImage'
import type {ImageBlockData} from '@/types/sanity'

export function ImageContent({data}: {data: ImageBlockData}) {
  if (!data.image?.asset) return null

  return (
    <figure>
      <SanityImage
        value={data.image}
        className="w-full rounded-lg object-cover"
      />
      {data.caption && (
        <figcaption className="mt-3 text-center text-sm text-muted">
          {data.caption}
        </figcaption>
      )}
    </figure>
  )
}
