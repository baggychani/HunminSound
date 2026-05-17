import { NextResponse } from 'next/server'
import type { Lang } from '@/lib/i18n'
import { buildMtKey, getBundledMachineTranslation } from '@/lib/mtCache'

export const dynamic = 'force-dynamic'

const LANG_CODES: Lang[] = ['ko', 'en', 'zh', 'ja', 'fr', 'de', 'es', 'hi', 'vi', 'ru', 'ar']

function isLang(x: unknown): x is Lang {
  return typeof x === 'string' && (LANG_CODES as string[]).includes(x)
}

/** MyMemory GET API 언어 코드 (출처/목표 공통) */
const MYMEMORY_CODE: Record<Lang, string> = {
  ko: 'ko',
  en: 'en',
  zh: 'zh-CN',
  ja: 'ja',
  fr: 'fr',
  de: 'de',
  es: 'es',
  hi: 'hi',
  vi: 'vi',
  ru: 'ru',
  ar: 'ar',
}

const MAX_CHUNK = 420

function chunkText(text: string): string[] {
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
      source?: unknown
      itemId?: unknown
    }
    const text = typeof body.text === 'string' ? body.text : ''
    const target = body.target
    const sourceLang: Lang = isLang(body.source) ? body.source : 'ko'
    const itemId = typeof body.itemId === 'string' ? body.itemId : ''

    if (!text.trim()) {
      return NextResponse.json({ translated: text })
    }
    if (!isLang(target) || target === sourceLang) {
      return NextResponse.json({ translated: text })
    }

    /* mt-cache 키는 source-lang을 itemId에 인코딩하여 source가 다른 경우에도 충돌하지 않게.
     * (호출자가 buildMtKey 로 키 생성 시 동일 규칙으로 만들면 hit) */
    if (itemId) {
      const key = buildMtKey(itemId, target, text)
      const hit = getBundledMachineTranslation(key)
      if (hit) {
        return NextResponse.json({ translated: hit, source: 'bundle' as const })
      }
    }

    const src = MYMEMORY_CODE[sourceLang]
    const tgt = MYMEMORY_CODE[target]
    if (!src || !tgt) {
      return NextResponse.json({ translated: text })
    }

    const chunks = chunkText(text)
    const out: string[] = []

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${src}|${tgt}`
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
