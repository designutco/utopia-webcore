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
      <div className="flex h-screen" style={{ background: '#ffffff' }}>
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

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8" style={{ background: '#ffffff' }}>
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed bottom-4 right-4 z-20 w-12 h-12 rounded-full shadow-lg flex items-center justify-center md:hidden"
            style={{ background: 'var(--primary)', color: 'white' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="md:-mt-8 md:-mx-8 md:px-8 md:flex md:items-center md:h-16 md:border-b md:border-[#e2e8f0]">
            <Breadcrumb />
          </div>
          <div className="h-px mt-3 mb-5 md:hidden" style={{ background: '#e2e8f0' }} />
          <div className="hidden md:block md:mt-5" />
          {children}
        </main>
      </div>
    </WebsiteProvider>
  )
}
