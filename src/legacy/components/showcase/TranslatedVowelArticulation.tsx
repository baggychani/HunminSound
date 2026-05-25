'use client'

import { useEffect, useState } from 'react'
import type { Lang } from '@/lib/i18n'
import {
  MT_LS_PREFIX,
  buildMtKey,
  getBundledMachineTranslation,
} from '@/lib/mtCache'
import {
  VOWEL_ARTICULATION_KO,
  getVowelArticulationText,
} from '@/lib/vowelArticulation'

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

export function TranslatedVowelArticulation({
  symbol,
  lang,
  className = 'font-sans text-xs text-gold mt-3 tracking-wide normal-case',
}: {
  symbol: string
  lang: Lang
  className?: string
}) {
  const koSource = VOWEL_ARTICULATION_KO[symbol]
  if (!koSource) return null

  const itemId = `vowel-artic-${symbol}`

  const [text, setText] = useState(() => getVowelArticulationText(symbol, lang) ?? koSource)

  useEffect(() => {
    const staticText = getVowelArticulationText(symbol, lang)
    if (staticText) {
      setText(staticText)
      return
    }

    const key = buildMtKey(itemId, lang, koSource)
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
        text: koSource,
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
  }, [symbol, lang, koSource, itemId])

  return <p className={className}>{text}</p>
}
