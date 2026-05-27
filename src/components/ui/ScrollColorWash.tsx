'use client'

import { useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'

type ActRefs = {
  act1: RefObject<HTMLElement | null>
  act2: RefObject<HTMLElement | null>
  act3: RefObject<HTMLElement | null>
}

type ActBounds = { t2: number; t3: number; fade: number }
type Rgb = [number, number, number]
type ActTone = { hanji: Rgb; warm: Rgb; border: Rgb }

const DEFAULT_BOUNDS: ActBounds = { t2: 800, t3: 1600, fade: 480 }

const ACT_TONES: Record<'light' | 'dark', { act1: ActTone; act2: ActTone; act3: ActTone }> = {
  light: {
    /* 1·3막 — 중성 아이보리 (노란기 최소) */
    act1: { hanji: [252, 251, 248], warm: [248, 246, 242], border: [224, 220, 214] },
    /* 2막 — 1막보다 살짝만 따뜻 (카드 대비용, 세피아 과하지 않게) */
    act2: { hanji: [249, 247, 243], warm: [246, 243, 238], border: [222, 217, 210] },
    act3: { hanji: [252, 251, 248], warm: [248, 246, 242], border: [224, 220, 214] },
  },
  dark: {
    act1: { hanji: [28, 25, 23], warm: [34, 30, 27], border: [72, 66, 60] },
    act2: { hanji: [30, 27, 24], warm: [36, 31, 27], border: [74, 67, 61] },
    act3: { hanji: [28, 25, 23], warm: [34, 30, 27], border: [72, 66, 60] },
  },
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge0 === edge1) return x >= edge1 ? 1 : 0
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function actWeights(y: number, { t2, t3, fade }: ActBounds) {
  const w1 = y < t2 - fade ? 1 : y < t2 ? 1 - smoothstep(t2 - fade, t2, y) : 0
  const w2 =
    y < t2 - fade
      ? 0
      : y < t2
        ? smoothstep(t2 - fade, t2, y)
        : y < t3 - fade
          ? 1
          : y < t3
            ? 1 - smoothstep(t3 - fade, t3, y)
            : 0
  const w3 = y < t3 - fade ? 0 : y < t3 ? smoothstep(t3 - fade, t3, y) : 1
  return { w1, w2, w3 }
}

function blendChannel(w1: number, w2: number, w3: number, c1: number, c2: number, c3: number) {
  const sum = w1 + w2 + w3 || 1
  return Math.round((c1 * w1 + c2 * w2 + c3 * w3) / sum)
}

function blendTone(
  w1: number,
  w2: number,
  w3: number,
  tones: { act1: ActTone; act2: ActTone; act3: ActTone },
  key: keyof ActTone,
): Rgb {
  const [a1, a2, a3] = [tones.act1[key], tones.act2[key], tones.act3[key]]
  return [
    blendChannel(w1, w2, w3, a1[0], a2[0], a3[0]),
    blendChannel(w1, w2, w3, a1[1], a2[1], a3[1]),
    blendChannel(w1, w2, w3, a1[2], a2[2], a3[2]),
  ]
}

function rgbToVar([r, g, b]: Rgb) {
  return `${r} ${g} ${b}`
}

function useActBounds(refs: ActRefs) {
  const boundsRef = useRef<ActBounds>({ ...DEFAULT_BOUNDS })

  useEffect(() => {
    const measure = () => {
      boundsRef.current = {
        t2: refs.act2.current?.offsetTop ?? boundsRef.current.t2,
        t3: refs.act3.current?.offsetTop ?? boundsRef.current.t3,
        fade: Math.max(420, window.innerHeight * 0.62),
      }
    }

    measure()
    window.addEventListener('resize', measure)

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    for (const ref of [refs.act1, refs.act2, refs.act3]) {
      if (ref.current) ro?.observe(ref.current)
    }

    return () => {
      window.removeEventListener('resize', measure)
      ro?.disconnect()
    }
  }, [refs.act1, refs.act2, refs.act3])

  return boundsRef
}

function useIsDark() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const sync = () => setIsDark(root.classList.contains('dark'))
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return isDark
}

const TONE_PROPS = ['--hanji-rgb', '--hanji-warm-rgb', '--hanji-border-rgb'] as const

function clearToneOverrides() {
  const root = document.documentElement
  for (const prop of TONE_PROPS) root.style.removeProperty(prop)
}

/**
 * 홈 3막 스크롤에 맞춰 `--hanji-rgb` 등 페이지 기본 색을 직접 보간한다.
 * blur 블롭이 아니라 body·카드가 쓰는 한지 색 자체가 막마다 달라진다.
 */
export function ScrollColorWash({ actRefs }: { actRefs?: ActRefs }) {
  const reduce = useReducedMotion()
  const isDark = useIsDark()
  const boundsRef = useActBounds(
    actRefs ?? {
      act1: { current: null },
      act2: { current: null },
      act3: { current: null },
    },
  )
  const { scrollY } = useScroll()
  const active = Boolean(actRefs)

  const applyTone = useCallback(
    (y: number) => {
      if (!active || reduce) return

      const { w1, w2, w3 } = actWeights(y, boundsRef.current ?? DEFAULT_BOUNDS)
      const tones = ACT_TONES[isDark ? 'dark' : 'light']
      const root = document.documentElement

      root.style.setProperty('--hanji-rgb', rgbToVar(blendTone(w1, w2, w3, tones, 'hanji')))
      root.style.setProperty('--hanji-warm-rgb', rgbToVar(blendTone(w1, w2, w3, tones, 'warm')))
      root.style.setProperty('--hanji-border-rgb', rgbToVar(blendTone(w1, w2, w3, tones, 'border')))
    },
    [active, reduce, isDark, boundsRef],
  )

  useMotionValueEvent(scrollY, 'change', applyTone)

  useEffect(() => {
    if (!active) return
    applyTone(window.scrollY)
    return clearToneOverrides
  }, [active, applyTone])

  return null
}
