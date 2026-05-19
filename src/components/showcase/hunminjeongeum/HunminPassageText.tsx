'use client'

import { useMemo } from 'react'
import { JamoText } from '@/components/ui/JamoText'

type Part = { kind: 'plain'; text: string } | { kind: 'bracket'; inner: string }

/** 해례본 풀이·번역문 속 `[기]`, `[ᅀᅵ]` 등 발음 괄호만 분리 */
function splitBracketParts(text: string): Part[] {
  if (!text) return [{ kind: 'plain', text: '' }]
  const parts: Part[] = []
  const re = /\[([^\]]+)\]/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ kind: 'plain', text: text.slice(last, m.index) })
    parts.push({ kind: 'bracket', inner: m[1] })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push({ kind: 'plain', text: text.slice(last) })
  if (parts.length === 0) parts.push({ kind: 'plain', text })
  return parts
}

/**
 * 훈민정음 페이지 전용 본문 렌더.
 * - `[...]` 괄호 안(기, 양성모음 등) → 본문과 동일한 일반 명조(부모 font-serif 상속)
 * - 그 밖 단독 자모(ㄱ, ㅏ …) → Title (font-jamo)
 */
export function HunminPassageText({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const parts = useMemo(() => splitBracketParts(text), [text])

  const body = parts.map((part, idx) => {
    if (part.kind === 'bracket') {
      return (
        <span key={`b-${idx}`} lang="ko">
          [{part.inner}]
        </span>
      )
    }
    if (!part.text) return null
    return <JamoText key={`p-${idx}`} text={part.text} />
  })

  return className ? <span className={className}>{body}</span> : <>{body}</>
}
