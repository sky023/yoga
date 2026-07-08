import {stegaClean} from 'next-sanity'
import {Image} from 'next-sanity/image'
import {urlFor} from '@/sanity/lib/image'
import type {FeatureCardGridData} from '@/types/sanity'

const COLS_MAP: Record<string, string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
}

const CARD_STYLES: Record<string, string> = {
  simple: '',
  bordered: 'border border-border',
  shadow: 'shadow-md shadow-black/5',
  highlighted: 'border border-primary/20 bg-primary/5',
}

export function FeatureCardGridContent({data}: {data: FeatureCardGridData}) {
  const cards = data.cards || []
  const columns = data.columns || '3'
  const style = data.style || 'simple'

  if (cards.length === 0) return null

  const colClass = COLS_MAP[stegaClean(columns)] || COLS_MAP['3']
  const cardClass = CARD_STYLES[stegaClean(style)] || ''

  return (
    <div>
      {data.title && (
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {data.title}
        </h2>
      )}
      {data.subtitle && (
        <p className="mt-2 text-base text-muted">{data.subtitle}</p>
      )}

      <div className={`${data.title || data.subtitle ? 'mt-8' : ''} grid grid-cols-1 gap-6 ${colClass}`}>
        {cards.map((card) => (
          <div
            key={card._key}
            className={`rounded-xl p-6 transition-colors ${cardClass}`}
          >
            {card.icon?.asset && (
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Image
                  src={urlFor(card.icon).width(40).height(40).fit('max').url()}
                  alt=""
                  width={40}
                  height={40}
                  className="h-5 w-5"
                />
              </div>
            )}
            {card.title && (
              <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
            )}
            {card.description && (
              <p className="mt-2 text-sm leading-relaxed text-muted">{card.description}</p>
            )}
            {card.cta?.label && card.cta?.href && (
              <a
                href={card.cta.href}
                className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                {card.cta.label}
                <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
