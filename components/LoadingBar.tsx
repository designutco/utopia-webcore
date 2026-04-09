'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function LoadingBar() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timeout)
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(2px)' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-slate-200" style={{ borderTopColor: 'var(--primary)', animation: 'spin 0.6s linear infinite' }} />
        <span className="text-xs font-medium" style={{ color: '#94a3b8' }}>Loading…</span>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
