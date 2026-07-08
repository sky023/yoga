'use client'

import {useState, useRef, useEffect, useCallback} from 'react'
import Link from 'next/link'
import {Image} from 'next-sanity/image'
import {urlFor} from '@/sanity/lib/image'
import type {SiteSettings, NavItem, NavLink, NavDropdown} from '@/types/sanity'

export function Header({settings}: {settings: SiteSettings | null}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const siteName = settings?.siteName || 'Page Builder'
  const nav = settings?.mainNav ?? []

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, {passive: true})
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-200 ${
        scrolled
          ? 'border-border bg-background/95 backdrop-blur-xl shadow-sm'
          : 'border-transparent bg-background/80 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          {settings?.logo?.asset ? (
            <Image
              src={urlFor(settings.logo).width(120).height(40).fit('max').url()}
              alt={settings.logo.alt || siteName}
              width={120}
              height={40}
              className="h-8 w-auto"
              priority
            />
          ) : (
            <span>{siteName}</span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            if (item._type === 'navDropdown') {
              return <DesktopDropdown key={item._key} item={item} />
            }
            const link = item as NavLink
            if (link.isButton) {
              return (
                <Link
                  key={link._key}
                  href={link.href}
                  className="ml-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                >
                  {link.label}
                </Link>
              )
            }
            return (
              <Link
                key={link._key}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-foreground/70 hover:bg-foreground/5 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-border px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {nav.map((item) => {
              if (item._type === 'navDropdown') {
                return <MobileDropdown key={item._key} item={item} onClose={() => setMobileOpen(false)} />
              }
              const link = item as NavLink
              return (
                <Link
                  key={link._key}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={
                    link.isButton
                      ? 'rounded-full bg-foreground px-4 py-2.5 text-center text-sm font-medium text-background'
                      : 'rounded-lg px-4 py-2.5 text-sm font-medium text-foreground/80 hover:bg-foreground/5'
                  }
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </header>
  )
}

function DesktopDropdown({item}: {item: NavDropdown}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        {item.label}
        <svg
          className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-64 rounded-xl border border-border bg-background p-2 shadow-lg">
          {(item.items || []).map((child) => (
            <Link
              key={child._key}
              href={child.href}
              onClick={() => setOpen(false)}
              className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-foreground/5"
            >
              {child.icon?.asset && (
                <Image
                  src={urlFor(child.icon).width(32).height(32).fit('max').url()}
                  alt=""
                  width={32}
                  height={32}
                  className="mt-0.5 h-5 w-5 shrink-0"
                />
              )}
              <div>
                <span className="block text-sm font-medium text-foreground">{child.label}</span>
                {child.description && (
                  <span className="block text-xs text-muted">{child.description}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function MobileDropdown({item, onClose}: {item: NavDropdown; onClose: () => void}) {
  const [expanded, setExpanded] = useState(false)

  const toggle = useCallback(() => setExpanded((prev) => !prev), [])

  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium text-foreground/80 hover:bg-foreground/5"
        onClick={toggle}
        aria-expanded={expanded}
      >
        {item.label}
        <svg
          className={`h-3 w-3 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="ml-4 flex flex-col gap-0.5 border-l border-border pl-4">
          {(item.items || []).map((child) => (
            <Link
              key={child._key}
              href={child.href}
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
            >
              {child.label}
              {child.description && (
                <span className="block text-xs text-muted">{child.description}</span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
