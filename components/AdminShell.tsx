'use client'

import { useState } from 'react'
import { WebsiteProvider } from '@/contexts/WebsiteContext'
import Sidebar from './Sidebar'
import Breadcrumb from './Breadcrumb'

interface AdminShellProps {
  userEmail: string
  children: React.ReactNode
}

export default function AdminShell({ userEmail, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <WebsiteProvider>
      <div className="flex h-screen" style={{ background: '#1e293b' }}>
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar
          userEmail={userEmail}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8" style={{ background: '#1e293b' }}>
          {/* Mobile header with hamburger */}
          <div className="flex items-center gap-3 mb-2 md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-lg border"
              style={{ borderColor: 'rgba(255,255,255,0.15)', color: '#e2e8f0' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a1a3a, #1565c0, #2196f3)' }}>
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/>
                </svg>
              </div>
              <span className="text-sm font-bold text-white">Utopia Webcore</span>
            </div>
          </div>

          <Breadcrumb />
          {children}
        </main>
      </div>
    </WebsiteProvider>
  )
}
