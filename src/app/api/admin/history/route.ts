import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_SESSION_COOKIE, getAdminSessionSecret, verifyAdminSessionToken } from '@/lib/adminSession'
import { readAdminHistory } from '@/lib/cms-storage'

export const runtime = 'nodejs'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  const secret = getAdminSessionSecret()
  const username = await verifyAdminSessionToken(secret, token)
  if (!username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    return NextResponse.json(await readAdminHistory())
  } catch {
    return NextResponse.json([])
  }
}
