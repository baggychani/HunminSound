import { NextResponse } from 'next/server'
import type { Lang } from '@/lib/i18n'
import { buildMtKey, getBundledMachineTranslation } from '@/lib/mtCache'

export const dynamic = 'force-dynamic'

const LANG_CODES: Lang[] = ['ko', 'en', 'zh', 'ja', 'fr', 'de', 'es', 'hi']

function isLang(x: unknown): x is Lang {
  return typeof x === 'string' && (LANG_CODES as string[]).includes(x)
}

/** MyMemory GET API 대상 언어 코드 */
const MYMEMORY_TARGET: Record<Exclude<Lang, 'ko'>, string> = {
  en: 'en',
  zh: 'zh-CN',
  ja: 'ja',
  fr: 'fr',
  de: 'de',
  es: 'es',
  hi: 'hi',
}

const MAX_CHUNK = 420

function chunkKoreanText(text: string): string[] {
  const t = text.trim()
  if (t.length <= MAX_CHUNK) return [t]
  const parts: string[] = []
  let i = 0
  while (i < t.length) {
    parts.push(t.slice(i, i + MAX_CHUNK))
    i += MAX_CHUNK
  }
  return parts
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      text?: unknown
      target?: unknown
      itemId?: unknown
    }
    const text = typeof body.text === 'string' ? body.text : ''
    const target = body.target
    const itemId = typeof body.itemId === 'string' ? body.itemId : ''

    if (!text.trim()) {
      return NextResponse.json({ translated: text })
    }
    if (!isLang(target) || target === 'ko') {
      return NextResponse.json({ translated: text })
    }

    if (itemId) {
      const key = buildMtKey(itemId, target, text)
      const hit = getBundledMachineTranslation(key)
      if (hit) {
        return NextResponse.json({ translated: hit, source: 'bundle' as const })
      }
    }

    const tgt = MYMEMORY_TARGET[target]
    if (!tgt) {
      return NextResponse.json({ translated: text })
    }

    const chunks = chunkKoreanText(text)
    const out: string[] = []

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=ko|${tgt}`
      const res = await fetch(url)
      const data = (await res.json()) as {
        responseData?: { translatedText?: string }
      }
      const piece = data?.responseData?.translatedText
      out.push(typeof piece === 'string' && piece.trim() ? piece : chunk)
      if (i < chunks.length - 1) {
        await new Promise((r) => setTimeout(r, 200))
      }
    }

    return NextResponse.json({ translated: out.join('') })
  } catch {
    return NextResponse.json({ translated: null }, { status: 500 })
  }
}
