import type { Consonant } from '@/types'
import { withPhonemeText } from '@/data/site-text'
import consonantText from '@/data/text/consonants.json'

const consonantsSource: Omit<Consonant, 'description'>[] = [
  // ─── 파열음 (Plosives) ────────────────────────────────────────────
  // 양순 (Bilabial)
  {
    _id: 'b',
    name: 'ㅂ (비읍)',
    symbol: 'ㅂ',
    category: '파열음',
    articulationGroup: '양순',
    animationFileName: 'ㅂ.mp4',
    mriFileName: 'ㅂ.mp4',
  },
  {
    _id: 'p',
    name: 'ㅍ (피읖)',
    symbol: 'ㅍ',
    category: '파열음',
    articulationGroup: '양순',
    animationFileName: 'ㅍ.mp4',
    mriFileName: 'ㅍ.mp4',
  },
  {
    _id: 'bb',
    name: 'ㅃ (쌍비읍)',
    symbol: 'ㅃ',
    category: '파열음',
    articulationGroup: '양순',
    animationFileName: 'ㅃ.mp4',
    mriFileName: 'ㅃ.mp4',
  },
  // 치조 (Alveolar)
  {
    _id: 'd',
    name: 'ㄷ (디귿)',
    symbol: 'ㄷ',
    category: '파열음',
    articulationGroup: '치조',
    animationFileName: 'ㄷ.mp4',
    mriFileName: 'ㄷ.mp4',
  },
  {
    _id: 't',
    name: 'ㅌ (티읕)',
    symbol: 'ㅌ',
    category: '파열음',
    articulationGroup: '치조',
    animationFileName: 'ㅌ.mp4',
    mriFileName: 'ㅌ.mp4',
  },
  {
    _id: 'dd',
    name: 'ㄸ (쌍디귿)',
    symbol: 'ㄸ',
    category: '파열음',
    articulationGroup: '치조',
    animationFileName: 'ㄸ.mp4',
    mriFileName: 'ㄸ.mp4',
  },
  // 연구개 (Velar)
  {
    _id: 'g',
    name: 'ㄱ (기역)',
    symbol: 'ㄱ',
    category: '파열음',
    articulationGroup: '연구개',
    animationFileName: 'ㄱ.mp4',
    mriFileName: 'ㄱ.mp4',
    pictogramFileName: 'ㄱ.jpg',
  },
  {
    _id: 'k',
    name: 'ㅋ (키읔)',
    symbol: 'ㅋ',
    category: '파열음',
    articulationGroup: '연구개',
    animationFileName: 'ㅋ.mp4',
    mriFileName: 'ㅋ.mp4',
  },
  {
    _id: 'gg',
    name: 'ㄲ (쌍기역)',
    symbol: 'ㄲ',
    category: '파열음',
    articulationGroup: '연구개',
    animationFileName: 'ㄲ.mp4',
    mriFileName: 'ㄲ.mp4',
  },

  // ─── 마찰음 (Fricatives) ──────────────────────────────────────────
  {
    _id: 's',
    name: 'ㅅ (시옷)',
    symbol: 'ㅅ',
    category: '마찰음',
    articulationGroup: '치조',
    animationFileName: 'ㅅ.mp4',
    mriFileName: 'ㅅ.mp4',
  },
  {
    _id: 'ss',
    name: 'ㅆ (쌍시옷)',
    symbol: 'ㅆ',
    category: '마찰음',
    articulationGroup: '치조',
    animationFileName: 'ㅆ.mp4',
    mriFileName: 'ㅆ.mp4',
  },
  {
    _id: 'h',
    name: 'ㅎ (히읗)',
    symbol: 'ㅎ',
    category: '마찰음',
    articulationGroup: '성문',
    animationFileName: 'ㅎ.mp4',
    mriFileName: 'ㅎ.mp4',
  },

  // ─── 파찰음 (Affricates) ─────────────────────────────────────────
  {
    _id: 'j',
    name: 'ㅈ (지읒)',
    symbol: 'ㅈ',
    category: '파찰음',
    articulationGroup: '치조경구개',
    animationFileName: 'ㅈ.mp4',
    mriFileName: 'ㅈ.mp4',
  },
  {
    _id: 'ch',
    name: 'ㅊ (치읓)',
    symbol: 'ㅊ',
    category: '파찰음',
    articulationGroup: '치조경구개',
    animationFileName: 'ㅊ.mp4',
    mriFileName: 'ㅊ.mp4',
  },
  {
    _id: 'jj',
    name: 'ㅉ (쌍지읒)',
    symbol: 'ㅉ',
    category: '파찰음',
    articulationGroup: '치조경구개',
    animationFileName: 'ㅉ.mp4',
    mriFileName: 'ㅉ.mp4',
  },

  // ─── 비음 (Nasals) ───────────────────────────────────────────────
  {
    _id: 'n',
    name: 'ㄴ (니은)',
    symbol: 'ㄴ',
    category: '비음',
    articulationGroup: '치조',
    animationFileName: 'ㄴ.mp4',
    mriFileName: 'ㄴ.mp4',
    pictogramFileName: 'ㄴ.jpg',
  },
  {
    _id: 'm',
    name: 'ㅁ (미음)',
    symbol: 'ㅁ',
    category: '비음',
    articulationGroup: '양순',
    animationFileName: 'ㅁ.mp4',
    mriFileName: 'ㅁ.mp4',
  },
  {
    _id: 'ng',
    name: 'ㅇ (이응)',
    symbol: 'ㅇ',
    category: '비음',
    articulationGroup: '연구개',
    animationFileName: 'ㅇ.mp4',
  },

  // ─── 유음 (Liquids) ──────────────────────────────────────────────
  {
    _id: 'r',
    name: 'ㄹ (리을)',
    symbol: 'ㄹ',
    category: '유음',
    articulationGroup: '치조',
    animationFileName: 'ㄹ.mp4',
    mriFileName: 'ㄹ.mp4',
  },
]

export const consonantsData: Consonant[] = withPhonemeText(consonantsSource, consonantText)
