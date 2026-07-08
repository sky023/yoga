import type {PricingCardData} from '@/types/sanity'

function resolveCtaHref(cta: NonNullable<PricingCardData['cta']>): string | null {
  const item = cta.link?.[0]
  if (!item) return null
  if (item._type === 'linkExternal') return item.url || null
  if (item._type === 'pageSlug') return item.slug ? `/${item.slug}` : null
  return null
}

function CheckIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-muted opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export function PricingCardContent({data}: {data: PricingCardData}) {
  if (!data.title && !data.price) return null

  const features = data.features || []
  const highlightBorder = data.isHighlighted
    ? 'border-primary shadow-lg shadow-primary/10'
    : 'border-border'

  return (
    <div
      className={`relative my-4 flex flex-col rounded-2xl border-2 bg-card p-6 ${highlightBorder}`}
    >
      {data.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          {data.badge}
        </span>
      )}

      {data.title && (
        <h3 className="text-lg font-semibold text-card-foreground">{data.title}</h3>
      )}

      {data.price && (
        <div className="mt-4">
          <span className="text-4xl font-bold tracking-tight text-card-foreground">
            {data.price}
          </span>
          {data.priceSubtext && (
            <span className="ml-1 text-sm text-muted">{data.priceSubtext}</span>
          )}
        </div>
      )}

      {features.length > 0 && (
        <ul className="mt-6 flex flex-col gap-3" role="list">
          {features.map((feature) => (
            <li key={feature._key} className="flex items-center gap-3">
              {feature.included ? <CheckIcon /> : <XIcon />}
              <span
                className={`text-sm ${
                  feature.included ? 'text-card-foreground' : 'text-muted line-through'
                }`}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      )}

      {data.cta?.label && (() => {
        const href = resolveCtaHref(data.cta)
        return (
        <div className="mt-8 pt-2">
          {href ? (
            <a
              href={href}
              className={`block w-full rounded-lg px-4 py-3 text-center text-sm font-semibold transition-colors ${
                data.isHighlighted
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-foreground/5 text-card-foreground hover:bg-foreground/10'
              }`}
            >
              {data.cta.label}
            </a>
          ) : (
            <span
              className={`block w-full rounded-lg px-4 py-3 text-center text-sm font-semibold ${
                data.isHighlighted
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-foreground/5 text-card-foreground'
              }`}
            >
              {data.cta.label}
            </span>
          )}
        </div>
        )
      })()}
    </div>
  )
}
