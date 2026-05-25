'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
import { getV2Messages } from '@/lib/v2-i18n'
import { HUNMIN_PASSAGE_SECTIONS } from '@/data/hunminjeongeumPassages'
import { PassageCard } from '@/legacy/components/showcase/hunminjeongeum/PassageCard'
import { fadeUp } from '@/components/site/effects/v2Motion'

const WATERMARK_SRC = '/images/hunmin/hunminjeongeum_transparent.png'

const SLIDE_EASE = [0.45, 0, 0.25, 1] as const

const passageSlide = {
  enter: (dir: number) => ({ x: dir >= 0 ? '100%' : '-100%' }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: dir >= 0 ? '-100%' : '100%' }),
}

function NavArrow({
  dir,
  disabled,
  onClick,
  className = '',
}: {
  dir: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
  className?: string
}) {
  return (
    <motion.button
      type="button"
      aria-label={dir === 'prev' ? '이전 구절' : '다음 구절'}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.04 } : undefined}
      whileTap={!disabled ? { scale: 0.96 } : undefined}
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/85 text-emerald-900 shadow-lg shadow-emerald-900/10 ring-1 ring-emerald-100/80 transition enabled:hover:bg-white enabled:hover:shadow-xl disabled:cursor-default disabled:bg-white/40 disabled:text-emerald-900/25 disabled:shadow-none sm:h-16 sm:w-16 ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7 sm:h-8 sm:w-8" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        {dir === 'prev' ? <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
    </motion.button>
  )
}

export function HunminCarouselSection() {
  const { lang } = useLang()
  const m = getMessages(lang)
  const v2 = getV2Messages(lang)
  const [sectionIdx, setSectionIdx] = useState(0)
  const [passageIdx, setPassageIdx] = useState(0)
  const [direction, setDirection] = useState(1)

  const passageGroup = HUNMIN_PASSAGE_SECTIONS[sectionIdx]
  const passages = passageGroup.passages
  const currentPassage = passages[passageIdx]
  const sectionTitles = [
    { label: m.hunminInitialTitle, sub: m.hunminInitialSub },
    { label: m.hunminMedialTitle, sub: m.hunminMedialSub },
    { label: m.hunminAppraisalTitle, sub: m.hunminAppraisalSub },
  ]

  const goToPassage = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= passages.length || idx === passageIdx) return
      setDirection(idx > passageIdx ? 1 : -1)
      setPassageIdx(idx)
    },
    [passageIdx, passages.length],
  )

  const goPrev = useCallback(() => goToPassage(passageIdx - 1), [goToPassage, passageIdx])
  const goNext = useCallback(() => goToPassage(passageIdx + 1), [goToPassage, passageIdx])

  const selectSection = (idx: number) => {
    setSectionIdx(idx)
    setPassageIdx(0)
    setDirection(1)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goPrev, goNext])

  return (
    <section
      id="hunmin"
      data-snap
      className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-v2-sage py-16 text-stone-900 sm:py-20 lg:py-24"
    >
      {/* 훈민정음 배경 — 레거시 블렌드 CSS 재사용 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="haeryebon-watermark-feather haeryebon-watermark-feather--mobile absolute"
          style={{ left: '8%', right: '-22%', top: '-30%', bottom: '-30%' }}
        >
          <img
            src={WATERMARK_SRC}
            alt=""
            decoding="async"
            className="hunmin-section-watermark-img h-full w-full scale-[1.55] object-cover object-right sm:scale-[1.35] sm:object-contain sm:object-right"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_0%_100%,rgba(34,197,94,0.1),transparent_55%)]" />

      <div className="v2-section-inner relative z-10 shrink-0">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} custom={0}>
          <p className="v2-label text-emerald-800">{v2.hunminLabel}</p>
          <h2 className="v2-title mt-4">{v2.hunminTitle}</h2>
          <p className="v2-body mt-4 max-w-2xl text-stone-600">{v2.hunminDesc}</p>
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-2">
          {HUNMIN_PASSAGE_SECTIONS.map((s, i) => (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => selectSection(i)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                sectionIdx === i
                  ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                  : 'bg-white/70 text-stone-600 ring-1 ring-emerald-200 hover:bg-white'
              }`}
            >
              {sectionTitles[i]?.label ?? s.classicLabel}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center py-10 sm:py-14 lg:py-16">
        <div className="v2-section-inner">
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
            <NavArrow dir="prev" disabled={passageIdx === 0} onClick={goPrev} className="hidden sm:flex" />

            <div className="relative min-w-0 flex-1">
              <div className="invisible pointer-events-none select-none" aria-hidden>
                <PassageCard passage={currentPassage} embedded prominent />
              </div>
              <div className="absolute inset-0 overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={`${passageGroup.id}-${currentPassage.number}`}
                    custom={direction}
                    variants={passageSlide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.42, ease: SLIDE_EASE }}
                    className="absolute inset-x-0 top-0 w-full"
                  >
                    <PassageCard passage={currentPassage} embedded prominent />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <NavArrow dir="next" disabled={passageIdx >= passages.length - 1} onClick={goNext} className="hidden sm:flex" />
          </div>

          <div className="mt-6 flex items-center justify-center gap-5 sm:hidden">
            <NavArrow dir="prev" disabled={passageIdx === 0} onClick={goPrev} />
            <span className="text-sm tabular-nums text-stone-500">
              {passageIdx + 1} / {passages.length}
            </span>
            <NavArrow dir="next" disabled={passageIdx >= passages.length - 1} onClick={goNext} />
          </div>
        </div>

        <nav
          aria-label="구절 탐색"
          className="v2-section-inner mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-2 sm:mt-12"
        >
          {passages.map((p, i) => {
            const active = i === passageIdx
            return (
              <button
                key={p.number}
                type="button"
                aria-label={`${p.number}번 구절${active ? ' (현재)' : ''}`}
                aria-current={active ? 'true' : undefined}
                onClick={() => goToPassage(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
                  active
                    ? 'w-10 bg-emerald-600 shadow-sm shadow-emerald-700/25 sm:w-12'
                    : 'w-6 bg-emerald-400/40 hover:bg-emerald-500/60 sm:w-7'
                }`}
              />
            )
          })}
        </nav>

        <p className="mt-5 text-center font-serif text-xs tracking-[0.18em] text-stone-400/90 tabular-nums sm:text-sm">
          [{currentPassage.number}] · {passageIdx + 1} / {passages.length}
        </p>
      </div>
    </section>
  )
}
