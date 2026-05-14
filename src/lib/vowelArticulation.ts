import type { Lang } from '@/lib/i18n'
import { VOWEL_ARTICULATION_BY_LANG } from '@/data/vowelArticulationByLang'

/**
 * 단모음 상세 패널 보조 줄.
 * KO: 전후 → 원순성 → 높이 (4분류: 고·중고·중저·저).
 * EN: Height → Backness → Roundedness (IPA 관례).
 */
export const VOWEL_ARTICULATION_KO: Record<string, string> = {
  'ㅏ': '후설 평순 저모음 [a]',
  'ㅓ': '후설 평순 중저모음 [ʌ]',
  'ㅗ': '후설 원순 중고모음 [o]',
  'ㅜ': '후설 원순 고모음 [u]',
  'ㅡ': '후설 평순 고모음 [ɯ]',
  'ㅣ': '전설 평순 고모음 [i]',
  'ㅔ': '전설 평순 중고모음 [e]',
  'ㅐ': '전설 평순 중저모음 [ɛ]',
  'ㅟ': '전설 원순 고모음 [y]',
  'ㅚ': '전설 원순 중고모음 [ø]',
}

/** IPA 용어 관례: height – backness – rounding */
export const VOWEL_ARTICULATION_EN: Record<string, string> = {
  'ㅏ': 'low back unrounded vowel [a]',
  'ㅓ': 'open-mid back unrounded vowel [ʌ]',
  'ㅗ': 'close-mid back rounded vowel [o]',
  'ㅜ': 'high back rounded vowel [u]',
  'ㅡ': 'high back unrounded vowel [ɯ]',
  'ㅣ': 'high front unrounded vowel [i]',
  'ㅔ': 'close-mid front unrounded vowel [e]',
  'ㅐ': 'open-mid front unrounded vowel [ɛ]',
  'ㅟ': 'high front rounded vowel [y]',
  'ㅚ': 'close-mid front rounded vowel [ø]',
}

/** UI 언어에 맞는 보조 문구 (사전 번역优先, 없으면 undefined) */
export function getVowelArticulationText(
  symbol: string,
  lang: Lang,
): string | undefined {
  if (lang === 'ko') return VOWEL_ARTICULATION_KO[symbol]
  if (lang === 'en') return VOWEL_ARTICULATION_EN[symbol]
  return VOWEL_ARTICULATION_BY_LANG[lang]?.[symbol]
}
