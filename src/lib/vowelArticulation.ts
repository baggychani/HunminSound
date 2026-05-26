import type { Lang } from '@/lib/i18n'
import { VOWEL_ARTICULATION_BY_LANG } from '@/data/vowelArticulationByLang'

/**
 * 단모음 상세 패널 보조 줄.
 * KO: 전후 → 원순성 → 높이 (4분류: 고·중고·중저·저).
 * EN: Height → Backness → Roundedness (IPA 관례).
 */
export const VOWEL_ARTICULATION_KO: Record<string, string> = {
  '·': '반원순 후설 저모음 [ʌ], [ɔ]',
  'ㅏ': '평순 중설 저모음 [a]',
  'ㅓ': '평순 중설 중모음 [ʌ]',
  'ㅗ': '원순 후설 중고모음 [o]',
  'ㅜ': '원순 후설 고모음 [u]',
  'ㅡ': '평순 중설 고모음 [ɯ]',
  'ㅣ': '평순 전설 고모음 [i]',
  'ㅔ': '평순 전설 중모음 [e]',
  'ㅐ': '평순 전설 저모음 [ɛ]',
  'ㅟ': '원순 전설 고모음 [y]',
  'ㅚ': '원순 전설 중모음 [ø]',
}

/** IPA 용어 관례: height – backness – rounding */
export const VOWEL_ARTICULATION_EN: Record<string, string> = {
  '·': 'low back semi-rounded vowel [ʌ], [ɔ]',
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
