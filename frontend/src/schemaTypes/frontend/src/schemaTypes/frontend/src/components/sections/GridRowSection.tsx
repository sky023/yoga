import {stegaClean} from 'next-sanity'
import {BlockStylesWrapper} from '../shared/BlockStylesWrapper'
import {ScrollReveal} from '../shared/ScrollReveal'
import {ContentRenderer} from './ContentRenderer'
import type {GridRowData} from '@/types/sanity'

const GAP_MAP: Record<string, string> = {
  none: 'gap-0',
  sm: 'gap-2 md:gap-4',
  md: 'gap-4 md:gap-6',
  lg: 'gap-6 md:gap-8',
  xl: 'gap-8 md:gap-12',
}

const PADDING_Y_MAP: Record<string, string> = {
  none: 'py-0',
  sm: 'py-4 md:py-6',
  md: 'py-8 md:py-12',
  lg: 'py-12 md:py-16',
  xl: 'py-16 md:py-24',
}

const MAX_WIDTH_MAP: Record<string, string> = {
  narrow: 'max-w-3xl',
  default: 'max-w-7xl',
  wide: 'max-w-[1400px]',
  full: 'max-w-full',
}

const LAYOUT_GRID: Record<string, string> = {
  'full': 'grid-cols-1',
  '50-50': 'grid-cols-1 md:grid-cols-2',
  '33-66': 'grid-cols-1 md:grid-cols-[1fr_2fr]',
  '66-33': 'grid-cols-1 md:grid-cols-[2fr_1fr]',
  '25-75': 'grid-cols-1 md:grid-cols-[1fr_3fr]',
  '75-25': 'grid-cols-1 md:grid-cols-[3fr_1fr]',
  '33-33-33': 'grid-cols-1 md:grid-cols-3',
  '25-50-25': 'grid-cols-1 md:grid-cols-[1fr_2fr_1fr]',
  '25-25-25-25': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

const VALIGN_MAP: Record<string, string> = {
  top: 'self-start',
  center: 'self-center',
  bottom: 'self-end',
}

const STAGGER_MS = 100

export function GridRowSection({data}: {data: GridRowData}) {
  const layout = stegaClean(data.layout) || 'full'
  const gridClass = LAYOUT_GRID[layout] || 'grid-cols-1'
  const gapClass = GAP_MAP[stegaClean(data.gap) || 'md'] || ''
  const paddingClass = PADDING_Y_MAP[stegaClean(data.paddingY) || 'md'] || ''
  const maxWidthClass = MAX_WIDTH_MAP[stegaClean(data.maxWidth) || 'default'] || 'max-w-7xl'
  const reverseClass = data.reverseOnMobile ? 'flex-col-reverse md:grid' : ''

  return (
    <BlockStylesWrapper blockStyles={data.blockStyles}>
      <section>
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthClass} ${paddingClass}`}>
          <div className={`grid ${gridClass} ${gapClass} ${reverseClass}`}>
            {data.columns?.map((column, colIdx) => {
              const valign = VALIGN_MAP[stegaClean(column.verticalAlign) || 'top'] || ''
              return (
                <ScrollReveal key={column._key} delay={colIdx * STAGGER_MS}>
                  <BlockStylesWrapper
                    blockStyles={column.blockStyles}
                    className={valign}
                  >
                    {column.content?.map((block) => (
                      <ContentRenderer key={block._key} block={block} />
                    ))}
                    {(!column.content || column.content.length === 0) && (
                      <div className="flex min-h-[100px] items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted">
                        Empty column
                      </div>
                    )}
                  </BlockStylesWrapper>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>
    </BlockStylesWrapper>
  )
}
