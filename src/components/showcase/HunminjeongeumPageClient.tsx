'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
import { HUNMIN_PASSAGE_SECTIONS } from '@/data/hunminjeongeumPassages'
import { PassageCard } from './hunminjeongeum/PassageCard'
import { EditorialNote } from './hunminjeongeum/EditorialNote'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
}

const TITLE_CHARS = ['훈', '민', '정', '음']

const STEP_BUTTON_CLASS =
  'items-center justify-center rounded-full border border-hanji-border bg-hanji-card/90 text-base text-ink-soft shadow-sm backdrop-blur transition-all hover:border-gold/50 hover:text-gold disabled:pointer-events-none disabled:opacity-25'

/** 장(章) 번호 — 한자 표기, 언어 무관 장식 */
const CHAPTER_ORDINALS = ['第一章', '第二章', '第三章'] as const

/* 3D 책장 넘김 전환 — 시도 보관 (2026-10-01: 훈민정음 리더는 깔끔하게 그냥 전환)
const pageTurn = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? 56 : -56,
    rotateY: dir >= 0 ? -7 : 7,
  }),
  center: { opacity: 1, x: 0, rotateY: 0 },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? -56 : 56,
    rotateY: dir >= 0 ? 7 : -7,
  }),
}
*/

/** 장 사이 구분 장식 — 보관 (2026-10-01: 본문 하단 장식 제거)
function ChapterEndMark() {
  return (
    <div aria-hidden className="my-14 flex items-center justify-center gap-4 sm:my-16">
      <span className="h-px w-14 bg-hanji-border" />
      <span className="font-serif text-sm text-ink-muted select-none" lang="zh-Hant">
        終
      </span>
      <span className="h-px w-14 bg-hanji-border" />
    </div>
  )
}
*/

