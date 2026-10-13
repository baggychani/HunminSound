'use client'

import { useEffect, useState } from 'react'
import type { Lang } from '@/lib/i18n'
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
 * 훈민정음 단락은 한국어 풀이에 옛 한국어 표현(축시 등)이 많아 자동 번역 품질이
 * 낮으므로, 한 번 정리된 영어 풀이(`passage.translations.en`)를 **번역의 출처**로
 * 삼는다. 영어 오버라이드가 있으면 그것을 출처로 사용해 stale 갱신이 자연스럽다.
 *
 * 우선순위:
 *  1) 해당 언어의 관리자 번역 오버라이드 (`hunminPassage:{number}:description:{lang}`)
 *  2) 코드에 넣은 그 언어 번역
 *  3) 없으면 영어 문장 전체. 기계번역은 하지 않는다.
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

  const [text, setText] = useState<string>(() =>
    pickInitial(passage, lang, overrideValue, englishSource),
  )

  useEffect(() => {
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
      <HunminPassageText text={text} />
    </p>
  )
}
