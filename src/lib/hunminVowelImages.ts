/** 훈민 모음 필기 PNG — public/images/hunmin/vowels/{asset}.png */
export const HUNMIN_VOWEL_IMAGE_BASE = '/images/hunmin/vowels'

export function hunminVowelImageSrc(asset: string): string {
  return `${HUNMIN_VOWEL_IMAGE_BASE}/${asset}.png`
}
