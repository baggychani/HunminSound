import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/sendContactEmail'

export const runtime = 'nodejs'

const rateLimit = new Map<string, { count: number; resetAt: number }>()
const MAX_PER_HOUR = 5

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 })
    return true
  }
  if (entry.count >= MAX_PER_HOUR) return false
  entry.count += 1
  return true
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'RATE_LIMIT' }, { status: 429 })
  }

  let body: {
    name?: string
    email?: string
    affiliation?: string
    inquiryType?: string
    message?: string
    website?: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (body.website?.trim()) {
    return NextResponse.json({ ok: true })
  }

  const name = body.name?.trim() ?? ''
  const email = body.email?.trim() ?? ''
  const message = body.message?.trim() ?? ''

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 })
  }
  if (message.length > 500) {
    return NextResponse.json({ error: 'MESSAGE_TOO_LONG' }, { status: 400 })
  }

  try {
    await sendContactEmail({
      name,
      replyTo: email,
      subject: body.inquiryType?.trim() || '일반 문의',
      body: message,
      affiliation: body.affiliation?.trim(),
      inquiryType: body.inquiryType?.trim(),
      prefix: '[세종말소리 공개 문의]',
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact/public]', err)
    const message = err instanceof Error ? err.message : String(err)
    if (message === 'SMTP_NOT_CONFIGURED') {
      return NextResponse.json({ error: 'SMTP_NOT_CONFIGURED' }, { status: 503 })
    }
    return NextResponse.json({ error: 'SEND_FAILED' }, { status: 500 })
  }
}
