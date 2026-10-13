'use client'

import { useEffect, useState } from 'react'
import type { Lang } from '@/lib/i18n'
import { STORED_TRANSLATIONS_ONLY } from '@/lib/translationPolicy'
import {
  makeHunminPassageOverrideKey,
  isSupportedTranslationLang,
  type SupportedTranslationLang,
} from '@/lib/i18n-overrides'
import { usePublicOverridesStore } from '@/hooks/useSiteMessages'
import { HunminPassageText } from './HunminPassageText'
import type { HunminPassage } from '@/data/hunminjeongeumPassages'

/** 코드에 넣은 번역. 없으면 null. 영어 문장을 기계번역기에 넘기지 않는다. */
function getStaticTranslation(passage: HunminPassage, lang: Lang): string | null {
  if (lang === 'ko' || lang === 'en') return null
  const t = passage.translations[lang as keyof typeof passage.translations]
  return typeof t === 'string' && t.trim() ? t : null
}

/** 표시할 텍스트 초기값(SSR-friendly): 오버라이드 → 정적 번역 → 영어 출처 fallback */
function pickInitial(
  passage: HunminPassage,
  lang: Lang,
  overrideValue: string | undefined,
  englishSource: string,
): string {
  if (overrideValue && overrideValue.trim()) return overrideValue
  if (lang === 'en') return englishSource
  return getStaticTranslation(passage, lang) ?? englishSource
}

interface TranslatedPassageTextProps {
  passage: HunminPassage
  lang: Lang
  className?: string
}

/**
 * 사이트 언어가 한국어가 아닐 때 표시되는 추가 번역 줄.
 *
 * 번역은 한국어 원문을 기준으로 작성해 저장한 값을 사용한다.
 * 저장 번역 전용 모드에서는 해당 언어 번역이 없으면 한국어 원문을 표시한다.
 *
 * 우선순위:
 *  1) 해당 언어의 관리자 번역 오버라이드 (`hunminPassage:{number}:description:{lang}`)
 *  2) 코드에 넣은 그 언어 번역
 *  3) 저장 번역 전용 모드에서는 한국어 원문. 기존 모드에서는 영어 문장 전체.
 */
export function TranslatedPassageText({ passage, lang, className }: TranslatedPassageTextProps) {
  const store = usePublicOverridesStore()

  /* 영어 출처(오버라이드 > 기본) — 다른 언어 번역의 source. */
  const enOverrideKey = makeHunminPassageOverrideKey(passage.number, 'en')
  const enOverride = store[enOverrideKey]?.value
  const englishSource = (enOverride && enOverride.trim()) ? enOverride : passage.translations.en

  /* SupportedTranslationLang에 들지 않는 언어(예: de, es)는 오버라이드 키가 없으므로
   * undefined로 안전 처리. */
  const overrideLangCode: SupportedTranslationLang | null = isSupportedTranslationLang(lang)
    ? lang
    : null

  const overrideKey = overrideLangCode
    ? makeHunminPassageOverrideKey(passage.number, overrideLangCode)
    : null
  const overrideValue = overrideKey ? store[overrideKey]?.value : undefined
  const savedTranslation = overrideValue?.trim() ? overrideValue : lang === 'ko' ? passage.korean : passage.translations[lang]
  const storedText = lang === 'ko' || !savedTranslation?.trim() ? passage.korean : savedTranslation

  const [text, setText] = useState<string>(() =>
    pickInitial(passage, lang, overrideValue, englishSource),
  )

  useEffect(() => {
    if (STORED_TRANSLATIONS_ONLY) return
    /* 1) 오버라이드 우선 */
    if (overrideValue && overrideValue.trim()) {
      setText(overrideValue)
      return
    }
    /* 2-en) 영어는 출처 그대로 노출(오버라이드가 위에서 이미 처리됨) */
    if (lang === 'en') {
      setText(englishSource)
      return
    }
    /* 2) 정적 번역(있으면 그대로) */
    const staticTr = getStaticTranslation(passage, lang)
    if (staticTr) {
      setText(staticTr)
      return
    }
    /* 한국어는 source 그대로 노출 (호출 컴포넌트는 lang!=='ko' 일 때만 사용하지만 안전망). */
    if (lang === 'ko') {
      setText(passage.korean)
      return
    }
    /* 코드에 없는 언어는 영어 문장 전체를 보여 준다. 영어 문장을 잘라 기계번역하지 않는다. */
    setText(englishSource)
  }, [passage.number, passage.korean, lang, overrideValue, englishSource, passage])

  return (
    <p className={className} lang={lang}>
      <HunminPassageText text={STORED_TRANSLATIONS_ONLY ? storedText : text} />
    </p>
  )
}
