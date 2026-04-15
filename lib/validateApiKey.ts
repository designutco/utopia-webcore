import { createServiceClient } from '@/lib/supabase/service'
import crypto from 'crypto'

export interface ApiKeyInfo {
  id: string
  name: string
  website: string
  permissions: string[]
}

/**
 * Generate a secure API key prefixed with "uwc_" for easy identification.
 */
export function generateApiKey(): string {
  return `uwc_${crypto.randomBytes(32).toString('hex')}`
}

/**
 * Validate an API key from the X-API-Key header.
 * Returns the key info if valid, null otherwise.
 * Also updates last_used timestamp.
 */
export async function validateApiKey(
  key: string | null,
  requiredPermission: 'read' | 'write',
  requiredWebsite?: string,
): Promise<ApiKeyInfo | null> {
  if (!key) return null

  const service = createServiceClient()
  const { data } = await service
    .from('api_keys')
    .select('id, name, website, permissions')
    .eq('key', key)
    .eq('is_active', true)
    .single()

  if (!data) return null

  // Check permission
  const perms = data.permissions as string[]
  if (!perms.includes(requiredPermission) && !perms.includes('all')) return null

  // Check website scope
  if (requiredWebsite && data.website !== requiredWebsite && data.website !== '*') return null

  // Update last_used (fire and forget)
  service.from('api_keys').update({ last_used: new Date().toISOString() }).eq('id', data.id).then(() => {})

  return {
    id: data.id,
    name: data.name,
    website: data.website,
    permissions: perms,
  }
}
