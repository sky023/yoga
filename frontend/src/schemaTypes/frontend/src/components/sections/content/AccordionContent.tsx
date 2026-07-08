'use client'

import {useState, useCallback} from 'react'
import {PortableTextRenderer} from '../../shared/PortableTextRenderer'
import type {AccordionData} from '@/types/sanity'

export function AccordionContent({data}: {data: AccordionData}) {
  const panels = data.panels || []
  const [openKeys, setOpenKeys] = useState<ReadonlySet<string>>(new Set())

  const togglePanel = useCallback((key: string) => {
    setOpenKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }, [])

  if (panels.length === 0) return null

  return (
    <div>
      {data.title && (
        <h3 className="mb-4 text-xl font-semibold text-foreground">
          {data.title}
        </h3>
      )}
      <div className="divide-y divide-border rounded-lg border border-border">
        {panels.map((panel) => {
          const isOpen = openKeys.has(panel._key)
          return (
            <div key={panel._key}>
              <button
                type="button"
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors duration-200 hover:bg-muted/50"
                aria-expanded={isOpen}
                onClick={() => togglePanel(panel._key)}
              >
                <span className="font-medium text-foreground">
                  {panel.title || 'Untitled'}
                </span>
                <span
                  className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center text-muted transition-transform duration-200"
                  aria-hidden="true"
                >
                  {isOpen ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 pb-4">
                  {panel.content && panel.content.length > 0 ? (
                    <div className="prose prose-slate max-w-none">
                      <PortableTextRenderer value={panel.content} />
                    </div>
                  ) : (
                    <p className="text-sm text-muted">No content.</p>
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
