import { sanityClient } from './sanityClient'
import type { Consonant, Vowel } from '@/types'

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
    return await sanityClient.fetch<Vowel[]>(
      `*[_type == "vowel"] | order(category asc, name asc)`,
    )
  } catch {
    return []
  }
}
