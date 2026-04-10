'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

export type ConfirmVariant = 'danger' | 'warning' | 'info'

interface ConfirmOptions {
  title?: string
  message: string | ReactNode
  confirmLabel?: string
  cancelLabel?: string
  variant?: ConfirmVariant
}

interface ConfirmContextType {
  confirm: (opts: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextType>({
  confirm: async () => false,
})

interface PendingConfirm extends ConfirmOptions {
  resolve: (value: boolean) => void
}

const VARIANT_STYLES: Record<ConfirmVariant, { ring: string; icon: string; iconBg: string; btn: string; btnHover: string }> = {
  danger: {
    ring: '#fecaca',
    icon: '#dc2626',
    iconBg: '#fef2f2',
    btn: '#dc2626',
    btnHover: '#b91c1c',
  },
  warning: {
    ring: '#fed7aa',
    icon: '#d97706',
    iconBg: '#fff7ed',
    btn: '#d97706',
    btnHover: '#b45309',
  },
  info: {
    ring: '#bfdbfe',
    icon: '#2563eb',
    iconBg: '#eff6ff',
    btn: 'var(--primary)',
    btnHover: 'var(--primary-hover)',
  },
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null)

  const confirm = useCallback((opts: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setPending({ ...opts, resolve })
    })
  }, [])

  function handleCancel() {
    if (pending) {
      pending.resolve(false)
      setPending(null)
    }
  }

  function handleConfirm() {
    if (pending) {
      pending.resolve(true)
      setPending(null)
    }
  }

  const variant = pending?.variant ?? 'danger'
  const styles = VARIANT_STYLES[variant]

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {pending && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.15s ease' }}
          onClick={handleCancel}
        >
          <div
            className="w-full max-w-sm rounded-2xl border bg-white shadow-2xl overflow-hidden"
            style={{ borderColor: '#e2e8f0', animation: 'popIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Body */}
            <div className="p-6 flex gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center"
                  style={{ background: styles.iconBg, boxShadow: `0 0 0 6px ${styles.ring}33` }}
                >
                  {variant === 'danger' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" style={{ color: styles.icon }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                  {variant === 'warning' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" style={{ color: styles.icon }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                  )}
                  {variant === 'info' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" style={{ color: styles.icon }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                {pending.title && (
                  <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{pending.title}</h3>
                )}
                <div className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{pending.message}</div>
              </div>
            </div>
            {/* Footer */}
            <div className="px-6 py-4 flex items-center justify-end gap-2" style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
              <button
                type="button"
                onClick={handleCancel}
                className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:bg-white"
                style={{ borderColor: '#cbd5e1', color: '#475569', background: 'white' }}
              >
                {pending.cancelLabel ?? 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                autoFocus
                className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-colors"
                style={{ background: styles.btn }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = styles.btnHover)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = styles.btn)}
              >
                {pending.confirmLabel ?? 'Confirm'}
              </button>
            </div>
          </div>
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes popIn {
              from { transform: scale(0.95) translateY(4px); opacity: 0; }
              to { transform: scale(1) translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  return useContext(ConfirmContext).confirm
}
