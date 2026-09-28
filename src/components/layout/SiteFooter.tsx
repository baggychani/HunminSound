'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { useLang } from '@/contexts/LanguageContext'
import { getPrivacyMessages } from '@/lib/privacy-i18n'

export function SiteFooter() {
  const { lang } = useLang()
  const pm = getPrivacyMessages(lang)

  return (
    <footer className="border-t border-hanji-border mt-12">
      <div className="site-container py-8">
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 sm:gap-x-4 sm:items-center">
          <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:items-baseline sm:gap-5 sm:justify-self-start">
            <span className="shrink-0 font-serif text-sm text-ink-muted">세종말소리 · Sejong Speech Sounds</span>
            {/* 개인정보 처리방침은 다른 링크와 구분되게 굵게(개인정보 보호법 시행령 제31조) */}
            <Link
              href="/privacy"
              className="font-sans text-[12px] font-bold text-ink-soft transition-colors hover:text-gold"
            >
              {pm.policyLink}
            </Link>
          </div>
          <div className="flex shrink-0 justify-center sm:justify-self-end">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  )
}
