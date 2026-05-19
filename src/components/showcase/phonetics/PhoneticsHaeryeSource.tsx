'use client'

import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'

type PhoneticsHaeryeSourceProps = {
  kind: 'consonants' | 'vowels'
}

/** 훈민정음 해례본 차트 보기 — 차트 하단 출처 */
export function PhoneticsHaeryeSource({ kind }: PhoneticsHaeryeSourceProps) {
  const { lang } = useLang()
  const m = getMessages(lang)
  const text = kind === 'consonants' ? m.hunminConsonantChartSource : m.hunminVowelChartSource

  return (
    <footer className="mt-12 border-t border-hanji-border/60 pt-6 sm:mt-14 sm:pt-8">
      <p className="break-keep font-sans text-[12px] leading-relaxed text-ink-muted [overflow-wrap:break-word] sm:text-[13px]">
        {text}
      </p>
    </footer>
  )
}
