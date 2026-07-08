'use client'

import {useState, useEffect, useCallback, useRef} from 'react'
import {Image} from 'next-sanity/image'
import {urlFor} from '@/sanity/lib/image'
import type {TestimonialCarouselData} from '@/types/sanity'

type Testimonial = TestimonialCarouselData['testimonials'][number]

const MS_PER_SECOND = 1000

export function TestimonialCarouselContent({data}: {data: TestimonialCarouselData}) {
  const testimonials = data.testimonials || []
  const autoPlayInterval = data.autoPlayInterval || 5
  const showDots = data.showDots !== false
  const showArrows = data.showArrows !== false

  const [current, setCurrent] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const goTo = useCallback(
    (idx: number) => {
      const clamped = ((idx % testimonials.length) + testimonials.length) % testimonials.length
      setCurrent(clamped)
      const container = scrollRef.current
      const child = container?.children[clamped] as HTMLElement | undefined
      if (container && child) {
        container.scrollTo({left: child.offsetLeft - container.offsetLeft, behavior: 'smooth'})
      }
    },
    [testimonials.length],
  )

  useEffect(() => {
    if (!data.autoPlay || testimonials.length <= 1) return
    const timer = setInterval(() => {
      goTo(current + 1)
    }, autoPlayInterval * MS_PER_SECOND)
    return () => clearInterval(timer)
  }, [data.autoPlay, autoPlayInterval, current, goTo, testimonials.length])

  if (testimonials.length === 0) return null

  return (
    <div>
      {data.title && (
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {data.title}
        </h2>
      )}

      <div className="relative">
        {/* Carousel track */}
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((t: Testimonial) => (
            <div
              key={t._key}
              className="w-full flex-shrink-0 snap-start rounded-xl border border-border bg-card p-6 sm:p-8"
            >
              {/* Stars */}
              {t.rating && (
                <div className="mb-4 flex gap-0.5">
                  {Array.from({length: 5}, (_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${i < t.rating! ? 'text-yellow-400' : 'text-border'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              )}

              <blockquote className="text-base leading-relaxed text-foreground sm:text-lg">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="mt-6 flex items-center gap-3">
                {t.avatar?.asset && (
                  <Image
                    src={urlFor(t.avatar).width(48).height(48).fit('max').url()}
                    alt={t.name || ''}
                    width={48}
                    height={48}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
                <div>
                  {t.name && (
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  )}
                  {t.title && (
                    <p className="text-xs text-muted">{t.title}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Arrows */}
        {showArrows && testimonials.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              className="absolute -left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-colors hover:bg-muted/30"
              aria-label="Previous"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => goTo(current + 1)}
              className="absolute -right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-colors hover:bg-muted/30"
              aria-label="Next"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {showDots && testimonials.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((t: Testimonial, i: number) => (
            <button
              key={t._key}
              type="button"
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? 'w-6 bg-primary' : 'w-2 bg-border'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
