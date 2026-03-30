'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface CrumbItem {
  label: string
  href?: string
}

function getcrumbs(pathname: string): CrumbItem[] {
  if (pathname === '/') return []

  if (pathname === '/phone-numbers') {
    return [{ label: 'Phone Numbers' }]
  }
  if (pathname === '/phone-numbers/new') {
    return [{ label: 'Phone Numbers', href: '/phone-numbers' }, { label: 'Add Number' }]
  }
  if (pathname === '/blog') {
    return [{ label: 'Blog Posts' }]
  }
  if (pathname === '/blog/new') {
    return [{ label: 'Blog Posts', href: '/blog' }, { label: 'New Post' }]
  }
  if (/^\/blog\/.+\/edit$/.test(pathname)) {
    return [{ label: 'Blog Posts', href: '/blog' }, { label: 'Edit Post' }]
  }

  return []
}

export default function Breadcrumb() {
  const pathname = usePathname()
  const crumbs = getcrumbs(pathname)

  return (
    <nav className="flex items-center gap-1.5 text-sm mb-6" aria-label="Breadcrumb">
      {/* Home */}
      <Link
        href="/"
        className="flex items-center transition-colors"
        style={{ color: pathname === '/' ? 'var(--primary)' : '#9896c8' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--primary)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = pathname === '/' ? 'var(--primary)' : '#9896c8'}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </Link>

      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {/* Separator */}
          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#c8c7e8' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>

          {crumb.href ? (
            <Link
              href={crumb.href}
              className="transition-colors"
              style={{ color: '#9896c8' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--primary)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#9896c8'}
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="font-medium" style={{ color: 'var(--foreground)' }}>{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
