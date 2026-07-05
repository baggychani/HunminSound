'use client'

import Image from 'next/image'
import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { useSiteMessages } from '@/hooks/useSiteMessages'
import { MailIcon, PhoneIcon, LocationIcon } from '@/components/ui/ContactIcons'

/** 한국어 협력 안내 — '연구자·' 뒤에서 의도적으로 줄바꿈 */
function formatContactDesc(desc: string, lang: string): ReactNode {
  if (lang !== 'ko') return desc
  const marker = '연구자·'
  const idx = desc.indexOf(marker)
  if (idx === -1) return desc
  return (
    <>
      {desc.slice(0, idx + marker.length)}
      <br />
      {desc.slice(idx + marker.length)}
    </>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 + i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
}

/** 연락처 항목 — 아이콘 + 라벨 + 값 */
function ContactItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="group flex items-start gap-3.5 rounded-sm border border-hanji-border/60 bg-hanji-card/70 px-4 py-3.5 transition-colors hover:border-gold/40">
      <span
        aria-hidden
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/[0.07] text-gold transition-colors group-hover:bg-gold/[0.14]"
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-medium text-ink-muted">{label}</span>
        <span className="mt-1 block font-medium text-ink">{children}</span>
      </span>
    </div>
  )
}

const INQUIRY_TYPES = [
  'contactTypeCollab',
  'contactTypeData',
  'contactTypeSeminar',
  'contactTypeGraduate',
  'contactTypeGeneral',
] as const

export function HomeContactSection() {
  const { lang } = useLang()
  const { v2 } = useSiteMessages()
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
    'mt-1 w-full rounded-sm border border-hanji-border/70 bg-hanji/90 px-3 py-2.5 font-sans text-sm text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-gold/70 focus:shadow-[0_0_0_3px_rgb(var(--gold-rgb)/0.12)] dark:bg-hanji/50'

  return (
    <div id="contact" className="relative w-full">
      {/* 거대 배경 한자 — 問(물을 문) 워터마크 */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-8 hidden select-none font-serif leading-none text-ink/[0.03] dark:text-ink/[0.045] lg:block"
        style={{ fontSize: 'clamp(8rem, 16vw, 14rem)' }}
        lang="zh-Hant"
      >
        問
      </span>

      <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-12">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
        >
          <div className="flex items-center gap-3">
            <span className="hidden h-px w-9 bg-gold/50 lg:block" aria-hidden />
            <p className="font-sans text-xs font-medium tracking-[0.25em] text-gold uppercase">{v2.contactLabel}</p>
          </div>
          <h2 className="mt-3 font-serif text-2xl font-bold text-ink sm:text-[1.65rem]">{v2.contactTitle}</h2>
          <p className="mt-3 max-w-md font-serif text-sm font-medium leading-relaxed text-ink-soft">
            {formatContactDesc(v2.contactDesc, lang)}
          </p>

          <div className="mt-8 space-y-3 font-sans text-sm">
            <ContactItem icon={<MailIcon />} label={v2.contactEmail}>
              <a href="mailto:sejong@sejongkorea.org" className="text-ink-accent hover:text-gold">
                sejong@sejongkorea.org
              </a>
            </ContactItem>
            <ContactItem icon={<PhoneIcon />} label={v2.contactPhone}>
              +82-2-969-8851
            </ContactItem>
            <ContactItem icon={<LocationIcon />} label={v2.contactAddress}>
              <span className="text-ink-soft">서울 동대문구 회기로 56</span>
            </ContactItem>
          </div>

          <div className="mt-8 w-full max-w-[20rem] rounded-sm border border-hanji-border/60 bg-white px-5 py-4 sm:max-w-[25rem] sm:px-6 sm:py-5">
            <Image
              src="/images/sejongorg.png"
              alt="세종대왕기념사업회"
              width={485}
              height={512}
              className="h-auto w-full"
              sizes="(max-width: 640px) 320px, 400px"
            />
          </div>
        </motion.div>

        <motion.form
          custom={1}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          onSubmit={onSubmit}
          className="corner-brackets relative rounded-sm border border-hanji-border/60 bg-hanji/75 p-6 backdrop-blur-md sm:p-8 dark:bg-hanji/65"
        >
          <h3 className="font-serif text-lg font-bold text-ink">{v2.contactFormTitle}</h3>
          <p className="mt-2 font-sans text-xs text-ink-muted">{v2.contactFormDesc}</p>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="font-sans text-xs font-medium text-ink-muted">{v2.contactName} *</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="font-sans text-xs font-medium text-ink-muted">{v2.contactEmailField} *</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="font-sans text-xs font-medium text-ink-muted">{v2.contactAffiliation}</span>
              <input
                value={form.affiliation}
                onChange={(e) => setForm((f) => ({ ...f, affiliation: e.target.value }))}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="font-sans text-xs font-medium text-ink-muted">{v2.contactType}</span>
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
              <span className="font-sans text-xs font-medium text-ink-muted">{v2.contactMessage} *</span>
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
            className="group relative mt-6 w-full overflow-hidden rounded-sm border border-gold/50 bg-gradient-to-b from-gold/15 to-gold/[0.07] px-4 py-3 font-sans text-sm font-medium text-gold shadow-[inset_0_1px_0_rgb(255_255_255/0.25)] transition-all hover:border-gold/70 hover:from-gold/25 hover:to-gold/10 hover:shadow-[0_2px_14px_rgb(var(--gold-rgb)/0.2)] disabled:opacity-60 dark:shadow-none"
          >
            <span className="sheen-sweep pointer-events-none absolute inset-0 overflow-hidden" aria-hidden />
            <span className="relative inline-flex items-center gap-2">
              {status === 'sending' ? v2.contactSending : v2.contactSend}
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </button>

          {status === 'success' ? (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center font-sans text-sm text-ink-accent"
            >
              {v2.contactSuccess}
            </motion.p>
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
        </motion.form>
      </div>
    </div>
  )
}
