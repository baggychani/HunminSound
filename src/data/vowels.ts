import type { Vowel } from '@/types'
import { withPhonemeText } from '@/data/site-text'
import vowelText from '@/data/text/vowels.json'

const vowelsSource: Omit<Vowel, 'description'>[] = [
  // 천지인 — 아래아 (훈민정음 전용, 현대 음성학 차트에는 미표시) ─────────────────
  {
    _id: 'araea',
    name: '아래아 (·)',
    symbol: '·',
    category: '천지인',
    pictogramFileName: '아래아.jpg',
    animationFileName: 'ani_araea.mp4',
    mriFileName: 'mri_araea.mp4',
  },

  // 단모음 (Monophthongs) ──────────────────────────────────────────────────────
  {
    _id: 'a',
    name: 'ㅏ (아)',
    symbol: 'ㅏ',
    category: '단모음',
    animationFileName: 'ani_a.mp4',
    mriFileName: 'mri_a.mp4',
  },
  {
    _id: 'ae',
    name: 'ㅐ (애)',
    symbol: 'ㅐ',
    category: '단모음',
    animationFileName: 'ani_ae.mp4',
    mriFileName: 'mri_ae.mp4',
  },
  {
    _id: 'eo',
    name: 'ㅓ (어)',
    symbol: 'ㅓ',
    category: '단모음',
    animationFileName: 'ani_v.mp4',
    mriFileName: 'mri_eo.mp4',
  },
  {
    _id: 'e',
    name: 'ㅔ (에)',
    symbol: 'ㅔ',
    category: '단모음',
    animationFileName: 'ani_e.mp4',
    mriFileName: 'mri_e.mp4',
  },
  {
    _id: 'o',
    name: 'ㅗ (오)',
    symbol: 'ㅗ',
    category: '단모음',
    animationFileName: 'ani_o.mp4',
    mriFileName: 'mri_o.mp4',
  },
  {
    _id: 'oe',
    name: 'ㅚ (외)',
    symbol: 'ㅚ',
    category: '단모음',
    animationFileName: 'ani_oe.mp4',
  },
  {
    _id: 'u',
    name: 'ㅜ (우)',
    symbol: 'ㅜ',
    category: '단모음',
    animationFileName: 'ani_u.mp4',
    mriFileName: 'mri_u.mp4',
  },
  {
    _id: 'wi',
    name: 'ㅟ (위)',
    symbol: 'ㅟ',
    category: '단모음',
    animationFileName: 'ani_wi.mp4',
  },
  {
    _id: 'eu',
    name: 'ㅡ (으)',
    symbol: 'ㅡ',
    category: '단모음',
    animationFileName: 'ani_w.mp4',
    mriFileName: 'mri_eu.mp4',
    pictogramFileName: 'ㅡ.jpg',
  },
  {
    _id: 'i',
    name: 'ㅣ (이)',
    symbol: 'ㅣ',
    category: '단모음',
    animationFileName: 'ani_i.mp4',
    mriFileName: 'mri_i.mp4',
    pictogramFileName: 'ㅣ.jpg',
  },

  // 이중모음 j계 (j-Diphthongs) ─────────────────────────────────────────────
  {
    _id: 'ya',
    name: 'ㅑ (야)',
    symbol: 'ㅑ',
    category: '이중모음',
    animationFileName: 'ani_ja.mp4',
    mriFileName: 'mri_ya.mp4',
  },
  {
    _id: 'yae',
    name: 'ㅒ (얘)',
    symbol: 'ㅒ',
    category: '이중모음',
    animationFileName: 'ani_jae.mp4',
  },
  {
    _id: 'yeo',
    name: 'ㅕ (여)',
    symbol: 'ㅕ',
    category: '이중모음',
    animationFileName: 'ani_jv.mp4',
    mriFileName: 'mri_yeo.mp4',
  },
  {
    _id: 'ye',
    name: 'ㅖ (예)',
    symbol: 'ㅖ',
    category: '이중모음',
    animationFileName: 'ani_je.mp4',
  },
  {
    _id: 'yo',
    name: 'ㅛ (요)',
    symbol: 'ㅛ',
    category: '이중모음',
    animationFileName: 'ani_jo.mp4',
    mriFileName: 'mri_yo.mp4',
  },
  {
    _id: 'yu',
    name: 'ㅠ (유)',
    symbol: 'ㅠ',
    category: '이중모음',
    animationFileName: 'ani_ju.mp4',
    mriFileName: 'mri_yu.mp4',
  },

  // 이중모음 w계 (w-Diphthongs) ─────────────────────────────────────────────
  {
    _id: 'wa',
    name: 'ㅘ (와)',
    symbol: 'ㅘ',
    category: '이중모음',
    animationFileName: 'ani_wa.mp4',
    mriFileName: 'mri_wa.mp4',
  },
  {
    _id: 'wae',
    name: 'ㅙ (왜)',
    symbol: 'ㅙ',
    category: '이중모음',
    animationFileName: 'ani_wae.mp4',
  },
  {
    _id: 'wo',
    name: 'ㅝ (워)',
    symbol: 'ㅝ',
    category: '이중모음',
    animationFileName: 'ani_wv.mp4',
  },
  {
    _id: 'we',
    name: 'ㅞ (웨)',
    symbol: 'ㅞ',
    category: '이중모음',
    animationFileName: 'ani_we.mp4',
  },
  {
    _id: 'ui',
    name: 'ㅢ (의)',
    symbol: 'ㅢ',
    category: '이중모음',
    animationFileName: 'ani_Gi.mp4',
    mriFileName: 'mri_ui.mp4',
  },
]

export const vowelsData: Vowel[] = withPhonemeText(vowelsSource, vowelText)