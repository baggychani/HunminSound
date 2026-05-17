'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'

export function SiteFooter() {
  const { lang } = useLang()
  const m = getMessages(lang)

  return (
    <footer className="border-t border-hanji-border mt-24">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-3 sm:gap-x-4 sm:items-center">
          <span className="shrink-0 text-center font-serif text-sm text-ink-muted sm:justify-self-start sm:text-start">
            세종말소리 · Sejong Speech Sounds
          </span>
          {/* 데스크톱·태블릿만: 관리자 링크 (모바일 숨김) */}
          <div className="hidden sm:flex shrink-0 items-center justify-center">
            <Link
              href="/admin/login"
              className="font-sans text-[11px] text-ink-muted/70 tracking-[0.04em] transition-colors hover:text-gold dark:text-ink-muted/75 dark:hover:text-gold-light"
            >
              {m.admin}
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
