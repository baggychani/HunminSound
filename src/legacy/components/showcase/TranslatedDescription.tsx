'use client'

import { useEffect, useMemo, useState } from 'react'
import type { GetDescriptionOptions, Lang } from '@/lib/i18n'
import { getDescription } from '@/lib/i18n'
import {
  MT_LS_PREFIX,
  buildMtKey,
  getBundledMachineTranslation,
} from '@/lib/mtCache'
import { usePublicOverridesStore } from '@/hooks/useSiteMessages'
import { JamoText } from '@/components/ui/JamoText'

type DescItem = { description: string; [key: string]: unknown }

function readLs(key: string): string | undefined {
  if (typeof window === 'undefined') return undefined
  try {
    const v = window.localStorage.getItem(MT_LS_PREFIX + key)
    return v && v.trim() ? v : undefined
  } catch {
    return undefined
  }
}

function writeLs(key: string, value: string) {
  try {
    window.localStorage.setItem(MT_LS_PREFIX + key, value)
  } catch {
    /* 비공개 모드 등 */
  }
}

function buildDescOptions(
  store: ReturnType<typeof usePublicOverridesStore>,
  phonemeType: 'consonant' | 'vowel' | undefined,
  itemId: string,
): GetDescriptionOptions | undefined {
  if (!phonemeType || !itemId) return undefined
  return { store, phonemeType, itemId }
}

function bundledOrCms(
  item: DescItem,
  lang: Lang,
  itemId: string,
  descOptions: GetDescriptionOptions | undefined,
): string {
  const { text: cmsText, isFallback: fb } = getDescription(item, lang, descOptions)
  if (!fb || lang === 'ko') return cmsText
  if (!itemId) return cmsText
  const koreanSource = getDescription(item, 'ko', descOptions).text
  const key = buildMtKey(itemId, lang, koreanSource)
  return getBundledMachineTranslation(key) ?? cmsText
}

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

  const [text, setText] = useState(() => bundledOrCms(item, lang, itemId, descOptions))

  useEffect(() => {
    const base = bundledOrCms(item, lang, itemId, descOptions)
    setText(base)

    const { isFallback: fb } = getDescription(item, lang, descOptions)
    if (!fb || lang === 'ko' || !itemId) return

    const koreanSource = getDescription(item, 'ko', descOptions).text
    const key = buildMtKey(itemId, lang, koreanSource)
    const bundled = getBundledMachineTranslation(key)
    const ls = readLs(key)

    if (bundled) {
      setText(bundled)
      return
    }
    if (ls) {
      setText(ls)
      return
    }

    const ac = new AbortController()
    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: koreanSource,
        target: lang,
        itemId,
      }),
      signal: ac.signal,
    })
      .then((r) => r.json())
      .then((data: { translated?: string | null }) => {
        if (typeof data.translated === 'string' && data.translated.trim()) {
          setText(data.translated)
          writeLs(key, data.translated)
        }
      })
      .catch(() => {})

    return () => ac.abort()
  }, [lang, item, itemId, descOptions])

  return (
    <p className={className}>
      <JamoText text={text} />
    </p>
  )
}
