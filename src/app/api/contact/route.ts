import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/sendContactEmail'
import { checkPublicRateLimit, getClientIp } from '@/lib/rateLimit'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!checkPublicRateLimit('contact', ip, 5, 60 * 60 * 1000, 200)) {
    return NextResponse.json({ error: 'RATE_LIMIT' }, { status: 429 })
  }

  let body: {
    name?: string
    email?: string
    affiliation?: string
    inquiryType?: string
    message?: string
    website?: string
    consent?: boolean
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
  const subject = body.inquiryType?.trim() ?? ''
  const affiliation = body.affiliation?.trim() ?? ''

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'INVALID_EMAIL' }, { status: 400 })
  }
  if (name.length > 100 || email.length > 254 || subject.length > 200 || affiliation.length > 200) {
    return NextResponse.json({ error: 'FIELD_TOO_LONG' }, { status: 400 })
  }
  // 개인정보 수집·이용 동의 없이는 받지 않는다(/privacy 참고)
  if (body.consent !== true) {
    return NextResponse.json({ error: 'CONSENT_REQUIRED' }, { status: 400 })
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
