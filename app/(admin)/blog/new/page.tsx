'use client'

import { useSearchParams } from 'next/navigation'
import PostForm from '@/components/PostForm'

export default function NewPostPage() {
  const searchParams = useSearchParams()
  const website = searchParams.get('website') ?? ''
  const company = searchParams.get('company') ?? ''
  const initial: Record<string, string> = {}
  if (website) initial.website = website
  return <PostForm mode="new" initialData={initial} />
}
