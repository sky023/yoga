import {stegaClean} from 'next-sanity'
import type {SpacerDividerData} from '@/types/sanity'

const HEIGHT_MAP: Record<string, string> = {
  xs: 'h-2 md:h-3',
  sm: 'h-4 md:h-6',
  md: 'h-8 md:h-12',
  lg: 'h-12 md:h-16',
  xl: 'h-16 md:h-24',
  xxl: 'h-24 md:h-32',
}

export function SpacerDividerContent({data}: {data: SpacerDividerData}) {
  const height = stegaClean(data.height) || 'md'
  const heightClass = HEIGHT_MAP[height] || HEIGHT_MAP.md

  if (data.showDivider) {
    return (
      <div className={heightClass + ' flex items-center'}>
        <hr className="w-full border-t border-border" />
      </div>
    )
  }

  return <div className={heightClass} aria-hidden="true" />
}
