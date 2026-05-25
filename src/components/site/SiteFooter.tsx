'use client'

import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
import { getV2Messages } from '@/lib/v2-i18n'

export function SiteFooter() {
  const { lang } = useLang()
  const m = getMessages(lang)
  const v2 = getV2Messages(lang)

  return (
    <footer className="border-t border-white/10 bg-v2-contact py-10 text-white/70">
      <div className="v2-section-inner grid gap-6 sm:grid-cols-3 sm:items-center">
        <div>
          <p className="font-jamo text-lg text-white">{m.siteTitle}</p>
          <p className="mt-1 text-sm">{v2.footerNrf}</p>
          <p className="mt-1 text-xs text-white/50">NRF-2023S1A5A2A21086078</p>
        </div>
        <p className="text-center text-sm sm:justify-self-center">
          서울대학교 · MRI 음성 연구
        </p>
        <div className="flex justify-center sm:justify-end">
          <Link
            href="/admin/login"
            className="text-xs text-white/50 transition hover:text-amber-300"
          >
            {v2.footerAdmin}
          </Link>
        </div>
      </div>
    </footer>
  )
}
