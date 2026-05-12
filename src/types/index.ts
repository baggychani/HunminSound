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
  animationFileName?: string
  mriFileName?: string
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
  animationFileName?: string
  mriFileName?: string
}
