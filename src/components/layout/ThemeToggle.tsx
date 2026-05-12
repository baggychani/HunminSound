'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { lang } = useLang()
  const m = getMessages(lang)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-8 w-[200px] max-w-full rounded-md bg-hanji-border/40" aria-hidden />
    )
  }

  const active = theme ?? 'system'

  const btn = (t: 'light' | 'dark' | 'system', label: string) => (
    <button
      type="button"
      onClick={() => setTheme(t)}
      className={`rounded px-2.5 py-1 font-sans text-xs tracking-wide transition-colors ${
        active === t
          ? 'text-ink font-medium'
          : 'text-ink-muted hover:text-ink'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-md border border-hanji-border/90 bg-transparent px-0.5"
      role="group"
      aria-label={m.themeToggleAria}
    >
      {btn('light', m.themeLight)}
      {btn('dark', m.themeDark)}
      {btn('system', m.themeSystem)}
    </div>
  )
}
