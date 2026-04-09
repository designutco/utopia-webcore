'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import FlagIcon from '@/components/FlagIcon'

interface Translation {
  language: string
  title: string
  content: string
  excerpt: string
  meta_title: string
  meta_description: string
}

interface Post {
  id: string
  website: string
  slug: string
  cover_image_url: string | null
  status: 'draft' | 'published'
  published_at: string | null
  created_at: string
  blog_translations: Translation[]
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ms', label: 'Malay' },
  { code: 'zh', label: 'Chinese' },
]

export default function BlogViewPage() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeLang, setActiveLang] = useState('en')

  useEffect(() => {
    fetch(`/api/blog/${id}`)
      .then(r => r.json())
      .then(data => { if (data.id) setPost(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-12 text-center text-sm" style={{ color: '#475569' }}>Loading…</div>
  if (!post) return <div className="p-12 text-center text-sm" style={{ color: '#475569' }}>Post not found</div>

  const translations = post.blog_translations ?? []
  const t = translations.find(tr => tr.language === activeLang) ?? translations[0]
  const availableLangs = translations.map(tr => tr.language)

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Link href={`/blog/${id}/edit`} className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Preview</h1>
            <p className="text-xs" style={{ color: '#94a3b8' }}>{post.website} / {post.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
            {post.status}
          </span>
          <a href={`https://${post.website}/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors" style={{ color: '#475569' }}>
            Open
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
          <Link href={`/blog/${id}/edit`}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors" style={{ color: '#475569' }}>
            Edit
          </Link>
        </div>
      </div>

      {/* Language switcher */}
      <div className="flex gap-2 mb-6">
        {LANGUAGES.map(lang => {
          const hasTranslation = availableLangs.includes(lang.code)
          return (
            <button
              key={lang.code}
              onClick={() => hasTranslation && setActiveLang(lang.code)}
              disabled={!hasTranslation}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${!hasTranslation ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              style={{
                background: activeLang === lang.code ? 'var(--primary)' : '#f1f5f9',
                color: activeLang === lang.code ? 'white' : '#475569',
              }}
            >
              <span className="inline-flex items-center gap-1.5"><FlagIcon lang={lang.code} size={14} /> {lang.label}</span>
            </button>
          )
        })}
      </div>

      {!t ? (
        <div className="p-12 text-center text-sm rounded-xl border" style={{ borderColor: '#cbd5e1', color: '#475569' }}>
          No translation available for this language.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Cover image */}
          {post.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.cover_image_url} alt="" className="w-full h-48 sm:h-64 object-cover" />
          )}

          {/* Content */}
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>{t.title}</h1>

            {t.excerpt && (
              <p className="text-sm mb-6 leading-relaxed" style={{ color: '#475569' }}>{t.excerpt}</p>
            )}

            {post.published_at && (
              <p className="text-xs mb-6" style={{ color: '#94a3b8' }}>
                Published {new Date(post.published_at).toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}

            <div className="h-px mb-6" style={{ background: '#e2e8f0' }} />

            {/* Rendered HTML content */}
            <div
              className="tiptap prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: t.content || '<p style="color: #94a3b8">No content yet.</p>' }}
            />
          </div>

          {/* SEO preview */}
          {(t.meta_title || t.meta_description) && (
            <div className="border-t p-6 sm:p-8" style={{ borderColor: '#e2e8f0', background: '#f8fafc' }}>
              <h3 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#94a3b8' }}>SEO Preview</h3>
              <div className="rounded-lg border p-4" style={{ borderColor: '#e2e8f0', background: 'white' }}>
                <p className="text-sm font-medium truncate" style={{ color: '#1a0dab' }}>{t.meta_title || t.title}</p>
                <p className="text-xs truncate mt-0.5" style={{ color: '#006621' }}>https://{post.website}/{post.slug}</p>
                <p className="text-xs mt-1 line-clamp-2" style={{ color: '#545454' }}>{t.meta_description || t.excerpt}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
