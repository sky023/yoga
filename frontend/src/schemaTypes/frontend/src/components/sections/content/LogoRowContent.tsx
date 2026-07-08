import {Image} from 'next-sanity/image'
import {urlFor} from '@/sanity/lib/image'
import type {LogoRowData} from '@/types/sanity'

type Logo = LogoRowData['logos'][number]

const SIZE_MAP: Record<string, {width: number; height: number; className: string}> = {
  small: {width: 80, height: 40, className: 'h-8 w-auto'},
  medium: {width: 120, height: 60, className: 'h-12 w-auto'},
  large: {width: 160, height: 80, className: 'h-16 w-auto'},
}

export function LogoRowContent({data}: {data: LogoRowData}) {
  const logos = data.logos || []

  if (logos.length === 0) return null

  const sizeKey = data.size && data.size in SIZE_MAP ? data.size : 'medium'
  const dimensions = SIZE_MAP[sizeKey]
  const grayscaleClass = data.grayscale ? 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300' : ''

  return (
    <div className="my-6">
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
        {logos.map((logo: Logo, index: number) => {
          if (!logo.image?.asset) return null

          const src = urlFor(logo.image)
            .width(dimensions.width * 2)
            .height(dimensions.height * 2)
            .url()
          const alt = logo.alt || ''

          const imageElement = (
            <Image
              src={src}
              alt={alt}
              width={dimensions.width}
              height={dimensions.height}
              className={`${dimensions.className} object-contain ${grayscaleClass}`}
            />
          )

          if (logo.link) {
            return (
              <a
                key={index}
                href={logo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                {imageElement}
              </a>
            )
          }

          return (
            <div key={index} className="inline-flex items-center">
              {imageElement}
            </div>
          )
        })}
      </div>
    </div>
  )
}
