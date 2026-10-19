import { sanityClient } from './sanityClient'
import { consonantsData } from '@/data/consonants'
import { vowelsData } from '@/data/vowels'
import type { Consonant, Vowel } from '@/types'

/**
 * CMS 문서 _id(Sanity 자동 ID)와 로컬 _id(a, oe …)가 달라 symbol 로 매칭합니다.
 * 한국어 설명·영상·분류는 vowels.ts 를 항상 우선하고, CMS 는 다국어 필드만 보존합니다.
 */
/** CMS에 같은 언어 설명이 없을 때만 로컬 번역을 채운다. */
function localDescriptions<T extends object>(local: T, sanity: T): Record<string, string> {
  const fields: Record<string, string> = {}
  const localRow = local as Record<string, unknown>
  const sanityRow = sanity as Record<string, unknown>
  for (const key of Object.keys(localRow)) {
    if (!key.startsWith('description_')) continue
    const localText = localRow[key]
    const sanityText = sanityRow[key]
    if (typeof localText !== 'string' || !localText.trim()) continue
    if (typeof sanityText === 'string' && sanityText.trim()) continue
    fields[key] = localText
  }
  return fields
}

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
      ...localDescriptions(local, sanity),
    }
  })
}

function mergeConsonantFromLocal(sanityRows: Consonant[]): Consonant[] {
  if (sanityRows.length === 0) return []
  const localBySymbol = Object.fromEntries(consonantsData.map((row) => [row.symbol, row]))
  return sanityRows.map((sanity) => {
    const local = localBySymbol[sanity.symbol]
    if (!local) return sanity
    return { ...sanity, ...localDescriptions(local, sanity) }
  })
}

export async function getConsonants(): Promise<Consonant[]> {
  if (!sanityClient) return []
  try {
    const rows = await sanityClient.fetch<Consonant[]>(
      `*[_type == "consonant"] | order(category asc, name asc)`,
    )
    return mergeConsonantFromLocal(rows)
  } catch {
    return []
  }
}

export async function loadConsonantList(): Promise<Consonant[]> {
  const rows = await getConsonants()
  return rows.length > 0 ? rows : consonantsData
}

export async function loadVowelList(): Promise<Vowel[]> {
  const rows = await getVowels()
  return rows.length > 0 ? rows : vowelsData
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
