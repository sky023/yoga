import {stegaClean} from 'next-sanity'
import type {ButtonGroupData} from '@/types/sanity'

interface LinkInternal {
  _type: 'linkInternal'
  reference?: {slug?: {current?: string}}
}

interface LinkExternal {
  _type: 'linkExternal'
  url?: string
  newWindow?: boolean
}

interface PageSlugLink {
  _type: 'pageSlug'
  slug?: string
}

type LinkItem = LinkInternal | LinkExternal | PageSlugLink

function resolveHref(linkItems: LinkItem[]): {href: string; isExternal: boolean} {
  const item = linkItems[0]
  if (!item) return {href: '#', isExternal: false}

  switch (stegaClean(item._type)) {
    case 'linkExternal': {
      const ext = item as LinkExternal
      return {href: ext.url || '#', isExternal: Boolean(ext.newWindow)}
    }
    case 'linkInternal': {
      const int = item as LinkInternal
      return {href: `/${int.reference?.slug?.current || ''}`, isExternal: false}
    }
    case 'pageSlug': {
      const slug = item as PageSlugLink
      return {href: `/${slug.slug || ''}`, isExternal: false}
    }
    default:
      return {href: '#', isExternal: false}
  }
}

const ALIGN_MAP: Record<string, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

export function ButtonGroupContent({data}: {data: ButtonGroupData}) {
  const buttons = data.buttons || []
  const direction = data.direction || 'horizontal'
  const alignment = data.alignment || 'left'

  if (buttons.length === 0) return null

  const cleanDirection = stegaClean(direction)
  const cleanAlignment = stegaClean(alignment)
  const flexDirection = cleanDirection === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
  const justifyClass = ALIGN_MAP[cleanAlignment] || ALIGN_MAP.left

  return (
    <div className={`flex ${flexDirection} ${justifyClass} gap-3`}>
      {buttons.map((button) => {
        if (!button.label) return null

        const {href, isExternal} = resolveHref((button.link || []) as unknown as LinkItem[])
        const hasCustomColors = Boolean(button.color || button.textColor)

        const inlineStyle: React.CSSProperties = hasCustomColors
          ? {
              backgroundColor: stegaClean(button.color) || undefined,
              color: stegaClean(button.textColor) || undefined,
            }
          : {}

        const colorClasses = hasCustomColors
          ? 'hover:opacity-90'
          : 'bg-primary text-primary-foreground hover:bg-primary/90'

        return (
          <a
            key={button._key}
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className={`inline-block rounded-lg px-6 py-3 text-center font-medium transition-colors duration-200 ${colorClasses}`}
            style={inlineStyle}
          >
            {button.label}
          </a>
        )
      })}
    </div>
  )
}
