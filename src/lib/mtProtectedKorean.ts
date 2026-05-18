/**
 * 한국어 설명문 기계번역 시 예시 한글·자모는 MT에 직접 넣지 않고 복원한다.
 *
 * 중요: 보존 덩어리 **마다 따로** 번역 API를 호출하면 `'띠'` | `에서와 같이 …`로
 * 문맥이 끊겨, 영어에서 `As in`이 `'띠'` 앞이 아니라 뒤 조각에만 붙는 등
 * **어순·논리가 깨진다.** 그래서 보존 구간은 `{{0}}`, `{{1}}` … 플레이스홀더로
 * 치환한 **한 덩어리(또는 플레이스홀더를 자르지 않게 나눈 청크)**만 API에 보낸 뒤
 * 번역 결과에서 되돌린다.
 *
 * 보존 대상:
 * - 작은따옴표 `'…'`, 유니코드 ‘…’, 큰따옴표 “…”
 * - 대괄호 `[…]`
 * - 호환·조합 자모 연속열 (가~힣 음절 제외)
 */

export type KoreanTextPiece = { keepOriginal: true; text: string } | { keepOriginal: false; text: string }

/** 호환 자모(U+3131–U+318E) + 한글 자모 블록(U+1100–U+11FF). 음절(AC00–D7A3)은 포함하지 않음. */
const JAMO_RUN = /[\u3131-\u318E\u1100-\u11FF]+/g

/** `{{숫자}}` — MyMemory가 자주 그대로 두는 형태 */
const PLACEHOLDER_FMT = (i: number) => `{{${i}}}`
const PLACEHOLDER_RE = /\{\{\s*(\d+)\s*\}\}/g

function splitQuotesAndBrackets(text: string): KoreanTextPiece[] {
  const re =
    /'[^']*'|\[[^\]]+\]|[\u2018][^\u2019]*[\u2019]|[\u201C][^\u201D]*[\u201D]/g
  const pieces: KoreanTextPiece[] = []
  let last = 0
  let m: RegExpExecArray | null

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      const t = text.slice(last, m.index)
      if (t.length > 0) pieces.push({ keepOriginal: false, text: t })
    }
    pieces.push({ keepOriginal: true, text: m[0] })
    last = m.index + m[0].length
  }
  if (last < text.length) {
    const t = text.slice(last)
    if (t.length > 0) pieces.push({ keepOriginal: false, text: t })
  }

  return pieces
}

function splitJamoRunsInTranslatable(text: string): KoreanTextPiece[] {
  if (text.length === 0) return []
  const pieces: KoreanTextPiece[] = []
  let last = 0
  let m: RegExpExecArray | null
  JAMO_RUN.lastIndex = 0
  while ((m = JAMO_RUN.exec(text)) !== null) {
    if (m.index > last) {
      const t = text.slice(last, m.index)
      if (t.length > 0) pieces.push({ keepOriginal: false, text: t })
    }
    pieces.push({ keepOriginal: true, text: m[0] })
    last = m.index + m[0].length
  }
  if (last < text.length) {
    const t = text.slice(last)
    if (t.length > 0) pieces.push({ keepOriginal: false, text: t })
  }
  return pieces
}

/** 따옴표·대괄호·자모열까지 잘라 낸 조각 목록(마스킹 입력). */
export function splitKoreanForMt(text: string): KoreanTextPiece[] {
  const outer = splitQuotesAndBrackets(text)
  const out: KoreanTextPiece[] = []
  for (const p of outer) {
    if (p.keepOriginal) {
      out.push(p)
    } else {
      out.push(...splitJamoRunsInTranslatable(p.text))
    }
  }
  return out
}

export function buildMaskedForTranslation(text: string): { masked: string; spans: string[] } {
  const parts = splitKoreanForMt(text)
  const spans: string[] = []
  let masked = ''
  for (const p of parts) {
    if (p.keepOriginal) {
      spans.push(p.text)
      masked += PLACEHOLDER_FMT(spans.length - 1)
    } else {
      masked += p.text
    }
  }
  return { masked, spans }
}

