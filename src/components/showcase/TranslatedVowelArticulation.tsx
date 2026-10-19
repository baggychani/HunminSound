'use client'

import type { Lang } from '@/lib/i18n'
import {
  VOWEL_ARTICULATION_KO,
  getVowelArticulationText,
} from '@/lib/vowelArticulation'

/** 코드에 저장된 조음 표기만 보여 준다. 없으면 한국어. */
export function TranslatedVowelArticulation({
  symbol,
  lang,
  className = 'font-sans text-xs text-gold mt-3 tracking-wide normal-case',
}: {
  symbol: string
  lang: Lang
  className?: string
}) {
  const koSource = VOWEL_ARTICULATION_KO[symbol]
  if (!koSource) return null
  return <p className={className}>{getVowelArticulationText(symbol, lang) ?? koSource}</p>
}
