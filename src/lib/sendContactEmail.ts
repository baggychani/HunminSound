import nodemailer from 'nodemailer'

/** 사용자 입력을 이메일 HTML 본문에 넣기 전 escape (HTML/링크 삽입 방지) */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export interface ContactEmailPayload {
  name: string
  replyTo: string
  subject: string
  body: string
  affiliation?: string
  inquiryType?: string
  prefix?: string
  /** 미지정 시 CONTACT_TO(기본 sejong@sejongkorea.org) */
  to?: string
}

export async function sendContactEmail(payload: ContactEmailPayload) {
  const smtpUser = process.env.SMTP_USER?.trim()
  const smtpPass = process.env.SMTP_PASS?.trim()
  if (!smtpUser || !smtpPass) {
    throw new Error('SMTP_NOT_CONFIGURED')
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: { user: smtpUser, pass: smtpPass },
  })

  const to = payload.to ?? process.env.CONTACT_TO ?? 'sejong@sejongkorea.org'
  const prefix = payload.prefix ?? '[세종말소리 문의]'
  const meta = [
    payload.affiliation ? `소속: ${payload.affiliation}` : null,
    payload.inquiryType ? `문의 유형: ${payload.inquiryType}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  const safeName = escapeHtml(payload.name)
  const safeReplyTo = escapeHtml(payload.replyTo)
  const safeAffiliation = payload.affiliation ? escapeHtml(payload.affiliation) : ''
  const safeInquiryType = payload.inquiryType ? escapeHtml(payload.inquiryType) : ''
  const safeBody = escapeHtml(payload.body)

  await transporter.sendMail({
    from: `"세종말소리" <${smtpUser}>`,
    to,
    replyTo: payload.replyTo || undefined,
    subject: `${prefix} ${payload.subject}`,
    text: `보낸 분: ${payload.name}\n답장 메일: ${payload.replyTo}\n${meta ? meta + '\n\n' : ''}${payload.body}`,
    html: `<p><strong>보낸 분:</strong> ${safeName}</p><p><strong>답장 메일:</strong> ${safeReplyTo}</p>${safeAffiliation ? `<p><strong>소속:</strong> ${safeAffiliation}</p>` : ''}${safeInquiryType ? `<p><strong>문의 유형:</strong> ${safeInquiryType}</p>` : ''}<hr/><p style="white-space:pre-wrap">${safeBody}</p>`,
  })
}
