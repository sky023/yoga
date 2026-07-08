import type {CSSProperties, ReactNode} from 'react'
import {stegaClean} from 'next-sanity'

interface BlockStyles {
  padding?: {
    top?: string | null; right?: string | null; bottom?: string | null; left?: string | null
    topMd?: string | null; rightMd?: string | null; bottomMd?: string | null; leftMd?: string | null
    topLg?: string | null; rightLg?: string | null; bottomLg?: string | null; leftLg?: string | null
  } | null
  margin?: {
    top?: string | null; right?: string | null; bottom?: string | null; left?: string | null
    topMd?: string | null; rightMd?: string | null; bottomMd?: string | null; leftMd?: string | null
    topLg?: string | null; rightLg?: string | null; bottomLg?: string | null; leftLg?: string | null
  } | null
  border?: {width?: string | null; style?: string | null; color?: string | null} | null
  borderRadius?: {topLeft?: string | null; topRight?: string | null; bottomRight?: string | null; bottomLeft?: string | null} | null
  background?: {color?: string | null; image?: {asset?: {url?: string | null} | null} | null; size?: string | null; overlay?: string | null} | null
  typography?: {textAlign?: string | null; fontSize?: string | null; textColor?: string | null} | null
  effects?: {shadow?: string | null; opacity?: number | null; overflow?: string | null} | null
}

const SHADOW_MAP: Record<string, string> = {
  none: 'none',
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 4px 6px rgba(0,0,0,0.07)',
  lg: '0 10px 15px rgba(0,0,0,0.1)',
  xl: '0 20px 25px rgba(0,0,0,0.1)',
}

function buildStyles(bs: BlockStyles | undefined | null): CSSProperties {
  if (!bs) return {}

  const styles: Record<string, string | number | undefined> = {}

  // Padding — base as inline, responsive as CSS custom properties
  if (bs.padding) {
    if (bs.padding.top) styles.paddingTop = bs.padding.top
    if (bs.padding.right) styles.paddingRight = bs.padding.right
    if (bs.padding.bottom) styles.paddingBottom = bs.padding.bottom
    if (bs.padding.left) styles.paddingLeft = bs.padding.left
    if (bs.padding.topMd) styles['--pt-md'] = bs.padding.topMd
    if (bs.padding.rightMd) styles['--pr-md'] = bs.padding.rightMd
    if (bs.padding.bottomMd) styles['--pb-md'] = bs.padding.bottomMd
    if (bs.padding.leftMd) styles['--pl-md'] = bs.padding.leftMd
    if (bs.padding.topLg) styles['--pt-lg'] = bs.padding.topLg
    if (bs.padding.rightLg) styles['--pr-lg'] = bs.padding.rightLg
    if (bs.padding.bottomLg) styles['--pb-lg'] = bs.padding.bottomLg
    if (bs.padding.leftLg) styles['--pl-lg'] = bs.padding.leftLg
  }

  // Margin — same pattern
  if (bs.margin) {
    if (bs.margin.top) styles.marginTop = bs.margin.top
    if (bs.margin.right) styles.marginRight = bs.margin.right
    if (bs.margin.bottom) styles.marginBottom = bs.margin.bottom
    if (bs.margin.left) styles.marginLeft = bs.margin.left
    if (bs.margin.topMd) styles['--mt-md'] = bs.margin.topMd
    if (bs.margin.rightMd) styles['--mr-md'] = bs.margin.rightMd
    if (bs.margin.bottomMd) styles['--mb-md'] = bs.margin.bottomMd
    if (bs.margin.leftMd) styles['--ml-md'] = bs.margin.leftMd
    if (bs.margin.topLg) styles['--mt-lg'] = bs.margin.topLg
    if (bs.margin.rightLg) styles['--mr-lg'] = bs.margin.rightLg
    if (bs.margin.bottomLg) styles['--mb-lg'] = bs.margin.bottomLg
    if (bs.margin.leftLg) styles['--ml-lg'] = bs.margin.leftLg
  }

  // Border
  if (bs.border) {
    if (bs.border.width) styles.borderWidth = bs.border.width
    if (bs.border.style) styles.borderStyle = bs.border.style
    if (bs.border.color) styles.borderColor = bs.border.color
  }

  // Border radius
  if (bs.borderRadius) {
    const {topLeft, topRight, bottomRight, bottomLeft} = bs.borderRadius
    styles.borderRadius = `${topLeft || '0'} ${topRight || '0'} ${bottomRight || '0'} ${bottomLeft || '0'}`
  }

  // Background
  if (bs.background) {
    if (bs.background.color) styles.backgroundColor = bs.background.color
    if (bs.background.image?.asset?.url) {
      styles.backgroundImage = `url(${bs.background.image.asset.url})`
      styles.backgroundSize = bs.background.size || 'cover'
      styles.backgroundPosition = 'center'
    }
  }

  // Typography
  if (bs.typography) {
    if (bs.typography.textAlign) styles.textAlign = bs.typography.textAlign
    if (bs.typography.fontSize) styles.fontSize = `${bs.typography.fontSize}px`
    if (bs.typography.textColor) styles.color = bs.typography.textColor
  }

  // Effects
  if (bs.effects) {
    if (bs.effects.shadow) styles.boxShadow = SHADOW_MAP[bs.effects.shadow] || 'none'
    if (typeof bs.effects.opacity === 'number') styles.opacity = bs.effects.opacity / 100
    if (bs.effects.overflow) styles.overflow = bs.effects.overflow
  }

  return styles as CSSProperties
}

export function BlockStylesWrapper({
  blockStyles,
  children,
  className,
}: {
  blockStyles?: BlockStyles | null
  children: ReactNode
  className?: string
}) {
  const clean = blockStyles ? stegaClean(blockStyles) : blockStyles
  const inlineStyles = buildStyles(clean)
  const hasOverlay = clean?.background?.overlay && clean?.background?.image?.asset?.url

  return (
    <div className={className || undefined} style={inlineStyles}>
      {hasOverlay && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{backgroundColor: clean!.background!.overlay!}}
        />
      )}
      {hasOverlay ? <div className="relative">{children}</div> : children}
    </div>
  )
}
