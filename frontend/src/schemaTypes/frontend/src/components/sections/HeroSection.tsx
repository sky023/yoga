import {Image as SanityImg} from 'next-sanity/image'
import {stegaClean} from 'next-sanity'
import {urlFor} from '@/sanity/lib/image'
import {BlockStylesWrapper} from '../shared/BlockStylesWrapper'
import {CallToActionContent} from './content/CallToActionContent'
import type {HeroSectionData} from '@/types/sanity'

const MAX_WIDTH_MAP: Record<string, string> = {
  narrow: 'max-w-3xl',
  default: 'max-w-7xl',
  wide: 'max-w-[1400px]',
}

const ALIGN_MAP: Record<string, string> = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
}

function buildBackground(data: HeroSectionData): React.CSSProperties {
  const style: React.CSSProperties = {}
  const bgType = stegaClean(data.backgroundType)

  switch (bgType) {
    case 'gradient':
      if (data.gradientFrom && data.gradientTo) {
        style.background = `linear-gradient(${stegaClean(data.gradientDirection) || 'to bottom right'}, ${stegaClean(data.gradientFrom)}, ${stegaClean(data.gradientTo)})`
      }
      break
    case 'color':
      if (data.backgroundColor) style.backgroundColor = stegaClean(data.backgroundColor)
      break
    default:
      break
  }

  const minHeight = stegaClean(data.minHeight)
  if (minHeight && minHeight !== 'auto') {
    style.minHeight = minHeight
  }

  if (data.textColor) {
    style.color = stegaClean(data.textColor)
  }

  return style
}

function HeroButtons({buttons}: {buttons: HeroSectionData['buttons']}) {
  if (!buttons || buttons.length === 0) return null

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-4">
      {buttons.map((btn) => (
        <CallToActionContent key={btn._key} data={btn} />
      ))}
    </div>
  )
}

function FullWidthHero({data}: {data: HeroSectionData}) {
  const alignClass = ALIGN_MAP[stegaClean(data.alignment) || 'center'] || ALIGN_MAP.center
  const maxWidthClass = MAX_WIDTH_MAP[stegaClean(data.maxWidth) || 'default']
  const bgType = stegaClean(data.backgroundType)
  const hasMediaBg = bgType === 'image' || bgType === 'video'
  const overlayOpacity = (data.overlay ?? 0) / 100

  return (
    <section className="relative flex items-center overflow-hidden" style={buildBackground(data)}>
      {/* Background image */}
      {bgType === 'image' && data.backgroundImage?.asset && (
        <SanityImg
          src={urlFor(data.backgroundImage).width(1920).fit('max').url()}
          alt=""
          fill
          sizes="100vw"
          quality={80}
          className="object-cover"
          priority
        />
      )}

      {/* Background video */}
      {bgType === 'video' && data.backgroundVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={data.backgroundVideo} type="video/mp4" />
        </video>
      )}

      {/* Overlay */}
      {hasMediaBg && overlayOpacity > 0 && (
        <div
          className="absolute inset-0 bg-black"
          style={{opacity: overlayOpacity}}
        />
      )}

      <div className={`relative z-10 mx-auto w-full px-4 py-20 sm:px-6 lg:px-8 ${maxWidthClass}`}>
        <div className={`flex flex-col ${alignClass}`}>
          {data.badge && (
            <BadgePill badge={data.badge} badgeLink={data.badgeLink} />
          )}

          {data.heading && (
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              {data.heading}
            </h1>
          )}

          {data.subtitle && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80 sm:text-xl">
              {data.subtitle}
            </p>
          )}

          {data.buttons && data.buttons.length > 0 && (
            <HeroButtons buttons={data.buttons} />
          )}
        </div>
      </div>
    </section>
  )
}

function SplitHero({data}: {data: HeroSectionData}) {
  const isMediaLeft = stegaClean(data.mediaPosition) === 'left'
  const maxWidthClass = MAX_WIDTH_MAP[stegaClean(data.maxWidth) || 'default']

  return (
    <section style={buildBackground(data)}>
      <div className={`mx-auto px-4 py-16 sm:px-6 lg:px-8 ${maxWidthClass}`}>
        <div className={`grid items-center gap-8 md:grid-cols-2 lg:gap-16 ${isMediaLeft ? '' : ''}`}>
          {/* Text column */}
          <div className={isMediaLeft ? 'order-2' : 'order-1 md:order-1'}>
            {data.badge && (
              <BadgePill badge={data.badge} badgeLink={data.badgeLink} />
            )}

            {data.heading && (
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
                {data.heading}
              </h1>
            )}

            {data.subtitle && (
              <p className="mt-6 text-lg leading-relaxed opacity-80">
                {data.subtitle}
              </p>
            )}

            {data.buttons && data.buttons.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-4">
                {data.buttons.map((btn) => (
                  <CallToActionContent key={btn._key} data={btn} />
                ))}
              </div>
            )}
          </div>

          {/* Media column */}
          <div className={isMediaLeft ? 'order-1' : 'order-2 md:order-2'}>
            {data.mediaImage?.asset && (
              <SanityImg
                src={urlFor(data.mediaImage).width(1200).fit('max').url()}
                alt={data.mediaImage.alt || ''}
                width={data.mediaImage.asset.metadata?.dimensions?.width || 1200}
                height={data.mediaImage.asset.metadata?.dimensions?.height || 750}
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={75}
                className="w-full rounded-2xl"
                priority
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function BadgePill({badge, badgeLink}: {badge: string; badgeLink?: string}) {
  const classes =
    'mb-6 inline-flex items-center rounded-full border border-current/10 bg-foreground/5 px-4 py-1.5 text-sm font-medium backdrop-blur-sm'

  if (badgeLink) {
    return (
      <a href={badgeLink} className={`${classes} transition-colors hover:bg-foreground/10`}>
        {badge}
        <svg className="ml-2 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    )
  }

  return <span className={classes}>{badge}</span>
}

export function HeroSection({data}: {data: HeroSectionData}) {
  const content = stegaClean(data.layout) === 'split'
    ? <SplitHero data={data} />
    : <FullWidthHero data={data} />

  return (
    <BlockStylesWrapper blockStyles={data.blockStyles}>
      {content}
    </BlockStylesWrapper>
  )
}
