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

const VARIANT_STYLES: Record<ConfirmVariant, { ring: string; iconColor: string; iconBg: string; btn: string; btnHover: string }> = {
  danger: {
    ring: '#fee2e2',
    iconColor: '#ffffff',
    iconBg: '#dc2626',
    btn: '#dc2626',
    btnHover: '#b91c1c',
  },
  warning: {
    ring: '#fef3c7',
    iconColor: '#ffffff',
    iconBg: '#d97706',
    btn: '#d97706',
    btnHover: '#b45309',
  },
  info: {
    ring: '#dbeafe',
    iconColor: '#ffffff',
    iconBg: '#2979d6',
    btn: '#2979d6',
    btnHover: '#1e60b8',
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
          style={{ background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.15s ease' }}
          onClick={handleCancel}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl p-8 pt-10"
            style={{
              animation: 'popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close X */}
            <button
              type="button"
              onClick={handleCancel}
              className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-md transition-colors hover:bg-slate-100"
              style={{ color: '#94a3b8' }}
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: styles.iconBg, boxShadow: `0 0 0 8px ${styles.ring}` }}
              >
                {variant === 'danger' && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" style={{ color: styles.iconColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                )}
                {variant === 'warning' && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" style={{ color: styles.iconColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                )}
                {variant === 'info' && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" style={{ color: styles.iconColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
            </div>

            {/* Title */}
            <h3
              className="text-[22px] font-semibold text-center mb-2 tracking-tight"
              style={{ color: '#0f172a', letterSpacing: '-0.01em' }}
            >
              {pending.title ?? 'Are you sure?'}
            </h3>

            {/* Message */}
            <div
              className="text-[14px] text-center leading-relaxed mb-8 max-w-xs mx-auto"
              style={{ color: '#64748b' }}
            >
              {pending.message}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 max-w-[140px] text-[14px] font-semibold px-5 py-2.5 rounded-lg border transition-colors hover:bg-slate-50"
                style={{ borderColor: '#cbd5e1', color: '#475569', background: 'white' }}
              >
                {pending.cancelLabel ?? 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                autoFocus
                className="flex-1 max-w-[140px] text-[14px] font-semibold px-5 py-2.5 rounded-lg text-white transition-colors shadow-sm"
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
              from { transform: scale(0.92) translateY(8px); opacity: 0; }
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
