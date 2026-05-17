/**
 * 관리자가 편집한 번역 오버라이드 시스템
 *
 * 구조:
 *  - 오버라이드 저장소: src/data/i18n-overrides.json
 *  - 키 형식:  "{type}:{id}:description:{lang}"
 *             예)  "consonant:b:description:en"
 *                 "vowel:a:description:fr"
 *  - 각 오버라이드에는 저장 시점의 한국어 원본(sourceSnapshot)을 함께 저장
 *  - 이후 원본 한국어가 바뀌었을 때 → stale 상태로 감지
 */

export type SupportedTranslationLang = 'en' | 'zh' | 'ja' | 'fr' | 'hi' | 'vi' | 'ru' | 'ar'

export const TRANSLATION_LANGS: { code: SupportedTranslationLang; name: string; script: string }[] = [
  { code: 'en', name: 'English',      script: 'Latin'    },
  { code: 'zh', name: '中文',          script: 'Hanzi'    },
  { code: 'ja', name: '日本語',         script: 'Kana'     },
  { code: 'fr', name: 'Français',     script: 'Latin'    },
  { code: 'hi', name: 'हिन्दी',        script: 'Devanagari'},
  { code: 'vi', name: 'Tiếng Việt',   script: 'Latin'    },
  { code: 'ru', name: 'Русский',      script: 'Cyrillic' },
  { code: 'ar', name: 'العربية',      script: 'Arabic'   },
]

export interface TranslationOverride {
  /** 편집된 번역 텍스트 */
  value: string
  /** 저장 시점의 한국어 원본 — stale 감지에 사용 */
  sourceSnapshot: string
  /** 원본이 바뀌었지만 "수정 불필요" 확인 처리된 경우 true */
  staleDismissed: boolean
  updatedAt: string
}

/** 저장소 전체: key → override */
export type OverridesStore = Record<string, TranslationOverride>

/**
 * 오버라이드 대상 콘텐츠 타입.
 * - consonant / vowel : 자·모음 차트 항목 (단일 description 필드)
 * - hunminPassage     : 훈민정음 해례본 한 단락(id = 일련번호, 예: '52')
 */
export type OverrideContentType = 'consonant' | 'vowel' | 'hunminPassage'

// ── 키 헬퍼 ──────────────────────────────────────────────────────────────────

export function makeOverrideKey(
  type: OverrideContentType,
  id: string,
  lang: SupportedTranslationLang,
): string {
  return `${type}:${id}:description:${lang}`
}

/** 훈민정음 단락 전용 키 — 다른 곳에서 import 편의를 위해 별도 헬퍼 제공. */
export function makeHunminPassageOverrideKey(
  number: string,
  lang: SupportedTranslationLang,
): string {
  return makeOverrideKey('hunminPassage', number, lang)
}

// ── Stale 판정 ────────────────────────────────────────────────────────────────

/**
 * 원본 한국어가 오버라이드 저장 이후 변경된 경우 true.
 * staleDismissed == true 이면 이미 확인한 것이므로 stale 표시 안 함.
 */
export function isStale(override: TranslationOverride, currentKoreanSource: string): boolean {
  if (override.staleDismissed) return false
  return override.sourceSnapshot !== currentKoreanSource
}
