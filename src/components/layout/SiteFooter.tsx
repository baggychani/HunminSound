'use client'

import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

export function SiteFooter() {
  const { lang } = useLang()
  const m = getMessages(lang)

  return (
    <footer className="border-t border-hanji-border mt-24">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-6 gap-y-2">
            <span className="font-serif text-sm text-ink-muted shrink-0">
              세종말소리 · Sejong Speech Sounds
            </span>
            <span className="font-sans text-xs text-ink-muted tracking-wide">
              {m.footerRight}
            </span>
          </div>
          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  )
}
