'use client'

import { useCallback, useId, useLayoutEffect, useRef, useState, type PointerEvent } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  type AnimationPlaybackControls,
  type MotionValue,
} from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const
const MAGNET = 72
const COMMIT = 40

const CHEON_JI_IN_ITEMS = [
  { glyph: '\u00B7', title: '\uC544\uB798\uC544', hanja: '\u5929', desc: '\uB465\uADFC \uC810 \u2014 \uD558\uB298\uC744 \uC0C1\uC9D5' },
  { glyph: '\u3161', title: '\uB545', hanja: '\u5730', desc: '\uD3C9\uD3C9\uD55C \uC120 \u2014 \uB545\uC744 \uC0C1\uC9D5' },
  { glyph: '\u3163', title: '\uC0AC\uB78C', hanja: '\u4EBA', desc: '\uC138\uC6B4 \uC120 \u2014 \uC0AC\uB78C\uC744 \uC0C1\uC9D5' },
] as const

type SlotId = 'above' | 'below' | 'left' | 'right'

type Slot = {
  id: SlotId
  x: number
  y: number
  glyph: string
  line: string
}

type Point = { x: number; y: number }

type Metrics = {
  earth: Point
  person: Point
  home: Point
  slots: Slot[]
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function metricsFor(w: number, h: number): Metrics {
  const y = h * 0.5
  const earth = { x: w * 0.46, y }
  const person = { x: w * 0.72, y }
  const gap = Math.min(58, h * 0.28)
  const home = { x: Math.max(36, w * 0.16), y }
  return {
    earth,
    person,
    home,
    slots: [
      { id: 'above', x: earth.x, y: y - gap, glyph: 'ㅗ', line: 'ㅡ 위에 점을 붙이면 ㅗ' },
      { id: 'below', x: earth.x, y: y + gap, glyph: 'ㅜ', line: 'ㅡ 아래에 점을 붙이면 ㅜ' },
      { id: 'right', x: person.x + gap * 0.72, y, glyph: 'ㅏ', line: 'ㅣ 오른쪽에 점을 붙이면 ㅏ' },
      { id: 'left', x: person.x - gap * 0.72, y, glyph: 'ㅓ', line: 'ㅣ 왼쪽에 점을 붙이면 ㅓ' },
    ],
  }
}

function nearestSlot(px: number, py: number, slots: Slot[]) {
  let slot = slots[0]
  let dist = Infinity
  for (const item of slots) {
    const d = Math.hypot(px - item.x, py - item.y)
    if (d < dist) {
      slot = item
      dist = d
    }
  }
  return { slot, dist }
}

function magnetTarget(px: number, py: number, slots: Slot[]) {
  const { slot, dist } = nearestSlot(px, py, slots)
  if (dist >= MAGNET) return { x: px, y: py, near: null as Slot | null }
  const t = 1 - dist / MAGNET
  const pull = t * t * 0.85
  return {
    x: px + (slot.x - px) * pull,
    y: py + (slot.y - py) * pull,
    near: slot,
  }
}

export function HunminCheonJiInBanner() {
  const panelId = useId()
  const [open, setOpen] = useState(false)

  return (
    <section className="overflow-hidden rounded-sm" aria-label="천지인(天地人)">
      <div className="bg-[#1e3a5f] px-5 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="grid min-w-0 flex-1 grid-cols-3 gap-2 sm:gap-5 lg:gap-8">
            {CHEON_JI_IN_ITEMS.map((item) => (
              <div key={item.hanja} className="flex min-w-0 items-center gap-2 sm:gap-4">
                <span
                  className="w-5 shrink-0 text-center font-jamo text-xl leading-none text-white sm:w-8 sm:text-[1.5rem]"
                  aria-hidden
                >
                  {item.glyph}
                </span>
                <div className="min-w-0">
                  <p className="font-serif text-[13px] leading-snug tracking-wide text-white sm:text-base">
                    {item.title} <span className="text-white/90">{item.hanja}</span>
                  </p>
                  <p className="mt-0.5 hidden font-sans text-[11px] leading-snug tracking-wide text-white/55 sm:block sm:text-xs">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex shrink-0 items-center gap-1.5 font-sans text-[12px] tracking-[0.12em] text-white/70 transition-colors hover:text-white"
          >
            {open ? '접기' : '붙여 보기'}
            <svg
              aria-hidden
              viewBox="0 0 12 12"
              className={`h-3 w-3 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? 'rotate-180' : ''}`}
            >
              <path d="M2 4.2 L6 8 L10 4.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div id={panelId} className="bg-[#fff6ea] px-5 py-6 dark:bg-[#3d342b] sm:px-8 sm:py-7">
            {open ? <AttachStage /> : null}
          </div>
        </div>
      </div>
    </section>
  )
}

function AttachStage() {
  const stageRef = useRef<HTMLDivElement>(null)
  const metricsRef = useRef<Metrics | null>(null)
  const placedRef = useRef<SlotId | null>(null)
  const draggingRef = useRef(false)
  const animsRef = useRef<AnimationPlaybackControls[]>([])
  const timerRef = useRef(0)
  const glyphRef = useRef('ㅗ')
  const genRef = useRef(0)
  const rafRef = useRef(0)
  const targetRef = useRef({ x: 0, y: 0 })
  const grabRef = useRef({ dx: 0, dy: 0 })

  const x = useMotionValue(48)
  const y = useMotionValue(80)

  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [placed, setPlaced] = useState<SlotId | null>(null)
  const [nearId, setNearId] = useState<SlotId | null>(null)
  const [dragging, setDragging] = useState(false)

  const stopAnims = useCallback(() => {
    genRef.current += 1
    animsRef.current.forEach((item) => item.stop())
    animsRef.current = []
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = 0
  }, [])

  const glideTo = useCallback(
    (px: number, py: number, duration: number, after?: () => void) => {
      stopAnims()
      const id = genRef.current
      const dur = prefersReducedMotion() ? 0.01 : duration
      animsRef.current = [
        animate(x, px, { duration: dur, ease: EASE }),
        animate(y, py, { duration: dur, ease: EASE }),
      ]
      timerRef.current = window.setTimeout(() => {
        timerRef.current = 0
        if (genRef.current !== id || draggingRef.current) return
        after?.()
      }, dur * 1000)
    },
    [stopAnims, x, y],
  )

  const setPlacedBoth = useCallback((id: SlotId | null) => {
    placedRef.current = id
    setPlaced(id)
  }, [])

  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    const measure = () => {
      const next = metricsFor(el.clientWidth, el.clientHeight)
      const prev = metricsRef.current
      metricsRef.current = next
      setMetrics(next)
      if (draggingRef.current) return
      if (placedRef.current) {
        const slot = next.slots.find((item) => item.id === placedRef.current)
        if (slot) {
          x.set(slot.x)
          y.set(slot.y)
        }
        return
      }
      const atHome =
        !prev || Math.hypot(x.get() - prev.home.x, y.get() - prev.home.y) < 2
      if (atHome) {
        x.set(next.home.x)
        y.set(next.home.y)
        targetRef.current = next.home
      }
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [x, y])

  const stopLoop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
  }

  const startLoop = () => {
    stopLoop()
    const step = () => {
      const k = 0.22
      x.set(x.get() + (targetRef.current.x - x.get()) * k)
      y.set(y.get() + (targetRef.current.y - y.get()) * k)
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
  }

  const beginDrag = (event: PointerEvent<Element>) => {
    const stage = stageRef.current
    const current = metricsRef.current
    if (!stage || !current) return
    stage.setPointerCapture(event.pointerId)
    draggingRef.current = true
    setDragging(true)
    stopAnims()
    stopLoop()
    const rect = stage.getBoundingClientRect()
    const px = event.clientX - rect.left
    const py = event.clientY - rect.top
    const coarse = window.matchMedia('(pointer: coarse)').matches
    grabRef.current = {
      dx: x.get() - px,
      dy: y.get() - py - (coarse ? 28 : 0),
    }
    if (placedRef.current) setPlacedBoth(null)
    targetRef.current = { x: x.get(), y: y.get() }
    startLoop()
  }

  const moveDrag = (event: PointerEvent<HTMLElement>) => {
    if (!draggingRef.current) return
    const stage = stageRef.current
    const current = metricsRef.current
    if (!stage || !current) return
    const rect = stage.getBoundingClientRect()
    const px = event.clientX - rect.left + grabRef.current.dx
    const py = event.clientY - rect.top + grabRef.current.dy
    const pad = 24
    const clampedX = Math.max(pad, Math.min(rect.width - pad, px))
    const clampedY = Math.max(pad, Math.min(rect.height - pad, py))
    const pulled = magnetTarget(clampedX, clampedY, current.slots)
    targetRef.current = { x: pulled.x, y: pulled.y }
    setNearId(pulled.near?.id ?? null)
  }

  const endDrag = () => {
    if (!draggingRef.current) return
    draggingRef.current = false
    setDragging(false)
    stopLoop()
    setNearId(null)
    const current = metricsRef.current
    if (!current) return
    const { slot, dist } = nearestSlot(x.get(), y.get(), current.slots)
    if (dist < COMMIT) {
      glideTo(slot.x, slot.y, 0.28, () => setPlacedBoth(slot.id))
      return
    }
    setPlacedBoth(null)
    glideTo(current.home.x, current.home.y, 0.4)
  }

  const reset = () => {
    const current = metricsRef.current
    if (!current) return
    draggingRef.current = false
    setDragging(false)
    stopLoop()
    setNearId(null)
    setPlacedBoth(null)
    glideTo(current.home.x, current.home.y, 0.4)
  }

  const placedSlot = metrics?.slots.find((item) => item.id === placed) ?? null
  if (placedSlot) glyphRef.current = placedSlot.glyph
  const onEarth = placed === 'above' || placed === 'below'
  const onPerson = placed === 'left' || placed === 'right'
  const resultAt = onEarth ? metrics?.earth : onPerson ? metrics?.person : null

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={reset}
          className="font-sans text-[12px] tracking-[0.08em] text-ink-muted transition-colors hover:text-ink"
        >
          다시
        </button>
      </div>

      <div
        ref={stageRef}
        className="relative h-52 touch-none select-none sm:h-60"
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {metrics
          ? metrics.slots.map((slot) => (
              <span
                key={slot.id}
                aria-hidden
                className="pointer-events-none absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/45 transition-opacity duration-200"
                style={{
                  left: slot.x,
                  top: slot.y,
                  opacity: nearId === slot.id && !placed ? 1 : 0,
                }}
              />
            ))
          : null}

        <Stroke char="ㅡ" point={metrics?.earth ?? { x: 0, y: 0 }} hidden={!metrics || onEarth} />
        <Stroke char="ㅣ" point={metrics?.person ?? { x: 0, y: 0 }} hidden={!metrics || onPerson} />

        <motion.span
          aria-hidden={!placed}
          onPointerDown={placed ? beginDrag : undefined}
          animate={{ opacity: placed && resultAt ? 1 : 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: EASE }}
          className={`absolute -translate-x-1/2 -translate-y-1/2 font-jamo text-6xl leading-none text-ink sm:text-7xl ${
            placed ? 'cursor-grab touch-none' : 'pointer-events-none'
          }`}
          style={{ left: resultAt?.x ?? 0, top: resultAt?.y ?? 0 }}
        >
          {glyphRef.current}
        </motion.span>

        <DotHandle x={x} y={y} dragging={dragging} hidden={Boolean(placed)} onPointerDown={beginDrag} />
      </div>

      <p className="mt-3 min-h-6 font-serif text-[15px] leading-snug text-ink-soft">
        {placedSlot ? placedSlot.line : '아래아를 ㅡ나 ㅣ에 붙이면 자리가 글자를 정합니다.'}
      </p>
    </div>
  )
}

function Stroke({ char, point, hidden }: { char: string; point: Point; hidden: boolean }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 font-jamo text-6xl leading-none text-ink transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-7xl"
      style={{ left: point.x, top: point.y, opacity: hidden ? 0 : 1 }}
    >
      {char}
    </span>
  )
}

function DotHandle({
  x,
  y,
  dragging,
  hidden,
  onPointerDown,
}: {
  x: MotionValue<number>
  y: MotionValue<number>
  dragging: boolean
  hidden: boolean
  onPointerDown: (event: PointerEvent<Element>) => void
}) {
  return (
    <motion.button
      type="button"
      aria-label="아래아"
      onPointerDown={onPointerDown}
      style={{ left: x, top: y }}
      className={`absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center font-jamo text-6xl leading-none text-ink transition-opacity duration-300 sm:text-7xl ${
        hidden ? 'pointer-events-none opacity-0' : 'cursor-grab opacity-100 active:cursor-grabbing'
      }`}
    >
      <span
        className="transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: dragging ? 'scale(1.06)' : 'scale(1)' }}
      >
        {'\u318D'}
      </span>
    </motion.button>
  )
}
