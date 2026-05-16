import { NextResponse } from 'next/server'
import { findAdmin, getAdminAccounts } from '@/lib/adminAccounts'
import { ADMIN_SESSION_COOKIE, createAdminSessionToken, getAdminSessionSecret } from '@/lib/adminSession'

export async function POST(request: Request) {
  const secret = getAdminSessionSecret()
  if (!secret || secret.length < 16 || getAdminAccounts().length === 0) {
    return NextResponse.json({ ok: false, message: 'not_configured' }, { status: 503 })
  }

  let body: { username?: string; password?: string }
  try {
    body = (await request.json()) as { username?: string; password?: string }
  } catch {
    return NextResponse.json({ ok: false, message: 'invalid_json' }, { status: 400 })
  }

  const username = typeof body.username === 'string' ? body.username : ''
  const password = typeof body.password === 'string' ? body.password : ''

  if (!username.trim() || !password) {
    return NextResponse.json({ ok: false, message: 'missing_fields' }, { status: 400 })
  }

  const account = findAdmin(username, password)
  if (!account) {
    return NextResponse.json({ ok: false, message: 'invalid_credentials' }, { status: 401 })
  }

  const token = await createAdminSessionToken(secret, account.username)

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
