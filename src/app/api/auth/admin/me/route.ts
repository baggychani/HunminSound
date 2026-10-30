import { NextResponse } from 'next/server'
import { cmsUser } from '@/lib/cms-api'

export const runtime = 'nodejs'

export async function GET() {
  const username = await cmsUser()
  if (!username) {
    return NextResponse.json({ username: null }, { status: 401 })
  }
  return NextResponse.json({ username })
}
