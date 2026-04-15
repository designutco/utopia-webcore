import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { createClient } from '@/lib/supabase/server'
import { generateApiKey } from '@/lib/validateApiKey'

// GET /api/admin/api-keys — list all API keys (admin only)
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = createServiceClient()
  const { data: profile } = await service.from('user_profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

  const { data, error } = await service
    .from('api_keys')
    .select('id, name, key, website, permissions, is_active, last_used, created_at')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Mask keys — only show last 8 chars
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const masked = (data ?? []).map((k: any) => ({
    ...k,
    key_preview: `uwc_...${k.key.slice(-8)}`,
  }))

  return NextResponse.json(masked)
}

// POST /api/admin/api-keys — create a new API key
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = createServiceClient()
  const { data: profile } = await service.from('user_profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

  const { name, website, permissions } = await request.json()
  if (!name || !website) return NextResponse.json({ error: 'Name and website are required' }, { status: 400 })

  const validPerms = ['read', 'write', 'all']
  const perms = Array.isArray(permissions) ? permissions.filter((p: string) => validPerms.includes(p)) : ['read']

  const key = generateApiKey()

  const { data, error } = await service
    .from('api_keys')
    .insert({
      name,
      key,
      website,
      permissions: perms,
      is_active: true,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Return the FULL key only on creation — it won't be shown again
  return NextResponse.json({ ...data, full_key: key }, { status: 201 })
}

// DELETE /api/admin/api-keys — deactivate a key
export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = createServiceClient()
  const { data: profile } = await service.from('user_profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'Key id is required' }, { status: 400 })

  const { error } = await service.from('api_keys').update({ is_active: false }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
