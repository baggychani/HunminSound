import nodemailer from 'nodemailer'

export interface ContactEmailPayload {
  name: string
  replyTo: string
  subject: string
  body: string
  affiliation?: string
  inquiryType?: string
  prefix?: string
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

  const to = process.env.CONTACT_TO ?? 'baggychani@gmail.com'
  const prefix = payload.prefix ?? '[세종말소리 문의]'
  const meta = [
    payload.affiliation ? `소속: ${payload.affiliation}` : null,
    payload.inquiryType ? `문의 유형: ${payload.inquiryType}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  await transporter.sendMail({
    from: `"세종말소리" <${smtpUser}>`,
    to,
    replyTo: payload.replyTo || undefined,
    subject: `${prefix} ${payload.subject}`,
    text: `보낸 분: ${payload.name}\n답장 메일: ${payload.replyTo}\n${meta ? meta + '\n\n' : ''}${payload.body}`,
    html: `<p><strong>보낸 분:</strong> ${payload.name}</p><p><strong>답장 메일:</strong> ${payload.replyTo}</p>${payload.affiliation ? `<p><strong>소속:</strong> ${payload.affiliation}</p>` : ''}${payload.inquiryType ? `<p><strong>문의 유형:</strong> ${payload.inquiryType}</p>` : ''}<hr/><p style="white-space:pre-wrap">${payload.body}</p>`,
  })
}
