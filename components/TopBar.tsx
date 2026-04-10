'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface Notification {
  id: string
  message: string
  time: string
  read: boolean
}

export default function TopBar() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showPanel, setShowPanel] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Fetch notifications (tickets as notifications for now)
  useEffect(() => {
    fetch('/api/tickets')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNotifications(data.slice(0, 10).map((t: { id: string; subject: string; created_at: string; status: string }) => ({
            id: t.id,
            message: t.subject,
            time: t.created_at,
            read: t.status === 'closed',
          })))
        }
      })
      .catch(() => {})
  }, [])

  // Close panel on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setShowPanel(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  function clearAll() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  function formatTime(d: string) {
    const diff = Date.now() - new Date(d).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div className="flex items-center gap-1">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
        style={{ color: '#94a3b8' }}
        title="Go back"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Forward */}
      <button
        onClick={() => router.forward()}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
        style={{ color: '#94a3b8' }}
        title="Go forward"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Notification bell */}
      <div className="relative" ref={panelRef}>
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors relative"
          style={{ color: '#94a3b8' }}
          title="Notifications"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: '#ef4444' }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notification panel */}
        {showPanel && (
          <div className="absolute right-0 top-10 w-80 rounded-xl border shadow-lg z-50" style={{ background: 'white', borderColor: '#e2e8f0' }}>
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: '#fef2f2', color: '#ef4444' }}>
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button onClick={clearAll} className="text-[10px] font-medium hover:underline" style={{ color: 'var(--primary)' }}>
                  Mark all read
                </button>
              )}
            </div>

            {/* Items */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#e2e8f0' }} strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <p className="text-xs" style={{ color: '#94a3b8' }}>No notifications</p>
                </div>
              ) : (
                notifications.map((n, i) => (
                  <div key={n.id}
                    className="px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors"
                    style={{ borderBottom: i < notifications.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? 'opacity-0' : ''}`} style={{ background: '#3b82f6' }} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs ${n.read ? '' : 'font-medium'}`} style={{ color: n.read ? '#94a3b8' : 'var(--foreground)' }}>{n.message}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: '#cbd5e1' }}>{formatTime(n.time)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
