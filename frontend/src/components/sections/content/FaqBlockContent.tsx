'use client'

import {useState, useCallback} from 'react'
import {PortableTextRenderer} from '../../shared/PortableTextRenderer'
import {toPlainText} from '@portabletext/toolkit'
import type {FaqBlockData} from '@/types/sanity'

type FaqItem = FaqBlockData['items'][number]

function buildJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items
      .filter((item) => item.question && item.answer)
      .map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer ? toPlainText(item.answer) : '',
        },
      })),
  }
}

export function FaqBlockContent({data}: {data: FaqBlockData}) {
  const enableSchema = data.enableSchema ?? true
  const allowMultipleOpen = data.allowMultipleOpen ?? true
  const firstOpenByDefault = data.firstOpenByDefault ?? false
  const items = data.items || []

  const initialOpen = firstOpenByDefault && items.length > 0
    ? new Set([items[0]._key])
    : new Set<string>()

  const [openKeys, setOpenKeys] = useState<ReadonlySet<string>>(initialOpen)

  const toggleItem = useCallback(
    (key: string) => {
      setOpenKeys((prev) => {
        const next = new Set(prev)
        if (next.has(key)) {
          next.delete(key)
        } else {
          if (!allowMultipleOpen) next.clear()
          next.add(key)
        }
        return next
      })
    },
    [allowMultipleOpen],
  )

  if (items.length === 0) return null

  return (
    <div>
      {enableSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(buildJsonLd(items))}}
        />
      )}

      {data.title && (
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {data.title}
        </h2>
      )}
      {data.subtitle && (
        <p className="mt-2 text-base text-muted">{data.subtitle}</p>
      )}

      <div className={`${data.title || data.subtitle ? 'mt-8' : ''} divide-y divide-border rounded-xl border border-border`}>
        {items.map((item) => {
          const isOpen = openKeys.has(item._key)
          return (
            <div key={item._key}>
              <button
                type="button"
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-muted/30"
                aria-expanded={isOpen}
                onClick={() => toggleItem(item._key)}
              >
                <span className="pr-4 font-medium text-foreground">
                  {item.question || 'Untitled'}
                </span>
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center text-muted transition-transform duration-200"
                  style={{transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'}}
                  aria-hidden="true"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5">
                  {item.answer && item.answer.length > 0 ? (
                    <div className="prose prose-slate max-w-none">
                      <PortableTextRenderer value={item.answer} />
                    </div>
                  ) : (
                    <p className="text-sm text-muted">No answer provided.</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
