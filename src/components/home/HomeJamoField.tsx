'use client'

import type { RefObject } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

/**
 * 홈 1·2막 배경 — 한지 위에 은은히 떠 있는 자모(옛글자 포함) 장식. 데스크톱 전용.
 * `fixed`로 뷰포트에 고정해서, 1막에서 2막으로 스크롤해도 흩뿌린 위치가 그대로 유지된다
 * (예전엔 막마다 따로 자기 자리에 절대배치돼서 2막에서 배치가 확 바뀌어 보였음).
 * 3막(다크 풀블리드) 진입 전엔 스크롤에 맞춰 페이드아웃 — 밝은 톤 장식이라 다크 배경과 안 맞음.
 */
const GLYPHS = [
  { ch: 'ㆍ', left: '6%', top: '16%', size: '1.5rem', dur: 16, delay: 0, rot: 4, op: 0.16 },
  { ch: 'ㅿ', left: '11%', top: '34%', size: '2.1rem', dur: 19, delay: 2.4, rot: -6, op: 0.11 },
  { ch: 'ㆁ', left: '4%', top: '55%', size: '1.7rem', dur: 14, delay: 1.1, rot: 5, op: 0.13 },
  { ch: 'ㆆ', left: '13%', top: '72%', size: '1.4rem', dur: 17, delay: 3.6, rot: -4, op: 0.12 },
  { ch: 'ㄱ', left: '8%', top: '88%', size: '1.2rem', dur: 15, delay: 0.8, rot: 7, op: 0.1 },
  { ch: 'ㅅ', left: '19%', top: '12%', size: '1.15rem', dur: 18, delay: 4.2, rot: -5, op: 0.1 },
  { ch: 'ㅁ', left: '24%', top: '82%', size: '1.3rem', dur: 20, delay: 2.0, rot: 3, op: 0.09 },
  { ch: 'ㆍ', left: '30%', top: '7%', size: '1rem', dur: 13, delay: 5.0, rot: -3, op: 0.12 },
  { ch: 'ㄴ', left: '86%', top: '9%', size: '1.25rem', dur: 17, delay: 1.6, rot: 5, op: 0.08 },
  { ch: 'ㆁ', left: '93%', top: '78%', size: '1.5rem', dur: 15, delay: 3.0, rot: -6, op: 0.09 },
] as const

interface HomeJamoFieldProps {
  /** 이 영역이 시작되기 전에 자모 장식을 페이드아웃한다 (3막 진입 경계) */
  fadeBeforeRef: RefObject<HTMLElement | null>
}

export function HomeJamoField({ fadeBeforeRef }: HomeJamoFieldProps) {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()

  const fieldOpacity = useTransform(scrollY, (y) => {
    if (reduce) return 1
    const boundary = fadeBeforeRef.current?.offsetTop ?? Infinity
    if (!Number.isFinite(boundary)) return 1
    const fadeStart = boundary - (typeof window !== 'undefined' ? window.innerHeight * 0.5 : 400)
    if (y <= fadeStart) return 1
    if (y >= boundary) return 0
    return 1 - (y - fadeStart) / (boundary - fadeStart)
  })

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden overflow-hidden lg:block"
      style={{ opacity: fieldOpacity }}
    >
      {GLYPHS.map((g, i) => (
        <span
          key={i}
          className="hero-jamo-drift absolute font-jamo text-ink select-none"
          style={{
            left: g.left,
            top: g.top,
            fontSize: g.size,
            ['--drift-dur' as string]: `${g.dur}s`,
            ['--drift-delay' as string]: `${g.delay}s`,
            ['--drift-rot' as string]: `${g.rot}deg`,
            ['--drift-op' as string]: g.op,
            opacity: g.op,
          }}
        >
          {g.ch}
        </span>
      ))}
    </motion.div>
  )
}
