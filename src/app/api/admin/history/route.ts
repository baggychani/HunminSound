import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'
import { ADMIN_SESSION_COOKIE, getAdminSessionSecret, verifyAdminSessionToken } from '@/lib/adminSession'
import type { HistoryEntry } from '@/lib/admin-history'

export const runtime = 'nodejs'

const HISTORY_PATH = path.join(process.cwd(), 'src', 'data', 'admin-history.json')

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  const secret = getAdminSessionSecret()
  const username = await verifyAdminSessionToken(secret, token)
  if (!username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const history = JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8')) as HistoryEntry[]
    return NextResponse.json(history)
  } catch {
    return NextResponse.json([])
  }
}