/** `{{n}}` 토큰을 절대 가르지 않고 maxLen 이하로 잘라 MT 청크 배열로 만든다. */
export function chunkMaskedForApi(masked: string, maxLen: number): string[] {
  const tokens: string[] = []
  const re = /\{\{\d+\}\}/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(masked)) !== null) {
    if (m.index > last) tokens.push(masked.slice(last, m.index))
    tokens.push(m[0])
    last = m.index + m[0].length
  }
  if (last < masked.length) tokens.push(masked.slice(last))

  const chunks: string[] = []
  let buf = ''

  const flush = () => {
    if (buf.length > 0) {
      chunks.push(buf)
      buf = ''
    }
  }

  for (const tok of tokens) {
    const isPh = /^\{\{\d+\}\}$/.test(tok)

    if (buf.length + tok.length <= maxLen) {
      buf += tok
      continue
    }

    flush()

    if (isPh) {
      buf = tok
      continue
    }

    let rest = tok
    while (rest.length > 0) {
      if (buf.length === 0) {
        if (rest.length <= maxLen) {
          buf = rest
          rest = ''
        } else {
          chunks.push(rest.slice(0, maxLen))
          rest = rest.slice(maxLen)
        }
      } else {
        const room = maxLen - buf.length
        if (rest.length <= room) {
          buf += rest
          rest = ''
        } else {
          buf += rest.slice(0, room)
          flush()
        }
      }
    }
  }
  flush()
  return chunks
}

export function unmaskAfterTranslation(translated: string, spans: string[]): string {
  let s = translated.replace(PLACEHOLDER_RE, (_, d) => {
    const i = parseInt(String(d), 10)
    return spans[i] !== undefined ? spans[i] : `{{${d}}}`
  })

  /* 흔한 깨짐: 전각 중괄호·공백 */
  s = s.replace(/｛｛\s*(\d+)\s*｝｝/g, (_, d) => {
    const i = parseInt(String(d), 10)
    return spans[i] !== undefined ? spans[i] : `｛｛${d}｝｝`
  })

  return s
}

const MYMEMORY_THROTTLE_MS = 180

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms))
}

export type TranslateOneFn = (segment: string) => Promise<string>

/**
 * 보존 구간을 `{{n}}`으로 마스킹한 뒤, 청크 단위로 `translateOne` 호출·이어붙인 다음 복원.
 * (조각별 번역이 아니라 **같은 문장 안에서 플레이스홀더 위치가 유지**되도록 함.)
 */
export async function translateKoreanWithPlaceholders(
  text: string,
  translateOne: TranslateOneFn,
  maxChunkLen: number,
): Promise<string> {
  const { masked, spans } = buildMaskedForTranslation(text)
  if (spans.length === 0) {
    return translateLongWithFixedChunk(masked, translateOne, maxChunkLen)
  }

  const parts = chunkMaskedForApi(masked, maxChunkLen)
  let acc = ''
  let first = true
  for (const part of parts) {
    if (!first) await sleep(MYMEMORY_THROTTLE_MS)
    first = false
    acc += await translateOne(part)
  }

  return unmaskAfterTranslation(acc, spans)
}

/** 플레이스홀더 없을 때 기존처럼 고정 길이로 자름 */
export async function translateLongWithFixedChunk(
  text: string,
  translateOne: TranslateOneFn,
  maxChunkLen: number,
): Promise<string> {
  const t = text.trim()
  if (t.length === 0) return text
  if (t.length <= maxChunkLen) return translateOne(t)

  const parts: string[] = []
  let i = 0
  while (i < t.length) {
    parts.push(t.slice(i, i + maxChunkLen))
    i += maxChunkLen
  }

  let acc = ''
  let first = true
  for (const p of parts) {
    if (!first) await sleep(MYMEMORY_THROTTLE_MS)
    first = false
    acc += await translateOne(p)
  }
  return acc
}
