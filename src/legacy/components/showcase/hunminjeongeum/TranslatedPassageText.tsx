'use client'

import { useEffect, useState } from 'react'
import type { Lang } from '@/lib/i18n'
import {
  MT_LS_PREFIX,
  buildMtKey,
  getBundledMachineTranslation,
} from '@/lib/mtCache'
import { makeHunminPassageOverrideKey, type SupportedTranslationLang } from '@/lib/i18n-overrides'
import { useOverridesStore } from '@/lib/overrides-store'
import { HunminPassageText } from './HunminPassageText'
import type { HunminPassage } from '@/data/hunminjeongeumPassages'

function readLs(key: string): string | undefined {
  if (typeof window === 'undefined') return undefined
  try {
    const v = window.localStorage.getItem(MT_LS_PREFIX + key)
    return v && v.trim() ? v : undefined
  } catch {
    return undefined
  }
}

function writeLs(key: string, value: string) {
  try {
    window.localStorage.setItem(MT_LS_PREFIX + key, value)
  } catch {
    /* 비공개 모드 등 */
  }
}

/** passage 데이터에 있는 정적 번역(en은 출처이므로 별도 처리) */
function getStaticTranslation(passage: HunminPassage, lang: Lang): string | null {
  if (lang === 'ko' || lang === 'en' || lang === 'de' || lang === 'es') return null
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
 *  2) 데이터 파일에 박힌 정적 번역(en 외 일부 언어)
 *  3) MT 캐시(번들 + localStorage), 키는 "영어 출처 + 영어 source-prefix"로 격리
 *  4) `/api/translate` 자동 번역 호출 (source = 'en', text = 영어 출처)
 */
export function TranslatedPassageText({ passage, lang, className }: TranslatedPassageTextProps) {
  const store = useOverridesStore()

  /* 영어 출처(오버라이드 > 기본) — 다른 언어 번역의 source. */
  const enOverrideKey = makeHunminPassageOverrideKey(passage.number, 'en')
  const enOverride = store[enOverrideKey]?.value
  const englishSource = (enOverride && enOverride.trim()) ? enOverride : passage.translations.en

  /* SupportedTranslationLang에 들지 않는 언어(예: de, es)는 오버라이드 키가 없으므로
   * undefined로 안전 처리. */
  const overrideLangCode: SupportedTranslationLang | null =
    (['en', 'zh', 'ja', 'fr', 'hi', 'vi', 'ru', 'ar'] as const).includes(
      lang as SupportedTranslationLang,
    )
      ? (lang as SupportedTranslationLang)
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
    /* 3·4) 자동 번역 — 영어 출처를 source로 mt-cache 키 생성, 없으면 API 호출.
     *      itemId 접두에 ':en' 을 붙여 한국어 source 시절 캐시와 키가 충돌하지 않도록. */
    const itemId = `hunminPassage:${passage.number}:en`
    const key = buildMtKey(itemId, lang, englishSource)
    const bundled = getBundledMachineTranslation(key)
    const ls = readLs(key)
    if (bundled) {
      setText(bundled)
      return
    }
    if (ls) {
      setText(ls)
      return
    }
    /* 번역 도착 전 깜빡임 방지 — 일단 영어 출처를 임시 노출. */
    setText(englishSource)

    const ac = new AbortController()
    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: englishSource,
        source: 'en',
        target: lang,
        itemId,
      }),
      signal: ac.signal,
    })
      .then((r) => r.json())
      .then((data: { translated?: string | null }) => {
        if (typeof data.translated === 'string' && data.translated.trim()) {
          setText(data.translated)
          writeLs(key, data.translated)
        }
      })
      .catch(() => {})

    return () => ac.abort()
  }, [passage.number, passage.korean, lang, overrideValue, englishSource, passage])

  return (
    <p className={className} lang={lang}>
      <HunminPassageText text={text} />
    </p>
  )
}
