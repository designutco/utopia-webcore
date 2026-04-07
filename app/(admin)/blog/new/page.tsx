'use client'

import { useSearchParams } from 'next/navigation'
import PostForm from '@/components/PostForm'

export default function NewPostPage() {
  const searchParams = useSearchParams()
  const website = searchParams.get('website') ?? ''
  return <PostForm mode="new" initialData={website ? { website } : {}} />
}
