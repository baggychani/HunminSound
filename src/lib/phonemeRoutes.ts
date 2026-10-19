import type { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'

export type PhonemeBase = '/consonants' | '/vowels'

export function clipPhonemeDescription(text: string) {
  const flat = text.replace(/\s+/g, ' ').trim()
  if (flat.length <= 160) return flat
  return `${flat.slice(0, 159).trimEnd()}…`
}

export function phonemeMetadata(
  base: PhonemeBase,
  item: { _id: string; name: string; description: string },
): Metadata {
  const path = `${base}/${item._id}`
  const description = clipPhonemeDescription(item.description)
  return {
    title: item.name,
    description,
    alternates: { canonical: path },
    openGraph: { url: path, title: item.name, description },
  }
}

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

/** 예전 ?id=b 공유 주소를 /consonants/b 로 보낸다. */
export function redirectLegacyPhonemeQuery(
  base: PhonemeBase,
  searchParams: { id?: string | string[]; view?: string | string[] } | undefined,
  known: readonly { _id: string }[],
) {
  const id = one(searchParams?.id)
  if (!id || !known.some((item) => item._id === id)) return
  const view = one(searchParams?.view) === 'hunmin' ? '?view=hunmin' : ''
  permanentRedirect(`${base}/${id}${view}`)
}
