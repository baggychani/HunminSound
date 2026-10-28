'use client'

import type { Lang } from '@/lib/i18n'
import {
  makeHunminPassageOverrideKey,
  isSupportedTranslationLang,
  type SupportedTranslationLang,
} from '@/lib/i18n-overrides'
import { usePublicOverridesStore } from '@/hooks/useSiteMessages'
import { HunminPassageText } from './HunminPassageText'
import type { HunminPassage } from '@/data/hunminjeongeumPassages'

interface TranslatedPassageTextProps {
  passage: HunminPassage
  lang: Lang
  className?: string
}

/**
 * 사이트 언어가 한국어가 아닐 때 표시되는 추가 번역 줄.
 * 관리자 저장본, 그다음 코드에 넣은 번역을 쓴다. 없으면 한국어 원문.
 */
export function TranslatedPassageText({ passage, lang, className }: TranslatedPassageTextProps) {
  const store = usePublicOverridesStore()
  const korean = store[`hunminPassage:${passage.number}:description:ko`]?.value ?? passage.korean
  const overrideLangCode: SupportedTranslationLang | null = isSupportedTranslationLang(lang)
    ? lang
    : null
  const overrideKey = overrideLangCode
    ? makeHunminPassageOverrideKey(passage.number, overrideLangCode)
    : null
  const overrideValue = overrideKey ? store[overrideKey]?.value : undefined
  const savedTranslation = overrideValue?.trim()
    ? overrideValue
    : lang === 'ko'
      ? korean
      : passage.translations[lang]
  const text = lang === 'ko' || !savedTranslation?.trim() ? korean : savedTranslation

  return (
    <p className={className} lang={lang}>
      <HunminPassageText text={text} />
    </p>
  )
}
