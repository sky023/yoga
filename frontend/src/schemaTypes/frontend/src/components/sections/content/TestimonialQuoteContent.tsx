import {SanityImage} from '../../shared/SanityImage'
import type {TestimonialQuoteData} from '@/types/sanity'

function StarRating({rating}: {rating: number}) {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)))
  return (
    <div className="flex gap-1" aria-label={`${clamped} out of 5 stars`}>
      {Array.from({length: 5}, (_, i) => (
        <svg
          key={i}
          className={`h-5 w-5 ${i < clamped ? 'text-amber-400' : 'text-border'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function TestimonialQuoteContent({data}: {data: TestimonialQuoteData}) {
  if (!data.quote) return null

  const validRating = typeof data.rating === 'number' && data.rating >= 1 && data.rating <= 5 ? data.rating : 0

  return (
    <blockquote className="my-6 text-center">
      <span
        className="block text-6xl leading-none text-primary opacity-40 select-none"
        aria-hidden="true"
      >
        &ldquo;
      </span>

      <p className="mx-auto max-w-2xl text-lg leading-relaxed text-foreground italic md:text-xl">
        {data.quote}
      </p>

      {validRating > 0 && (
        <div className="mt-4 flex justify-center">
          <StarRating rating={validRating} />
        </div>
      )}

      <footer className="mt-6 flex items-center justify-center gap-4">
        {data.avatar?.asset && (
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
            <SanityImage
              value={data.avatar}
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {(data.name || data.title) && (
          <div className="text-left">
            {data.name && (
              <cite className="block text-sm font-semibold not-italic text-foreground">
                {data.name}
              </cite>
            )}
            {data.title && (
              <span className="block text-sm text-muted">{data.title}</span>
            )}
          </div>
        )}
      </footer>
    </blockquote>
  )
}
