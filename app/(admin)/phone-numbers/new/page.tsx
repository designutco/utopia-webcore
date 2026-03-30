'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const steps = ['Enter Details', 'Set Location', 'Confirm']

function InputField({
  label, value, onChange, placeholder, hint, error, required = true
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  hint?: string
  error?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: '#1a1a2e' }}>
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm rounded-lg border focus:outline-none transition-colors"
        style={{ borderColor: error ? '#fca5a5' : 'var(--border)', background: 'white' }}
        onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'}
        onBlur={e => e.currentTarget.style.borderColor = error ? '#fca5a5' : 'var(--border)'}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs" style={{ color: '#7dbdd0' }}>{hint}</p>}
    </div>
  )
}

export default function NewPhoneNumberPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    website: '',
    product_slug: '',
    location_slug: '',
    phone_number: '',
    label: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState('')

  function validate() {
    const e: Record<string, string> = {}
    if (!form.website.trim()) e.website = 'Website domain is required'
    if (!form.location_slug.trim()) e.location_slug = 'Location slug is required'
    if (!form.phone_number.trim()) e.phone_number = 'Phone number is required'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setSaving(true)
    setServerError('')
    const res = await fetch('/api/phone-numbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        website: form.website.trim(),
        product_slug: form.product_slug.trim() || 'default',
        location_slug: form.location_slug.trim(),
        phone_number: form.phone_number.trim(),
        label: form.label.trim() || null,
      }),
    })
    setSaving(false)
    if (res.ok) {
      router.push('/phone-numbers')
    } else {
      const d = await res.json()
      setServerError(d.error ?? 'Something went wrong')
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col justify-center"><div className="max-w-xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Add Phone Number</h1>
      <p className="text-sm mb-6" style={{ color: '#4a7a8a' }}>Add a new number to the rotation pool for a website and location.</p>

      {/* Main card */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>

        {/* Card header */}
        <div className="px-5 py-4 flex items-center gap-2" style={{ background: '#f4f9fb', borderBottom: '1px solid var(--border)' }}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--primary)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Phone Number Details</span>
        </div>

        {/* Step indicator */}
        <div className="px-5 pt-5 pb-3 flex items-center gap-0" style={{ background: '#f4f9fb', borderBottom: '1px solid var(--border)' }}>
          {steps.map((step, i) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={i === 0
                    ? { background: 'var(--primary)', color: 'white' }
                    : { background: '#e2eef2', color: '#7dbdd0' }
                  }
                >
                  {i + 1}
                </div>
                <span className="text-xs font-medium whitespace-nowrap" style={{ color: i === 0 ? 'var(--primary)' : '#7dbdd0' }}>
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px mx-3" style={{ background: i === 0 ? 'var(--primary)' : '#e2eef2' }} />
              )}
            </div>
          ))}
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4" style={{ background: 'white' }}>

            {serverError && (
              <div className="p-3 rounded-lg border text-sm" style={{ background: '#fef2f2', borderColor: '#fca5a5', color: '#dc2626' }}>
                {serverError}
              </div>
            )}

            <InputField
              label="Website Domain"
              value={form.website}
              onChange={v => setForm(f => ({ ...f, website: v }))}
              placeholder="e.g. oxihome.my"
              hint="The domain name of the website"
              error={errors.website}
            />
            <InputField
              label="Location Slug"
              value={form.location_slug}
              onChange={v => setForm(f => ({ ...f, location_slug: v }))}
              placeholder="e.g. kuala-lumpur"
              hint="Lowercase, hyphenated — matches your URL structure"
              error={errors.location_slug}
            />
            <InputField
              label="Phone Number"
              value={form.phone_number}
              onChange={v => setForm(f => ({ ...f, phone_number: v }))}
              placeholder="e.g. 60123456789"
              hint="Include country code, no spaces or dashes"
              error={errors.phone_number}
            />
            <InputField
              label="Label"
              value={form.label}
              onChange={v => setForm(f => ({ ...f, label: v }))}
              placeholder="e.g. Agent A"
              hint="Optional — helps identify this number in the list"
              required={false}
            />
          </div>

          {/* Info boxes */}
          <div className="grid grid-cols-2 gap-3 px-5 pb-5" style={{ background: 'white' }}>
            <div className="rounded-lg border p-3" style={{ background: '#fff7ed', borderColor: '#fed7aa' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <span className="text-xs font-semibold text-orange-700">Important</span>
              </div>
              <ul className="space-y-1">
                {['Domain must match exactly', 'Location slug must match URL', 'Include country code'].map(t => (
                  <li key={t} className="text-xs text-orange-700 flex items-start gap-1">
                    <span className="mt-0.5">•</span>{t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border p-3" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-semibold text-green-700">How rotation works</span>
              </div>
              <ul className="space-y-1">
                {['Add multiple numbers per location', 'One is picked at random per click', 'Toggle active to pause a number'].map(t => (
                  <li key={t} className="text-xs text-green-700 flex items-start gap-1">
                    <span className="mt-0.5">•</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider + submit */}
          <div style={{ borderTop: '1px solid var(--border)' }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ background: 'white' }}>
              <Link
                href="/phone-numbers"
                className="text-sm px-4 py-2 rounded-lg border transition-colors"
                style={{ borderColor: 'var(--border)', color: '#4a7a8a' }}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="text-sm font-semibold px-6 py-2.5 rounded-lg text-white transition-opacity disabled:opacity-50"
                style={{ background: 'var(--primary)', minWidth: '160px' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--primary-hover)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--primary)'}
              >
                {saving ? 'Saving…' : 'Add Phone Number'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div></div>
  )
}
