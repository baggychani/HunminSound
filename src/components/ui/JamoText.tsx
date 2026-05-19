'use client'

import { Fragment, useMemo } from 'react'

/**
 * 한글 자모(현대 호환 + 옛한글) 영역 — HanjaText 토큰 분류와 동일하게 유지.
 *  - U+1100–U+11FF : 현대·옛 한글 자모(첫·가운데·끝 결합형)
 *  - U+3131–U+318E : 호환 자모(ㄱ ㄴ … ㅏ ㅑ 등 단독 표기)
 *  - U+A960–U+A97F : 한글 자모 확장-A (옛한글)
 *  - U+D7B0–U+D7FF : 한글 자모 확장-B (옛한글)
 */
const HANGUL_JAMO_REGEX = /[\u1100-\u11FF\u3131-\u318E\uA960-\uA97F\uD7B0-\uD7FF]/

/**
 * 임의의 한국어 문자열 안에 단독으로 등장하는 한글 자모(ㄱ, ㅏ, ᅀᅵ 등)를
 * 교수님 지정 폰트(font-jamo)로 감싸 렌더한다.
 *
 * 자모 앞뒤로 결합형 글리프 결합을 끊지 않도록, 각 자모는 자체 `<span>`에 들어가지만
 * `display: inline` (기본값) 유지. 옛한글 결합 자모(초성+중성+종성 시퀀스)는
 * 연속된 자모 묶음 하나의 span에 담아 렌더 엔진의 자동 결합이 유지되도록 한다.
 *
 * 자모가 한 글자도 없으면 원문을 그대로 반환 — 불필요한 span 생성을 피한다.
 */
export function JamoText({
  text,
  className,
  jamoClassName,
}: {
  text: string
  /** 컨테이너 span 추가 클래스 (없으면 컨테이너 자체를 생략). */
  className?: string
  /** 자모 span에 추가로 입힐 클래스(색·크기 보정 등). */
  jamoClassName?: string
}) {
  const segments = useMemo(() => splitByJamo(text), [text])

  if (segments.length === 1 && !segments[0].isJamo) {
    return className ? <span className={className}>{text}</span> : <>{text}</>
  }

  const body = segments.map((seg, idx) => {
    if (seg.isJamo) {
      return (
        <span
          key={idx}
          className={['font-jamo', jamoClassName].filter(Boolean).join(' ')}
          lang="ko"
        >
          {seg.text}
        </span>
      )
    }
    return <Fragment key={idx}>{seg.text}</Fragment>
  })

  return className ? <span className={className}>{body}</span> : <>{body}</>
}

interface Segment {
  text: string
  isJamo: boolean
}

/**
 * 문자열을 자모 구간/비자모 구간 시퀀스로 분할.
 * 연속된 자모는 한 묶음으로 처리 — 옛한글 초·중·종 결합 시퀀스(ᅀ+ᅵ 등)가
 * 분리되지 않게 하기 위함.
 */
function splitByJamo(text: string): Segment[] {
  if (!text) return [{ text: '', isJamo: false }]
  const out: Segment[] = []
  let buf = ''
  let bufIsJamo = false
  for (const ch of text) {
    const isJ = HANGUL_JAMO_REGEX.test(ch)
    if (buf === '') {
      buf = ch
      bufIsJamo = isJ
      continue
    }
    if (isJ === bufIsJamo) {
      buf += ch
    } else {
      out.push({ text: buf, isJamo: bufIsJamo })
      buf = ch
      bufIsJamo = isJ
    }
  }
  if (buf !== '') out.push({ text: buf, isJamo: bufIsJamo })
  return out
}
