'use client'

import {useEffect, useRef} from 'react'
import type {LottieAnimationData} from '@/types/sanity'

export function LottieAnimationContent({data}: {data: LottieAnimationData}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!data.url || !containerRef.current) return

    // Attempt to load lottie-web dynamically for real animation support.
    // If lottie-web is not installed, the placeholder UI remains visible.
    let animation: {destroy: () => void; setSpeed?: (s: number) => void} | null = null

    // eslint-disable-next-line @typescript-eslint/no-require-imports -- dynamic import for optional dependency
    import(/* webpackIgnore: true */ 'lottie-web')
      .then((lottie: {default: {loadAnimation: (config: Record<string, unknown>) => {destroy: () => void; setSpeed?: (s: number) => void}}}) => {
        if (!containerRef.current) return

        // Clear placeholder content when lottie loads successfully
        containerRef.current.innerHTML = ''

        animation = lottie.default.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: data.loop !== false,
          autoplay: data.autoplay !== false,
          path: data.url,
        })

        if (typeof data.speed === 'number' && data.speed > 0 && animation.setSpeed) {
          animation.setSpeed(data.speed)
        }
      })
      .catch(() => {
        // lottie-web is not installed; placeholder remains
      })

    return () => {
      animation?.destroy()
    }
  }, [data.url, data.autoplay, data.loop, data.speed])

  if (!data.url) return null

  return (
    <div className="my-4">
      <div
        ref={containerRef}
        className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-border bg-card"
      >
        {/* Placeholder shown until lottie-web loads (or permanently if not installed) */}
        <div className="text-center text-sm text-muted">
          <p className="mb-2">Lottie Animation</p>
          <p className="text-xs opacity-60">Install lottie-web to enable</p>
        </div>
      </div>
      {data.alt && (
        <p className="mt-2 text-center text-sm text-muted">{data.alt}</p>
      )}
    </div>
  )
}
