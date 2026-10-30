/** Edge/Node 공통 — httpOnly 세션 토큰 (HMAC-SHA256). */

export const ADMIN_SESSION_COOKIE = 'hunmin_admin_session'
/** 로그인한 시각부터. 이 시간이 지나면 그동안 썼어도 풀린다. */
export const ADMIN_SESSION_ABSOLUTE_SEC = 12 * 60 * 60
/** 마지막 사용 이후. 관리자 화면을 열거나 저장하면 다시 센다. */
export const ADMIN_SESSION_IDLE_SEC = 4 * 60 * 60
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

type SessionPayload = { u: string; iat: number; exp: number; seen: number }

export function adminSessionCookieOptions(): {
  httpOnly: true
  secure: boolean
  sameSite: 'lax'
  path: '/'
} {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  }
}

async function signPayload(secret: string, data: SessionPayload): Promise<string> {
  const payloadBytes = encoder.encode(JSON.stringify(data))
  const key = await hmacKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, payloadBytes)
  return `${bytesToBase64Url(payloadBytes)}.${bytesToBase64Url(new Uint8Array(sig))}`
}

export async function createAdminSessionToken(secret: string, username: string, nowSec = Math.floor(Date.now() / 1000)) {
  return signPayload(secret, {
    u: username,
    iat: nowSec,
    exp: nowSec + ADMIN_SESSION_ABSOLUTE_SEC,
    seen: nowSec,
  })
}

async function readPayload(secret: string, token: string | undefined): Promise<SessionPayload | null> {
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
  const ok = await crypto.subtle.verify('HMAC', key, Uint8Array.from(sig), Uint8Array.from(payloadBytes))
  if (!ok) return null
  let data: Partial<SessionPayload>
  try {
    data = JSON.parse(new TextDecoder().decode(payloadBytes)) as Partial<SessionPayload>
  } catch {
    return null
  }
  if (typeof data.u !== 'string' || typeof data.iat !== 'number' || typeof data.exp !== 'number' || typeof data.seen !== 'number') {
    return null
  }
  return data as SessionPayload
}

export type AdminSessionCheck =
  | { ok: false }
  | { ok: true; username: string; token: string; renewed: boolean }

/** 12시간이 지났거나, 마지막 사용 후 4시간이 지났으면 거절한다. 예전 7일 쿠키도 거절한다. */
export async function readAdminSession(
  secret: string,
  token: string | undefined,
  nowSec = Math.floor(Date.now() / 1000),
): Promise<AdminSessionCheck> {
  const data = await readPayload(secret, token)
  if (!data) return { ok: false }
  if (nowSec >= data.exp || nowSec - data.seen >= ADMIN_SESSION_IDLE_SEC) return { ok: false }
  if (nowSec - data.seen < 60) return { ok: true, username: data.u, token: token!, renewed: false }
  return {
    ok: true,
    username: data.u,
    token: await signPayload(secret, { ...data, seen: nowSec }),
    renewed: true,
  }
}

export async function verifyAdminSessionToken(secret: string, token: string | undefined): Promise<string | null> {
  const session = await readAdminSession(secret, token)
  return session.ok ? session.username : null
}
