export interface Consonant {
  _id: string
  name: string
  symbol: string
  category: string
  articulationGroup?: string
  description: string
  description_en?: string
  description_zh?: string
  description_ja?: string
  description_fr?: string
  description_hi?: string
  description_vi?: string
  description_ru?: string
  description_ar?: string
  description_de?: string
  description_es?: string
  animationFileName?: string
  mriFileName?: string
  /** 상형도 일러스트 — public/images/pictograms/ */
  pictogramFileName?: string
}

export interface Vowel {
  _id: string
  name: string
  symbol: string
  category: string
  description: string
  description_en?: string
  description_zh?: string
  description_ja?: string
  description_fr?: string
  description_hi?: string
  description_vi?: string
  description_ru?: string
  description_ar?: string
  description_de?: string
  description_es?: string
  animationFileName?: string
  mriFileName?: string
  pictogramFileName?: string
}
