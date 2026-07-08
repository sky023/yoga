import {PortableTextRenderer} from '../../shared/PortableTextRenderer'
import type {RichTextBlockData} from '@/types/sanity'

export function RichTextContent({data}: {data: RichTextBlockData}) {
  if (!data.content) return null
  return (
    <div className="prose prose-slate max-w-none">
      <PortableTextRenderer value={data.content} />
    </div>
  )
}
