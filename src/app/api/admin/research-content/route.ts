import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_SESSION_COOKIE, getAdminSessionSecret, verifyAdminSessionToken } from '@/lib/adminSession'
import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'research-content.json')

function readData() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
}

function writeData(data: unknown) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET() {
  try {
    return NextResponse.json(readData())
  } catch {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  const session = await verifyAdminSessionToken(getAdminSessionSecret(), token)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    writeData(body)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 })
  }
}
