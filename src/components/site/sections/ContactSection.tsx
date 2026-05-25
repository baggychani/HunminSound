'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { getV2Messages } from '@/lib/v2-i18n'

const INQUIRY_TYPES = [
  'contactTypeCollab',
  'contactTypeData',
  'contactTypeSeminar',
  'contactTypeGraduate',
  'contactTypeGeneral',
] as const

export function ContactSection() {
  const { lang } = useLang()
  const v2 = getV2Messages(lang)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
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
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('success')
      setForm({ name: '', email: '', affiliation: '', inquiryType: '', message: '', website: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" data-snap className="relative bg-v2-contact py-20 text-white">
      <motion.div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-amber-600/10 to-transparent" />
      <div className="v2-section-inner relative grid gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">{v2.contactLabel}</p>
          <h2 className="v2-title mt-4 text-white">{v2.contactTitle}</h2>
          <p className="v2-body mt-4 max-w-md text-white/70">{v2.contactDesc}</p>

          <dl className="mt-8 space-y-3 text-sm">
            <div>
              <dt className="text-white/50">{v2.contactEmail}</dt>
              <dd className="mt-0.5 text-sm text-amber-300">hunminjeongeum.lab@snu.ac.kr</dd>
            </div>
            <div>
              <dt className="text-white/50">{v2.contactPhone}</dt>
              <dd className="mt-0.5 text-sm">+82-2-880-6150</dd>
            </div>
            <div>
              <dt className="text-white/50">{v2.contactAddress}</dt>
              <dd className="mt-0.5 text-sm text-white/80">서울특별시 관악구 관악로 1 (08826)</dd>
            </div>
          </dl>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          onSubmit={onSubmit}
          className="rounded-xl bg-white/5 p-5 backdrop-blur sm:p-6"
        >
          <h3 className="font-serif text-lg font-semibold">{v2.contactFormTitle}</h3>
          <p className="mt-2 text-sm text-white/60">{v2.contactFormDesc}</p>

          <input type="text" name="website" value={form.website} onChange={() => {}} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-1">
              <span className="text-xs text-white/60">{v2.contactName} *</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-amber-400"
              />
            </label>
            <label className="block sm:col-span-1">
              <span className="text-xs text-white/60">{v2.contactEmailField} *</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-amber-400"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs text-white/60">{v2.contactAffiliation}</span>
              <input
                value={form.affiliation}
                onChange={(e) => setForm((f) => ({ ...f, affiliation: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-amber-400"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs text-white/60">{v2.contactType}</span>
              <select
                value={form.inquiryType}
                onChange={(e) => setForm((f) => ({ ...f, inquiryType: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-amber-400"
              >
                <option value="" className="bg-v2-contact">{v2.contactTypePlaceholder}</option>
                {INQUIRY_TYPES.map((key) => (
                  <option key={key} value={v2[key]} className="bg-v2-contact">
                    {v2[key]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs text-white/60">{v2.contactMessage} *</span>
              <textarea
                required
                maxLength={500}
                rows={5}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="mt-1 w-full resize-none rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-amber-400"
              />
              <span className="mt-1 block text-end text-[10px] text-white/40">{v2.contactMessageLimit}</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="mt-6 w-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 py-3.5 text-sm font-semibold text-v2-hero shadow-lg v2-cta-glow transition hover:from-amber-400 hover:to-amber-300 disabled:opacity-60"
          >
            {status === 'sending' ? v2.contactSending : v2.contactSend}
          </button>

          {status === 'success' && <p className="mt-4 text-center text-sm text-emerald-400">{v2.contactSuccess}</p>}
          {status === 'error' && <p className="mt-4 text-center text-sm text-rose-400">{v2.contactError}</p>}
        </motion.form>
      </div>
    </section>
  )
}
