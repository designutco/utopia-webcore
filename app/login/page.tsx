'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Email and password are required.')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (authError) {
      setError(authError.message)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="login-bg min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" strokeWidth="1.5"/>
              <path strokeWidth="1.5" d="M12 3c0 0-3 4-3 9s3 9 3 9"/>
              <path strokeWidth="1.5" d="M12 3c0 0 3 4 3 9s-3 9-3 9"/>
              <path strokeWidth="1.5" d="M3 12h18"/>
              <path strokeWidth="1.5" d="M4.5 7.5h15"/>
              <path strokeWidth="1.5" d="M4.5 16.5h15"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Utopia Webcore</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Web & Content Operations</p>
        </div>

        <div className="rounded-2xl shadow-2xl p-8" style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)' }}>
          <div className="mb-7">
            <h2 className="text-xl font-bold tracking-tight mb-1" style={{ color: '#0f1720' }}>Welcome back</h2>
            <p className="text-sm" style={{ color: '#6b7f8d' }}>Sign in to your workspace to continue.</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg border text-sm flex items-center gap-2" style={{ background: '#fef2f2', borderColor: '#fca5a5', color: '#dc2626' }}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#4a6070' }}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none transition-shadow"
                style={{ borderColor: '#dde3e8', color: '#0f1720' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(28,110,140,0.12)' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#dde3e8'; e.currentTarget.style.boxShadow = 'none' }}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#4a6070' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none transition-shadow"
                style={{ borderColor: '#dde3e8', color: '#0f1720' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(28,110,140,0.12)' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#dde3e8'; e.currentTarget.style.boxShadow = 'none' }}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3 px-4 rounded-xl text-sm transition-opacity disabled:opacity-50 mt-1"
              style={{ background: 'var(--primary)' }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.opacity = '0.88' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
            >
              {loading ? 'Signing in…' : 'Access Workspace →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
