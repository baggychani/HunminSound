'use client'

import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'

export type ChartViewMode = 'hunmin' | 'modern'

interface PhoneticsViewToggleProps {
  className?: string
  /** 둘 다 주면 제어 컴포넌트 (자음 페이지). 생략 시 내부 state (모음 페이지 등). */
  mode?: ChartViewMode
  onModeChange?: (m: ChartViewMode) => void
}

/** 훈민정음 제자해 ↔ 현대 음성학 전환 (자음/모음 상단) */
export function PhoneticsViewToggle({ className = '', mode, onModeChange }: PhoneticsViewToggleProps) {
  const { lang } = useLang()
  const m = getMessages(lang)
  const [uncontrolledMode, setUncontrolledMode] = useState<ChartViewMode>('modern')
  const controlled = mode !== undefined && onModeChange !== undefined
  const activeMode = controlled ? mode : uncontrolledMode
  const setActiveMode = controlled ? onModeChange : setUncontrolledMode
  const trackRef = useRef<HTMLDivElement>(null)
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)

  const measure = useCallback(() => {
    const t = trackRef.current
    if (!t) return
    const pad = 4
    const gap = 4
    const inner = t.clientWidth - pad * 2
    const pillW = Math.max(0, (inner - gap) / 2)
    const leftH = pad
    const leftM = pad + pillW + gap
    setPill({
      left: activeMode === 'hunmin' ? leftH : leftM,
      width: pillW,
    })
  }, [activeMode])

  useLayoutEffect(() => {
    measure()
  }, [measure, lang])

  useLayoutEffect(() => {
    const t = trackRef.current
    if (!t || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => measure())
    ro.observe(t)
    return () => ro.disconnect()
  }, [measure])

  const changeMode = useCallback(
    (nextMode: ChartViewMode) => {
      if (nextMode === activeMode) return
      setActiveMode(nextMode)
    },
    [activeMode, setActiveMode],
  )

  return (
    <div className={`mx-auto w-full max-w-xl ${className}`}>
      <div
        ref={trackRef}
        role="tablist"
        aria-label={m.chartViewToggleAria}
        className="relative flex h-[52px] w-full select-none rounded-full border border-hanji-border bg-hanji/80 p-1 shadow-[inset_0_1px_2px_rgb(28_25_23/0.05)] dark:bg-hanji-warm/5 dark:shadow-[inset_0_1px_2px_rgb(0_0_0/0.25)]"
      >
        {pill !== null ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-1 rounded-full bg-hanji-warm shadow-md ring-1 ring-hanji-border/55 transition-[left,width] duration-200 ease-out dark:bg-hanji-hover dark:ring-hanji-border/50"
            style={{ left: pill.left, width: pill.width }}
          />
        ) : null}
        <button
          type="button"
          role="tab"
          aria-selected={activeMode === 'hunmin'}
          tabIndex={0}
          onClick={() => changeMode('hunmin')}
          className={`relative z-10 flex flex-1 items-center justify-center rounded-full px-2 text-center text-sm transition-colors duration-200 sm:text-[15px] ${
            activeMode === 'hunmin' ? 'text-ink' : 'text-ink-muted hover:text-ink-soft'
          }`}
        >
          <span className="font-serif tracking-tight">{m.chartViewHunmin}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeMode === 'modern'}
          tabIndex={0}
          onClick={() => changeMode('modern')}
          className={`relative z-10 flex flex-1 items-center justify-center rounded-full px-2 text-center text-sm transition-colors duration-200 sm:text-[15px] ${
            activeMode === 'modern' ? 'text-ink' : 'text-ink-muted hover:text-ink-soft'
          }`}
        >
          <span className="font-serif tracking-tight">{m.chartViewModern}</span>
        </button>
      </div>
    </div>
  )
}
