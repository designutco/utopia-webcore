import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  const [{ count: phoneCount }, { count: postCount }] = await Promise.all([
    supabase.from('phone_numbers').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Phone Numbers', value: phoneCount ?? 0, href: '/phone-numbers', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { label: 'Blog Posts', value: postCount ?? 0, href: '/blog', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
      <p className="text-sm text-slate-400 mb-8">Manage phone numbers and blog content across all websites.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-lg">
        {stats.map(stat => (
          <Link
            key={stat.href}
            href={stat.href}
            className={`block p-5 rounded-xl border ${stat.color} hover:shadow-sm transition-shadow`}
          >
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm font-medium">{stat.label}</div>
          </Link>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/phone-numbers/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Phone Number
        </Link>
        <Link
          href="/blog/new"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Blog Post
        </Link>
      </div>
    </div>
  )
}