export function HunminjeongeumPageClient() {
  const { lang } = useLang()
  const m = getMessages(lang)

  const [chapter, setChapter] = useState(0)
  /* 장 안에서 한 번에 한 문장만 — 고정 박스에서 넘겨 보기 */
  const [passageIdx, setPassageIdx] = useState(0)

  const sectionLabels: Record<
    (typeof HUNMIN_PASSAGE_SECTIONS)[number]['id'],
    { title: string }
  > = {
    initial: { title: m.hunminInitialTitle },
    medial: { title: m.hunminMedialTitle },
    appraisal: { title: m.hunminAppraisalTitle },
  }

  /* 장 이동 — 스크롤 위치는 그대로 유지 */
  const goToChapter = (idx: number) => {
    if (idx === chapter || idx < 0 || idx >= HUNMIN_PASSAGE_SECTIONS.length) return
    setChapter(idx)
    setPassageIdx(0)
  }

  /* 같은 장 안에서 문장 이동 — 스크롤 위치는 그대로 유지 */
  const goToPassage = (idx: number) => {
    const total = section.passages.length
    if (idx === passageIdx || idx < 0 || idx >= total) return
    setPassageIdx(idx)
  }

  /* 한 문장씩 앞뒤로 — 장 끝에서는 다음(이전) 장으로 이어진다 */
  const step = useCallback(
    (delta: 1 | -1) => {
      const total = HUNMIN_PASSAGE_SECTIONS[chapter].passages.length
      const next = passageIdx + delta
      if (next >= 0 && next < total) {
        setPassageIdx(next)
        return
      }
      const nextChapter = chapter + delta
      if (nextChapter < 0 || nextChapter >= HUNMIN_PASSAGE_SECTIONS.length) return
      setChapter(nextChapter)
      setPassageIdx(delta > 0 ? 0 : HUNMIN_PASSAGE_SECTIONS[nextChapter].passages.length - 1)
    },
    [chapter, passageIdx],
  )

  /* 발표용 리모컨·키보드 — ←/→ 로 문장 넘기기 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
      if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step])

  /* 모바일 좌우 스와이프 — 세로 스크롤과 한자 탭은 건드리지 않게 가로가 확실할 때만 */
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    step(dx < 0 ? 1 : -1)
  }

  const section = HUNMIN_PASSAGE_SECTIONS[chapter]
  const label = sectionLabels[section.id]
  const isFirst = chapter === 0 && passageIdx === 0
  const isLast =
    chapter === HUNMIN_PASSAGE_SECTIONS.length - 1 && passageIdx === section.passages.length - 1

  return (
    <>
      {/* ── 헤더 (책 표지) ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden pt-16 pb-10 border-b border-hanji-border mb-6 sm:mb-8">
        <h1
          className="font-jamo leading-none text-ink mb-6 flex"
          style={{ fontSize: 'clamp(2.35rem, 7vw, 4.1rem)' }}
          aria-label="훈민정음"
        >
          {TITLE_CHARS.map((char, i) => (
            <motion.span
              key={char}
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                delay: 0.12 + i * 0.1,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              aria-hidden
            >
              {char}
            </motion.span>
          ))}
        </h1>

        <motion.p
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="max-w-2xl break-keep font-sans text-sm leading-relaxed text-ink-muted [overflow-wrap:break-word]"
        >
          {m.hunminjeongeumPageDesc}
        </motion.p>
      </div>

      {/* ── 본문 — 왼쪽 장 목차 + 오른쪽 리더 ─────────────────────────── */}
      <div className="lg:grid lg:grid-cols-[9.5rem_minmax(0,1fr)] lg:gap-x-6 xl:gap-x-8">
        {/* 장 목차 — 모바일은 가로, 데스크톱은 왼쪽 세로 */}
        <nav aria-label={m.hunminChapterNav} className="mb-10 lg:mb-0">
          <div className="scrollbar-none flex gap-2 overflow-x-auto lg:sticky lg:top-[calc(var(--site-header-h,4rem)+1.5rem)] lg:flex-col lg:overflow-visible">
            {HUNMIN_PASSAGE_SECTIONS.map((s, idx) => {
              const isActive = idx === chapter
              const sLabel = sectionLabels[s.id]
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => goToChapter(idx)}
                  className={`flex shrink-0 items-center gap-2.5 rounded-sm border px-4 py-3 text-start transition-all sm:px-4 lg:w-full ${
                    isActive
                      ? 'border-[#a6432e] bg-[#a6432e] text-[#fdf3e7] dark:border-[#93402c] dark:bg-[#93402c]'
                      : 'border-hanji-border/80 bg-hanji-card text-ink-muted hover:border-gold/40 hover:text-ink'
                  }`}
                >
                  <span className="whitespace-nowrap break-keep font-sans text-sm leading-tight lg:whitespace-normal">
                    {sLabel.title}
                  </span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* ── 장 본문 ───────────────────────────────────────────────── */}
        <div className="min-w-0">
          {/* 목판본 책 페이지 — 안쪽이 바깥 한지보다 밝은 종이 워시 */}
          <div className="book-page rounded-[2px] bg-gradient-to-b from-white/70 via-white/20 to-white/45 px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14 dark:from-white/[0.07] dark:via-white/[0.02] dark:to-white/[0.05]">
            {/* 장 표지 — 본문과 같은 안쪽 들여쓰기(좌우 버튼 폭 제외) */}
            <header className="relative mb-14 overflow-hidden sm:mb-16 sm:px-16" aria-labelledby={`hunmin-${section.id}-title`}>
              <div className="min-w-0">
                <p className="font-serif text-[13px] tracking-[0.3em] text-gold" lang="zh-Hant" aria-hidden>
                  {CHAPTER_ORDINALS[chapter]}
                </p>
                <h2
                  id={`hunmin-${section.id}-title`}
                  className="mt-2 font-jamo text-3xl leading-tight tracking-tight text-ink sm:text-4xl"
                  lang="ko"
                >
                  {label.title}
                </h2>
              </div>

              <div className="mt-8 h-px w-full bg-gradient-to-r from-hanji-border via-hanji-border/40 to-transparent" />
            </header>

            {/* 구절 리더 — 한 번에 한 문장만 고정 박스에 */}
            <div>
              <div className="min-w-0">
                {/* 고정 박스 + 좌우 독립 버튼 — 데스크톱은 박스 양 끝, 모바일은 박스 아래 한 줄 */}
                <div className="relative touch-pan-y" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                  {/* 새 문장만 옅게 나타나기 — 위치 계산 없음, 튈 자리 없음.
                      안쪽 아래 여백(pb-8): 짧은 문장은 min-h에 가려 그대로,
                      min-h를 넘는 긴 문장만 번호줄과 여유가 생긴다 */}
                  <div className="min-h-[19rem] pb-8 sm:min-h-[20rem] sm:px-16">
                    <div
                      key={section.passages[passageIdx]?.number ?? passageIdx}
                      className="passage-fade"
                    >
                      {section.passages[passageIdx] ? (
                        <PassageCard passage={section.passages[passageIdx]} />
                      ) : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    disabled={isFirst}
                    aria-label={m.hunminPrevPassage}
                    className={`absolute left-0 top-[10rem] hidden h-11 w-11 -translate-y-1/2 sm:flex ${STEP_BUTTON_CLASS}`}
                  >
                    <span aria-hidden>←</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    disabled={isLast}
                    aria-label={m.hunminNextPassage}
                    className={`absolute right-0 top-[10rem] hidden h-11 w-11 -translate-y-1/2 sm:flex ${STEP_BUTTON_CLASS}`}
                  >
                    <span aria-hidden>→</span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-5 sm:hidden">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    disabled={isFirst}
                    aria-label={m.hunminPrevPassage}
                    className={`flex h-11 w-11 ${STEP_BUTTON_CLASS}`}
                  >
                    <span aria-hidden>←</span>
                  </button>
                  <span className="min-w-[3.5rem] text-center font-serif text-xs tracking-[0.06em] text-ink-muted" aria-hidden>
                    {passageIdx + 1} / {section.passages.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    disabled={isLast}
                    aria-label={m.hunminNextPassage}
                    className={`flex h-11 w-11 ${STEP_BUTTON_CLASS}`}
                  >
                    <span aria-hidden>→</span>
                  </button>
                </div>

                {/* 번호 점프 — 원하는 문장으로 바로 이동 */}
                <div className="mt-6 flex flex-wrap justify-center gap-1.5" role="group" aria-label={m.hunminJumpToPassage}>
                  {section.passages.map((p, i) => {
                    const isActive = i === passageIdx
                    return (
                      <button
                        key={p.number}
                        type="button"
                        onClick={() => goToPassage(i)}
                        aria-current={isActive ? 'true' : undefined}
                        className={`rounded-sm border px-2.5 py-1.5 font-serif text-[11.5px] tracking-[0.06em] transition-colors ${
                          isActive
                            ? 'border-gold/60 bg-gold/[0.08] text-ink-accent'
                            : 'border-hanji-border/70 text-ink-muted hover:border-gold/40 hover:text-ink'
                        }`}
                      >
                        {p.number}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 일러두기 — 본문 박스 바깥 아래, 여백 넉넉히 ─────────────── */}
      <div className="mt-20 mb-24 sm:mt-24 sm:mb-32">
        <EditorialNote />
      </div>

      {/* 리더는 한 번에 한 문장만 그리므로, 검색엔진용으로 전 문장을 HTML에만 남긴다 */}
      <div hidden>
        {HUNMIN_PASSAGE_SECTIONS.map((s) => (
          <section key={s.id}>
            <h2>{sectionLabels[s.id].title}</h2>
            {s.passages.map((p) => (
              <p key={p.number}>
                {`[${p.number}] ${p.originalText} ${p.korean}`}
              </p>
            ))}
          </section>
        ))}
      </div>
    </>
  )
}
