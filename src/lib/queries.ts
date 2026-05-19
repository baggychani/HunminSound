import { sanityClient } from './sanityClient'
import { vowelsData } from '@/data/vowels'
import type { Consonant, Vowel } from '@/types'

/** CMS에 올린 뒤에도 영상 파일명은 로컬 vowels.ts 와 동기(ㅡ → ani_w 등). */
const VOWEL_MEDIA_BY_ID = Object.fromEntries(
  vowelsData.map((v) => [
    v._id,
    { animationFileName: v.animationFileName, mriFileName: v.mriFileName },
  ]),
) as Record<string, Pick<Vowel, 'animationFileName' | 'mriFileName'>>

function mergeVowelMediaFromLocal(vowels: Vowel[]): Vowel[] {
  return vowels.map((row) => {
    const media = VOWEL_MEDIA_BY_ID[row._id]
    if (!media) return row
    return { ...row, ...media }
  })
}

export async function getConsonants(): Promise<Consonant[]> {
  if (!sanityClient) return []
  try {
    return await sanityClient.fetch<Consonant[]>(
      `*[_type == "consonant"] | order(category asc, name asc)`,
    )
  } catch {
    return []
  }
}

export async function getVowels(): Promise<Vowel[]> {
  if (!sanityClient) return []
  try {
    const rows = await sanityClient.fetch<Vowel[]>(
      `*[_type == "vowel"] | order(category asc, name asc)`,
    )
    return mergeVowelMediaFromLocal(rows)
  } catch {
    return []
  }
}
