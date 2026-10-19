'use client'

import { useMemo } from 'react'
import type { GetDescriptionOptions, Lang } from '@/lib/i18n'
import { getDescription } from '@/lib/i18n'
import { usePublicOverridesStore } from '@/hooks/useSiteMessages'
import { JamoText } from '@/components/ui/JamoText'

type DescItem = { description: string; [key: string]: unknown }

function buildDescOptions(
  store: ReturnType<typeof usePublicOverridesStore>,
  phonemeType: 'consonant' | 'vowel' | undefined,
  itemId: string,
): GetDescriptionOptions | undefined {
  if (!phonemeType || !itemId) return undefined
  return { store, phonemeType, itemId }
}

/** 코드와 관리자에 저장된 번역만 보여 준다. 없으면 한국어 원문. */
export function TranslatedDescription({
  item,
  lang,
  phonemeType,
  className = 'font-sans text-sm text-ink-soft leading-loose mb-6',
}: {
  item: DescItem
  lang: Lang
  phonemeType?: 'consonant' | 'vowel'
  className?: string
}) {
  const store = usePublicOverridesStore()
  const itemId = '_id' in item && typeof item._id === 'string' ? item._id : ''
  const descOptions = useMemo(
    () => buildDescOptions(store, phonemeType, itemId),
    [store, phonemeType, itemId],
  )
  const text = getDescription(item, lang, descOptions).text

  return (
    <p className={className}>
      <JamoText text={text} />
    </p>
  )
}
