'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import { getV2Messages } from '@/lib/v2-i18n'

const INQUIRY_TYPES = [
  'contactTypeCollab',
  'contactTypeData',
  'contactTypeSeminar',
  'contactTypeGraduate',
  'contactTypeGeneral',
] as const

export function HomeContactSection() {
  const { lang } = useLang()
  const v2 = getV2Messages(lang)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorDetail, setErrorDetail] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    affiliation: '',
    inquiryType: '',
    message: '',
    website: '',
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorDetail(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        if (data.error === 'SMTP_NOT_CONFIGURED') {
          setErrorDetail('SMTP_NOT_CONFIGURED')
        } else if (data.error === 'RATE_LIMIT') {
          setErrorDetail('RATE_LIMIT')
        }
        throw new Error(data.error ?? 'failed')
      }
      setStatus('success')
      setForm({ name: '', email: '', affiliation: '', inquiryType: '', message: '', website: '' })
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'mt-1 w-full rounded-sm border border-hanji-border/70 bg-hanji/90 px-3 py-2.5 font-sans text-sm text-ink outline-none transition-colors focus:border-gold/60 dark:bg-hanji/50'

  return (
    <div id="contact" className="w-full">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <p className="font-sans text-xs tracking-[0.25em] text-gold uppercase">{v2.contactLabel}</p>
          <h2 className="mt-3 font-serif text-2xl text-ink sm:text-[1.65rem]">{v2.contactTitle}</h2>
          <p className="mt-3 max-w-md font-serif text-sm leading-relaxed text-ink-soft">{v2.contactDesc}</p>

          <dl className="mt-8 space-y-4 font-sans text-sm">
            <div>
              <dt className="text-xs text-ink-muted">{v2.contactEmail}</dt>
              <dd className="mt-1 text-ink">
                <a href="mailto:sejong@sejongkorea.org" className="text-ink-accent hover:text-gold">
                  sejong@sejongkorea.org
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-muted">{v2.contactPhone}</dt>
              <dd className="mt-1 text-ink">+82-2-969-8851</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-muted">{v2.contactAddress}</dt>
              <dd className="mt-1 text-ink-soft">서울 동대문구 회기로 56</dd>
            </div>
          </dl>

          <div className="mt-8 w-full max-w-[22rem] rounded-sm border border-hanji-border/60 bg-white px-5 py-4 sm:max-w-[28rem] sm:px-6 sm:py-5">
            <Image
              src="/images/sejongorg.png"
              alt="세종대왕기념사업회"
              width={485}
              height={512}
              className="h-auto w-full"
              sizes="(max-width: 640px) 352px, 448px"
            />
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-sm border border-hanji-border/60 bg-hanji/75 p-6 backdrop-blur-md sm:p-8 dark:bg-hanji/65"
        >
          <h3 className="font-serif text-lg text-ink">{v2.contactFormTitle}</h3>
          <p className="mt-2 font-sans text-xs text-ink-muted">{v2.contactFormDesc}</p>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="font-sans text-xs text-ink-muted">{v2.contactName} *</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="font-sans text-xs text-ink-muted">{v2.contactEmailField} *</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="font-sans text-xs text-ink-muted">{v2.contactAffiliation}</span>
              <input
                value={form.affiliation}
                onChange={(e) => setForm((f) => ({ ...f, affiliation: e.target.value }))}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="font-sans text-xs text-ink-muted">{v2.contactType}</span>
              <select
                value={form.inquiryType}
                onChange={(e) => setForm((f) => ({ ...f, inquiryType: e.target.value }))}
                className={inputClass}
              >
                <option value="">{v2.contactTypePlaceholder}</option>
                {INQUIRY_TYPES.map((key) => (
                  <option key={key} value={v2[key]}>
                    {v2[key]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-sans text-xs text-ink-muted">{v2.contactMessage} *</span>
              <textarea
                required
                rows={4}
                maxLength={500}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className={`${inputClass} resize-y min-h-[6rem]`}
              />
              <span className="mt-1 block text-end font-sans text-[10px] text-ink-muted">
                {v2.contactMessageLimit}
              </span>
            </label>
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="mt-6 w-full rounded-sm border border-gold/40 bg-gold/10 px-4 py-3 font-sans text-sm text-gold transition-colors hover:bg-gold/20 disabled:opacity-60"
          >
            {status === 'sending' ? v2.contactSending : v2.contactSend}
          </button>

          {status === 'success' ? (
            <p className="mt-4 text-center font-sans text-sm text-ink-accent">{v2.contactSuccess}</p>
          ) : null}
          {status === 'error' ? (
            <p className="mt-4 text-center font-sans text-sm text-red-700 dark:text-red-400">
              {errorDetail === 'SMTP_NOT_CONFIGURED'
                ? '메일 서버(SMTP) 설정이 없습니다. 관리자에게 문의해 주세요.'
                : errorDetail === 'RATE_LIMIT'
                  ? '잠시 후 다시 시도해 주세요. (시간당 전송 한도)'
                  : v2.contactError}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  )
}
