/** Edge/Node 공통 — httpOnly 세션 토큰 (HMAC-SHA256). */

export const ADMIN_SESSION_COOKIE = 'hunmin_admin_session'
const ADMIN_SESSION_HEADER = '__admin_session_hmac_v1'

const encoder = new TextEncoder()

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    const slice = bytes.subarray(i, i + chunk)
    for (let j = 0; j < slice.length; j++) {
      binary += String.fromCharCode(slice[j]!)
    }
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4))
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + pad
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

export function getAdminSessionSecret(): string {
  const explicit = process.env.ADMIN_SESSION_SECRET?.trim()
  if (explicit) return explicit
  if (process.env.NODE_ENV === 'development')
    return `__hunmin-admin-dev-placeholder__${ADMIN_SESSION_HEADER}`
  return ''
}

export async function createAdminSessionToken(secret: string, username: string, maxAgeSec = 60 * 60 * 24 * 7) {
  const exp = Math.floor(Date.now() / 1000) + maxAgeSec
  const payload = JSON.stringify({ u: username, exp })
  const payloadBytes = encoder.encode(payload)
  const key = await hmacKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, payloadBytes)
  return `${bytesToBase64Url(payloadBytes)}.${bytesToBase64Url(new Uint8Array(sig))}`
}

export async function verifyAdminSessionToken(secret: string, token: string | undefined): Promise<string | null> {
  if (!token || !secret) return null
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [payloadB64, sigB64] = parts
  if (!payloadB64 || !sigB64) return null
  let payloadBytes: Uint8Array
  let sig: Uint8Array
  try {
    payloadBytes = base64UrlToBytes(payloadB64)
    sig = base64UrlToBytes(sigB64)
  } catch {
    return null
  }
  const key = await hmacKey(secret)
  const ok = await crypto.subtle.verify(
    'HMAC',
    key,
    Uint8Array.from(sig),
    Uint8Array.from(payloadBytes),
  )
  if (!ok) return null
  let data: { u: string; exp: number }
  try {
    data = JSON.parse(new TextDecoder().decode(payloadBytes)) as { u: string; exp: number }
  } catch {
    return null
  }
  if (typeof data.u !== 'string' || typeof data.exp !== 'number') return null
  if (data.exp < Math.floor(Date.now() / 1000)) return null
  return data.u
}
