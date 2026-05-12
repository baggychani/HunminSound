'use client'

import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'

interface PageHeaderProps {
  type: 'consonants' | 'vowels'
}

export function PageHeader({ type }: PageHeaderProps) {
  const { lang } = useLang()
  const m = getMessages(lang)

  const isConsonants = type === 'consonants'

  return (
    <div className="pt-16 pb-16 border-b border-hanji-border mb-16">
      <p className="font-sans text-xs text-ink-muted tracking-[0.3em] uppercase mb-4">
        {isConsonants ? 'Korean Consonants' : 'Korean Vowels'}
      </p>
      <h1 className="font-serif text-5xl sm:text-6xl text-ink leading-none mb-4">
        {isConsonants ? m.consonants : m.vowels}
      </h1>
      <p className="font-sans text-sm text-ink-muted max-w-4xl leading-relaxed">
        {isConsonants ? m.consonantsPageDesc : m.vowelsPageDesc}
        <br />
        <span className="text-ink-muted/70">{m.clickToExplore}</span>
      </p>
    </div>
  )
}
