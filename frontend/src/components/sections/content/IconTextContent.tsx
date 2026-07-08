import {stegaClean} from 'next-sanity'
import {SanityImage} from '../../shared/SanityImage'
import type {IconTextData} from '@/types/sanity'

const LAYOUT_CLASSES: Record<string, {container: string; text: string}> = {
  left: {
    container: 'flex flex-row items-start gap-4',
    text: 'text-left',
  },
  center: {
    container: 'flex flex-col items-center gap-3',
    text: 'text-center',
  },
  right: {
    container: 'flex flex-row-reverse items-start gap-4',
    text: 'text-right',
  },
}

export function IconTextContent({data}: {data: IconTextData}) {
  const alignment = data.alignment || 'left'
  const layout = LAYOUT_CLASSES[stegaClean(alignment)] || LAYOUT_CLASSES.left

  return (
    <div className={layout.container}>
      {data.icon?.asset && (
        <div className="shrink-0">
          <SanityImage
            value={data.icon}
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
          />
        </div>
      )}
      <div className={layout.text}>
        {data.title && (
          <h4 className="text-lg font-semibold text-foreground">
            {data.title}
          </h4>
        )}
        {data.description && (
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {data.description}
          </p>
        )}
      </div>
    </div>
  )
}
