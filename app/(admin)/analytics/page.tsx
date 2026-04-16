'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AnalyticsRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const params = searchParams.toString()
    router.replace(`/websites${params ? `?${params}` : ''}`)
  }, [router, searchParams])

  return (
    <div className="p-12 text-center text-sm" style={{ color: '#94a3b8' }}>
      Redirecting to Websites…
    </div>
  )
}
