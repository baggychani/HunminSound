'use client'

import { useEffect, useState } from 'react'
import type { Lang } from '@/lib/i18n'
import { getDescription } from '@/lib/i18n'
import {
  MT_LS_PREFIX,
  buildMtKey,
  getBundledMachineTranslation,
} from '@/lib/mtCache'

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

/** 번들만 사용 SSR 초기값(localStorage는 마운트 후 적용해 hydration 불일치 방지) */
function bundledOrCms(item: DescItem, lang: Lang, itemId: string): string {
  const { text: cmsText, isFallback: fb } = getDescription(item, lang)
  if (!fb || lang === 'ko') return cmsText
  if (!itemId) return cmsText
  const key = buildMtKey(itemId, lang, item.description)
  return getBundledMachineTranslation(key) ?? cmsText
}

export function TranslatedDescription({
  item,
  lang,
  className = 'font-sans text-sm text-ink-soft leading-loose mb-6',
}: {
  item: DescItem
  lang: Lang
  className?: string
}) {
  const itemId = '_id' in item && typeof item._id === 'string' ? item._id : ''

  const [text, setText] = useState(() => bundledOrCms(item, lang, itemId))

  useEffect(() => {
    const base = bundledOrCms(item, lang, itemId)
    setText(base)

    const { isFallback: fb } = getDescription(item, lang)
    if (!fb || lang === 'ko' || !itemId) return

    const key = buildMtKey(itemId, lang, item.description)
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
        text: item.description,
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
  }, [lang, item.description, itemId])

  return <p className={className}>{text}</p>
}
