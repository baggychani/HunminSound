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
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-3 sm:gap-x-4 sm:items-center">
          <span className="shrink-0 text-center font-serif text-sm text-ink-muted sm:justify-self-start sm:text-start">
            세종말소리 · Sejong Speech Sounds
          </span>
          <p className="max-w-xl justify-self-center px-2 text-center font-sans text-xs text-ink-muted tracking-wide sm:min-w-0">
            {m.footerRight}
          </p>
          <div className="flex shrink-0 justify-center sm:justify-self-end">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  )
}
