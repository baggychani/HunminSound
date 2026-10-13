import { NextResponse } from 'next/server'
import type { Lang } from '@/lib/i18n'
import { buildMtKey, getBundledMachineTranslation } from '@/lib/mtCache'
import { translateKoreanWithPlaceholders, translateLongWithFixedChunk } from '@/lib/mtProtectedKorean'
import { checkPublicRateLimit, getClientIp } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

/** 무료 MyMemory API 일일 한도를 한 IP가 소진시키지 못하게 하는 상한 */
const MAX_TEXT_LEN = 2000

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
  /** 번역 미착수 — LANG_CODES에는 없어서 isLang()이 걸러내지만 Record<Lang,…> 완전성 위해 필요 */
  tr: 'tr',
  id: 'id',
  th: 'th',
}

const MAX_CHUNK = 420

export async function POST(req: Request) {
  try {
    // 연구 소개 한 페이지가 미번역 문장마다 한 번씩 호출하고, 발표장처럼 여러 명이 한 IP를 같이 쓴다
    if (!checkPublicRateLimit('translate', getClientIp(req), 300, 10 * 60 * 1000, 2000)) {
      return NextResponse.json({ translated: null, error: 'RATE_LIMIT' }, { status: 429 })
    }

    const body = (await req.json()) as {
      text?: unknown
      target?: unknown
      source?: unknown
      itemId?: unknown
    }
    const text = typeof body.text === 'string' ? body.text.slice(0, MAX_TEXT_LEN) : ''
    const target = body.target
    const sourceLang: Lang = isLang(body.source) ? body.source : 'ko'
    const itemId = typeof body.itemId === 'string' ? body.itemId : ''

    if (!text.trim()) {
      return NextResponse.json({ translated: text })
    }
    if (target === sourceLang) {
      return NextResponse.json({ translated: text })
    }
    if (!isLang(target)) {
      return NextResponse.json({ translated: null })
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
      return NextResponse.json({ translated: null })
    }

    /* 한 조각이라도 실패하면 null을 돌려준다. 원문을 돌려주면 클라이언트가 그것을 번역으로 저장해 버린다. */
    let failed = false
    const translateOneSegment = async (segment: string): Promise<string> => {
      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(segment)}&langpair=${src}|${tgt}`
        const res = await fetch(url, { signal: AbortSignal.timeout(10_000) })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = (await res.json()) as {
          responseData?: { translatedText?: string }
          responseStatus?: number | string
          quotaFinished?: boolean
        }
        const piece = data?.responseData?.translatedText
        // 한도 초과 등은 HTTP 200에 "MYMEMORY WARNING: ..." 같은 안내문을 번역 자리에 담아 온다
        if (
          data?.quotaFinished === true ||
          Number(data?.responseStatus) !== 200 ||
          typeof piece !== 'string' ||
          !piece.trim() ||
          /MYMEMORY WARNING|QUERY LENGTH LIMIT|INVALID LANGUAGE PAIR/i.test(piece)
        ) {
          throw new Error('MyMemory rejected')
        }
        return piece
      } catch {
        failed = true
        return segment
      }
    }

    /* 한국어: 보존 구간은 {{0}}…로 치환한 뒤 한 덩어리(또는 플레이스홀더 안 자르는 청크)로만 번역.
     * 조각마다 따로 API를 호출하면 `'띠' + '에서와 같이…'`처럼 끊겨 as in 어순이 깨진다. */
    const translated =
      sourceLang === 'ko'
        ? await translateKoreanWithPlaceholders(text, translateOneSegment, MAX_CHUNK)
        : await translateLongWithFixedChunk(text, translateOneSegment, MAX_CHUNK)

    return NextResponse.json({ translated: failed ? null : translated })
  } catch {
    return NextResponse.json({ translated: null }, { status: 500 })
  }
}
