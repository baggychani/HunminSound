'use client'

import { useCallback, useId, useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  type AnimationPlaybackControls,
  type MotionValue,
} from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const
const MAGNET = 78
const COMMIT = 42

const CHEON_JI_IN_ITEMS = [
  { glyph: '\u00B7', title: '\uC544\uB798\uC544', hanja: '\u5929', desc: '\uB465\uADFC \uC810 \u2014 \uD558\uB298\uC744 \uC0C1\uC9D5' },
  { glyph: '\u3161', title: '\uB545', hanja: '\u5730', desc: '\uD3C9\uD3C9\uD55C \uC120 \u2014 \uB545\uC744 \uC0C1\uC9D5' },
  { glyph: '\u3163', title: '\uC0AC\uB78C', hanja: '\u4EBA', desc: '\uC138\uC6B4 \uC120 \u2014 \uC0AC\uB78C\uC744 \uC0C1\uC9D5' },
] as const

type BaseId = 'earth' | 'person'
type SlotId = 'above' | 'below' | 'left' | 'right'

type Slot = {
  id: SlotId
  x: number
  y: number
  glyph: string
  line: string
  label: string
}

type Metrics = {
  cx: number
  cy: number
  home: { x: number; y: number }
  slots: Slot[]
}

const SLOT_LABEL: Record<SlotId, string> = {
  above: '위',
  below: '아래',
  left: '왼쪽',
  right: '오른쪽',
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function metricsFor(w: number, h: number, base: BaseId): Metrics {
  const cx = w * 0.58
  const cy = h * 0.52
  const gap = Math.min(64, Math.min(w, h) * 0.26)
  const home = { x: Math.max(36, w * 0.14), y: Math.max(36, h * 0.28) }
  const slots: Slot[] =
    base === 'earth'
      ? [
          { id: 'above', x: cx, y: cy - gap, glyph: 'ㅗ', line: 'ㅡ 위에 점을 붙이면 ㅗ', label: SLOT_LABEL.above },
          { id: 'below', x: cx, y: cy + gap, glyph: 'ㅜ', line: 'ㅡ 아래에 점을 붙이면 ㅜ', label: SLOT_LABEL.below },
        ]
      : [
          { id: 'right', x: cx + gap, y: cy, glyph: 'ㅏ', line: 'ㅣ 오른쪽에 점을 붙이면 ㅏ', label: SLOT_LABEL.right },
          { id: 'left', x: cx - gap, y: cy, glyph: 'ㅓ', line: 'ㅣ 왼쪽에 점을 붙이면 ㅓ', label: SLOT_LABEL.left },
        ]
  return { cx, cy, home, slots }
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
  if (dist >= MAGNET) return { x: px, y: py, near: null as Slot | null, commit: false }
  const t = 1 - dist / MAGNET
  const pull = t * t * 0.85
  return {
    x: px + (slot.x - px) * pull,
    y: py + (slot.y - py) * pull,
    near: slot,
    commit: dist < COMMIT,
  }
}

export function HunminCheonJiInBanner() {
  const panelId = useId()
  const [open, setOpen] = useState(false)

  return (
    <section className="overflow-hidden rounded-sm" aria-label="천지인(天地人)">
      <div className="bg-[#1e3a5f] px-5 py-5 sm:px-8 sm:py-6">
        <div className="grid gap-6 sm:grid-cols-3 sm:gap-5 lg:gap-8">
          {CHEON_JI_IN_ITEMS.map((item) => (
            <div key={item.hanja} className="flex min-w-0 items-center gap-3.5 sm:gap-4">
              <span
                className="w-7 shrink-0 text-center font-jamo text-[1.35rem] leading-none text-white sm:w-8 sm:text-[1.5rem]"
                aria-hidden
              >
                {item.glyph}
              </span>
              <div className="min-w-0">
                <p className="font-serif text-[15px] leading-snug tracking-wide text-white sm:text-base">
                  {item.title} <span className="text-white/90">{item.hanja}</span>
                </p>
                <p className="mt-0.5 font-sans text-[11px] leading-snug tracking-wide text-white/55 sm:text-xs">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-end border-t border-white/15 pt-3.5">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex items-center gap-2 font-sans text-[12px] tracking-[0.12em] text-white/70 transition-colors hover:text-white"
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
          <div id={panelId} className="border-t border-white/10 bg-hanji px-5 py-6 sm:px-8 sm:py-7">
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
  const glyphRef = useRef('ㅗ')
  const genRef = useRef(0)
  const rafRef = useRef(0)
  const targetRef = useRef({ x: 0, y: 0 })
  const grabRef = useRef({ dx: 0, dy: 0 })

  const x = useMotionValue(36)
  const y = useMotionValue(36)

  const [base, setBase] = useState<BaseId>('earth')
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [placed, setPlaced] = useState<SlotId | null>(null)
  const [nearId, setNearId] = useState<SlotId | null>(null)
  const [dragging, setDragging] = useState(false)

  const stopAnims = useCallback(() => {
    genRef.current += 1
    animsRef.current.forEach((item) => item.stop())
    animsRef.current = []
  }, [])

  const glideTo = useCallback(
    (px: number, py: number, duration: number, after?: () => void) => {
      stopAnims()
      const id = genRef.current
      const dur = prefersReducedMotion() ? 0.01 : duration
      const ax = animate(x, px, { duration: dur, ease: EASE })
      const ay = animate(y, py, { duration: dur, ease: EASE })
      animsRef.current = [ax, ay]
      Promise.all([ax.finished, ay.finished])
        .then(() => {
          if (genRef.current !== id || draggingRef.current) return
          after?.()
        })
        .catch(() => {})
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
      const next = metricsFor(el.clientWidth, el.clientHeight, base)
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
      if (!prev) {
        x.set(next.home.x)
        y.set(next.home.y)
        targetRef.current = next.home
      }
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [base, x, y])

  useLayoutEffect(() => {
    const next = metricsRef.current
    if (!next || draggingRef.current) return
    setPlacedBoth(null)
    setNearId(null)
    glideTo(next.home.x, next.home.y, 0.36)
  }, [base, glideTo, setPlacedBoth])

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
    const pad = 20
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

  const placeAt = (slot: Slot) => {
    draggingRef.current = false
    setDragging(false)
    stopLoop()
    setNearId(null)
    glideTo(slot.x, slot.y, 0.32, () => setPlacedBoth(slot.id))
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
  const idleLine =
    base === 'earth'
      ? '아래아를 끌어 ㅡ 위나 아래에 놓습니다.'
      : '아래아를 끌어 ㅣ 왼쪽이나 오른쪽에 놓습니다.'

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-5">
          <BaseButton active={base === 'earth'} onClick={() => setBase('earth')}>
            땅 ㅡ
          </BaseButton>
          <BaseButton active={base === 'person'} onClick={() => setBase('person')}>
            사람 ㅣ
          </BaseButton>
        </div>
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
        className="relative h-56 touch-none select-none sm:h-64"
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {metrics
          ? metrics.slots.map((slot) => (
              <span
                key={slot.id}
                aria-hidden
                className="pointer-events-none absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/50 transition-opacity duration-200"
                style={{
                  left: slot.x,
                  top: slot.y,
                  opacity: nearId === slot.id && !placed ? 1 : 0,
                }}
              />
            ))
          : null}

        {metrics ? (
          <span
            aria-hidden
            className="pointer-events-none absolute bg-ink transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              left: metrics.cx,
              top: metrics.cy,
              width: base === 'earth' ? 76 : 3,
              height: base === 'earth' ? 3 : 76,
              transform: 'translate(-50%, -50%)',
              opacity: placed ? 0 : 1,
            }}
          />
        ) : (
          <span
            aria-hidden
            className={`pointer-events-none absolute left-[58%] top-[52%] -translate-x-1/2 -translate-y-1/2 bg-ink ${
              base === 'earth' ? 'h-[3px] w-[76px]' : 'h-[76px] w-[3px]'
            }`}
          />
        )}

        <motion.span
          aria-hidden={!placed}
          onPointerDown={placed ? beginDrag : undefined}
          animate={{ opacity: placed ? 1 : 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: EASE }}
          className={`absolute -translate-x-1/2 -translate-y-1/2 font-jamo text-6xl leading-none text-ink sm:text-7xl ${
            placed ? 'cursor-grab touch-none' : 'pointer-events-none'
          }`}
          style={{ left: metrics?.cx ?? 0, top: metrics?.cy ?? 0 }}
        >
          {glyphRef.current}
        </motion.span>

        <DotHandle x={x} y={y} dragging={dragging} hidden={Boolean(placed)} onPointerDown={beginDrag} />
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <p className="min-h-6 font-serif text-[15px] leading-snug text-ink-soft">
          {placedSlot ? placedSlot.line : idleLine}
        </p>
        <div className="flex items-center gap-4">
          {(base === 'earth'
            ? [
                { id: 'above' as const, label: '위' },
                { id: 'below' as const, label: '아래' },
              ]
            : [
                { id: 'right' as const, label: '오른쪽' },
                { id: 'left' as const, label: '왼쪽' },
              ]
          ).map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => {
                const found = metricsRef.current?.slots.find((item) => item.id === slot.id)
                if (found) placeAt(found)
              }}
              className={`font-sans text-[12px] tracking-[0.08em] transition-colors ${
                placed === slot.id ? 'text-ink' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <span
                className={`mb-1 block h-px origin-left transition-transform duration-300 ${
                  placed === slot.id ? 'scale-x-100 bg-gold' : 'scale-x-0 bg-gold'
                }`}
              />
              {slot.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function BaseButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`font-serif text-[15px] tracking-wide transition-colors ${active ? 'text-ink' : 'text-ink-muted hover:text-ink-soft'}`}
    >
      <span
        className={`mb-1.5 block h-px w-full origin-left bg-gold transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${active ? 'scale-x-100' : 'scale-x-0'}`}
      />
      {children}
    </button>
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
      className={`absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center transition-opacity duration-300 ${
        hidden ? 'pointer-events-none opacity-0' : 'cursor-grab opacity-100 active:cursor-grabbing'
      }`}
    >
      <span
        className="block h-3 w-3 rounded-full bg-ink transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: dragging ? 'scale(1.08)' : 'scale(1)' }}
      />
    </motion.button>
  )
}
