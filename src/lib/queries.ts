import { sanityClient } from './sanityClient'
import { vowelsData } from '@/data/vowels'
import type { Consonant, Vowel } from '@/types'

/**
 * CMS 문서 _id(Sanity 자동 ID)와 로컬 _id(a, oe …)가 달라 symbol 로 매칭합니다.
 * 한국어 설명·영상·분류는 vowels.ts 를 항상 우선하고, CMS 는 다국어 필드만 보존합니다.
 */
function mergeVowelFromLocal(sanityRows: Vowel[]): Vowel[] {
  if (sanityRows.length === 0) return vowelsData

  const sanityBySymbol = Object.fromEntries(sanityRows.map((r) => [r.symbol, r])) as Record<
    string,
    Vowel
  >

  return vowelsData.map((local) => {
    const sanity = sanityBySymbol[local.symbol]
    if (!sanity) return local
    return {
      ...sanity,
      _id: local._id,
      name: local.name,
      symbol: local.symbol,
      category: local.category,
      description: local.description,
      animationFileName: local.animationFileName,
      mriFileName: local.mriFileName,
      pictogramFileName: local.pictogramFileName,
    }
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
    return mergeVowelFromLocal(rows)
  } catch {
    return []
  }
}
