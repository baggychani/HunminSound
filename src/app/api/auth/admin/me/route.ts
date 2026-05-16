import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_SESSION_COOKIE, getAdminSessionSecret, verifyAdminSessionToken } from '@/lib/adminSession'

export const runtime = 'nodejs'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  const secret = getAdminSessionSecret()
  const username = await verifyAdminSessionToken(secret, token)
  if (!username) {
    return NextResponse.json({ username: null }, { status: 401 })
  }
  return NextResponse.json({ username })
}
