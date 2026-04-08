import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { createClient } from '@/lib/supabase/server'

// GET /api/blog/[id] — get post with all translations
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = createServiceClient()
  const { data, error } = await service
    .from('blog_posts')
    .select('*, blog_translations(*)')
    .eq('id', id)
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

// PATCH /api/blog/[id] — update post + translations
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { translations, ...postFields } = body

  const service = createServiceClient()

  // If changing slug, check for duplicates
  if (postFields.slug) {
    const { data: current } = await service.from('blog_posts').select('website, slug').eq('id', id).single()
    if (current && postFields.slug !== current.slug) {
      const { data: existing } = await service
        .from('blog_posts').select('id').eq('website', current.website).eq('slug', postFields.slug).maybeSingle()
      if (existing) {
        return NextResponse.json({ error: `Slug "${postFields.slug}" already exists for this website` }, { status: 409 })
      }
    }
  }

  // Handle publish/unpublish
  if (postFields.status === 'published' && !postFields.published_at) {
    postFields.published_at = new Date().toISOString()
  } else if (postFields.status === 'draft') {
    postFields.published_at = null
  }

  // Update post fields
  if (Object.keys(postFields).length > 0) {
    postFields.updated_at = new Date().toISOString()
    const { error } = await service.from('blog_posts').update(postFields).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Upsert translations
  if (Array.isArray(translations)) {
    for (const t of translations) {
      const { error } = await service
        .from('blog_translations')
        .upsert({
          post_id: id,
          language: t.language,
          title: t.title ?? '',
          content: t.content ?? '',
          excerpt: t.excerpt ?? '',
          meta_title: t.meta_title ?? '',
          meta_description: t.meta_description ?? '',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'post_id,language' })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  // Return updated post with translations
  const { data } = await service.from('blog_posts').select('*, blog_translations(*)').eq('id', id).single()
  return NextResponse.json(data)
}

// DELETE /api/blog/[id]
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const service = createServiceClient()
  const { error } = await service.from('blog_posts').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
