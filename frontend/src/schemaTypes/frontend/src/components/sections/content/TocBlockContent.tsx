'use client'

import {useState, useEffect} from 'react'
import type {TocBlockData} from '@/types/sanity'

interface Heading {
  id: string
  text: string
  level: number
}

const OFFSET_PX = 100

export function TocBlockContent({data}: {data: TocBlockData}) {
  const title = data.title || 'Table of Contents'
  const [headings, setHeadings] = useState<ReadonlyArray<Heading>>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const elements = document.querySelectorAll('h2[id], h3[id]')
    const items: Heading[] = Array.from(elements).map((el) => ({
      id: el.id,
      text: el.textContent || '',
      level: el.tagName === 'H2' ? 2 : 3,
    }))
    setHeadings(items)
  }, [])

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        if (visible) setActiveId(visible.target.id)
      },
      {rootMargin: `-${OFFSET_PX}px 0px -66% 0px`},
    )

    headings.forEach((h) => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className="rounded-xl border border-border bg-surface/50 p-5">
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      <ul className="space-y-1">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? 'ml-4' : ''}>
            <a
              href={`#${h.id}`}
              className={`block rounded-md px-2 py-1 text-sm transition-colors ${
                activeId === h.id
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
