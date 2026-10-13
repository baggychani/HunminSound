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

/** 영어 보조 줄과 같은 높이–전후–원순 순서. 본문 설명의 중설 분류와 별개로, 이 한 줄의 기존 영어 표를 따른다. */
const VOWEL_ARTICULATION_TR: Record<string, string> = {
  '·': 'art açık yarı yuvarlak ünlü [ʌ], [ɔ]',
  'ㅏ': 'art açık düz ünlü [a]',
  'ㅓ': 'art yarı açık düz ünlü [ʌ]',
  'ㅗ': 'art yarı kapalı yuvarlak ünlü [o]',
  'ㅜ': 'art kapalı yuvarlak ünlü [u]',
  'ㅡ': 'art kapalı düz ünlü [ɯ]',
  'ㅣ': 'ön kapalı düz ünlü [i]',
  'ㅔ': 'ön yarı kapalı düz ünlü [e]',
  'ㅐ': 'ön yarı açık düz ünlü [ɛ]',
  'ㅟ': 'ön kapalı yuvarlak ünlü [y]',
  'ㅚ': 'ön yarı kapalı yuvarlak ünlü [ø]',
}

const VOWEL_ARTICULATION_ID: Record<string, string> = {
  '·': 'vokal belakang terbuka semi-bundar [ʌ], [ɔ]',
  'ㅏ': 'vokal belakang terbuka tak bundar [a]',
  'ㅓ': 'vokal belakang semi-terbuka tak bundar [ʌ]',
  'ㅗ': 'vokal belakang semi-tertutup bundar [o]',
  'ㅜ': 'vokal belakang tertutup bundar [u]',
  'ㅡ': 'vokal belakang tertutup tak bundar [ɯ]',
  'ㅣ': 'vokal depan tertutup tak bundar [i]',
  'ㅔ': 'vokal depan semi-tertutup tak bundar [e]',
  'ㅐ': 'vokal depan semi-terbuka tak bundar [ɛ]',
  'ㅟ': 'vokal depan tertutup bundar [y]',
  'ㅚ': 'vokal depan semi-tertutup bundar [ø]',
}

const VOWEL_ARTICULATION_TH: Record<string, string> = {
  '·': 'สระหลังต่ำกึ่งห่อปาก [ʌ], [ɔ]',
  'ㅏ': 'สระหลังต่ำไม่ห่อปาก [a]',
  'ㅓ': 'สระหลังกึ่งต่ำไม่ห่อปาก [ʌ]',
  'ㅗ': 'สระหลังกึ่งสูงห่อปาก [o]',
  'ㅜ': 'สระหลังสูงห่อปาก [u]',
  'ㅡ': 'สระหลังสูงไม่ห่อปาก [ɯ]',
  'ㅣ': 'สระหน้าสูงไม่ห่อปาก [i]',
  'ㅔ': 'สระหน้ากึ่งสูงไม่ห่อปาก [e]',
  'ㅐ': 'สระหน้ากึ่งต่ำไม่ห่อปาก [ɛ]',
  'ㅟ': 'สระหน้าสูงห่อปาก [y]',
  'ㅚ': 'สระหน้ากึ่งสูงห่อปาก [ø]',
}

/** UI 언어에 맞는 보조 문구 (사전 번역优先, 없으면 undefined) */
export function getVowelArticulationText(
  symbol: string,
  lang: Lang,
): string | undefined {
  if (lang === 'ko') return VOWEL_ARTICULATION_KO[symbol]
  if (lang === 'en') return VOWEL_ARTICULATION_EN[symbol]
  if (lang === 'tr') return VOWEL_ARTICULATION_TR[symbol]
  if (lang === 'id') return VOWEL_ARTICULATION_ID[symbol]
  if (lang === 'th') return VOWEL_ARTICULATION_TH[symbol]
  return VOWEL_ARTICULATION_BY_LANG[lang]?.[symbol]
}
