'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
import { HUNMIN_PASSAGE_SECTIONS } from '@/data/hunminjeongeumPassages'
import { PassageCard } from './hunminjeongeum/PassageCard'
import { HunminSectionParallaxAside } from './hunminjeongeum/HunminSectionParallaxAside'
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

const INITIAL_SECTION_IMAGE = '/images/hunmin/sejong-statue-gwanghwamun.jpg'

/** 장(章) 번호 — 한자 표기, 언어 무관 장식 */
const CHAPTER_ORDINALS = ['第一章', '第二章', '第三章'] as const

/** 페이지 넘김 전환 — 3D 책장: 다음 장은 오른쪽에서 넘어오고, 이전 장은 왼쪽에서 */
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

/** 붉은 낙관(落款) — 옛 책의 도장 장식 */
function SealStamp() {
  return (
    <span
      aria-hidden
      className="inline-flex h-11 w-11 rotate-3 select-none items-center justify-center rounded-[3px] bg-[#a63a2e]/90 shadow-[0_1px_4px_rgb(0_0_0/0.18)] dark:bg-[#b04437]/90"
    >
      <span className="font-jamo text-[15px] leading-none tracking-tight text-[#fdf6ec]" lang="ko">
        正音
      </span>
    </span>
  )
}

/** 장 사이 구분 장식 — ◇ 문양 */
function ChapterEndMark() {
  return (
    <div aria-hidden className="my-14 flex items-center justify-center gap-4 sm:my-16">
      <span className="h-px w-14 bg-hanji-border" />
      <span className="font-serif text-sm text-ink-muted/70 select-none" lang="zh-Hant">
        終
      </span>
      <span className="h-px w-14 bg-hanji-border" />
    </div>
  )
}

export function HunminjeongeumPageClient() {
  const { lang } = useLang()
  const m = getMessages(lang)

  const [chapter, setChapter] = useState(0)
  const [direction, setDirection] = useState(1)
  const readerTopRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 700], [0, -90])
  const bgOpacity = useTransform(scrollY, [0, 500], [1, 0.4])

  /* 장 본문 읽기 진행률 — sticky 탭바 아래 금색 실 */
  const { scrollYProgress } = useScroll({
    target: bodyRef,
    offset: ['start 0.35', 'end end'],
  })
  const readProgress = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.4 })

  const sectionLabels: Record<
    (typeof HUNMIN_PASSAGE_SECTIONS)[number]['id'],
    { title: string; sub: string }
  > = {
    initial: { title: m.hunminInitialTitle, sub: m.hunminInitialSub },
    medial: { title: m.hunminMedialTitle, sub: m.hunminMedialSub },
    appraisal: { title: m.hunminAppraisalTitle, sub: m.hunminAppraisalSub },
  }

  const goToChapter = (idx: number) => {
    if (idx === chapter || idx < 0 || idx >= HUNMIN_PASSAGE_SECTIONS.length) return
    setDirection(idx > chapter ? 1 : -1)
    setChapter(idx)
    readerTopRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }

  const section = HUNMIN_PASSAGE_SECTIONS[chapter]
  const label = sectionLabels[section.id]
  const firstNum = section.passages[0]?.number
  const lastNum = section.passages[section.passages.length - 1]?.number
  const prevSection = chapter > 0 ? HUNMIN_PASSAGE_SECTIONS[chapter - 1] : null
  const nextSection =
    chapter < HUNMIN_PASSAGE_SECTIONS.length - 1 ? HUNMIN_PASSAGE_SECTIONS[chapter + 1] : null

  return (
    <>
      {/* ── 헤더 (책 표지) ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden pt-16 pb-12 border-b border-hanji-border mb-6 sm:mb-8">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ fontSize: 'clamp(3.25rem, 11vw, 8.5rem)', y: bgY, opacity: bgOpacity }}
          className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none font-serif leading-none text-ink/[0.028] dark:text-ink/[0.038]"
          aria-hidden
        >
          訓民正音
        </motion.span>

        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="font-sans text-[11px] uppercase tracking-[0.22em] text-ink-muted/90 mb-6"
        >
          {m.hunminjeongeumCaption}
        </motion.p>

        <h1
          className="font-jamo leading-none text-ink mb-6 flex"
          style={{ fontSize: 'clamp(3rem, 9vw, 5.5rem)' }}
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
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="font-serif text-xl sm:text-2xl text-ink-soft mb-8"
        >
          {m.hunminjeongeumSubtitle}
        </motion.p>

        <motion.p
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="max-w-2xl break-keep font-sans text-sm leading-relaxed text-ink-muted [overflow-wrap:break-word]"
        >
          {m.hunminjeongeumPageDesc}
        </motion.p>

        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-10 flex items-end gap-4 sm:gap-6"
        >
          {(['ㄱ', 'ㄴ', 'ㅁ', 'ㅅ', 'ㅇ'] as const).map((glyph, i) => (
            <motion.span
              key={glyph}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="font-jamo text-3xl sm:text-4xl text-ink-muted/70 dark:text-ink-muted/50 select-none"
              dir="ltr"
              lang="ko"
            >
              {glyph}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95 }}
            className="font-sans text-xl text-ink-muted/40 pb-1 select-none"
          >
            …
          </motion.span>
        </motion.div>
      </div>

      {/* ── 일러두기 ──────────────────────────────────────────────────── */}
      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show" className="mb-10 sm:mb-12">
        <EditorialNote />
      </motion.div>

      {/* ── 책갈피 리본 탭 (sticky) — 헤더에서 늘어뜨린 가름끈 ─────────── */}
      <div ref={readerTopRef} className="home-scroll-margin" />
      <div className="sticky top-[var(--site-header-h,4rem)] z-30 -mx-6 mb-12 sm:-mx-10 lg:-mx-14 sm:mb-16">
        {/* 배경 바 — 리본 상단만 덮고, 리본 꼬리는 아래로 삐져나옴 */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[3.35rem] border-b border-hanji-border/70 bg-hanji/92 backdrop-blur-md"
        />
        {/* 읽기 진행 실 — 붉은 가름끈이 차오르듯 */}
        <motion.span
          aria-hidden
          style={{ scaleX: readProgress }}
          className="absolute inset-x-0 top-0 z-10 h-[2px] origin-left bg-gradient-to-r from-gold via-gold-light to-[#c26a4a]"
        />

        <div className="relative flex items-start justify-between gap-4 px-6 sm:px-10 lg:px-14">
          <div
            className="scrollbar-none flex min-w-0 items-start gap-2 overflow-x-auto pe-2 sm:gap-3"
            role="tablist"
            aria-label="훈민정음 장 목차"
          >
            {HUNMIN_PASSAGE_SECTIONS.map((s, idx) => {
              const isActive = idx === chapter
              const sLabel = sectionLabels[s.id]
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => goToChapter(idx)}
                  style={{
                    clipPath:
                      'polygon(0 0, 100% 0, 100% calc(100% - 9px), 50% 100%, 0 calc(100% - 9px))',
                  }}
                  className={`relative flex shrink-0 flex-col items-center gap-1 px-4 pt-2.5 transition-all duration-300 sm:px-5 ${
                    isActive
                      ? 'bg-[#a6432e] pb-6 text-[#fdf3e7] dark:bg-[#93402c]'
                      : 'bg-hanji-warm pb-4 text-ink-muted hover:bg-hanji-hover hover:pb-5 hover:text-ink-soft dark:bg-hanji-hover/70 dark:hover:bg-hanji-hover'
                  }`}
                >
                  <span
                    className={`font-serif text-[10.5px] leading-none tracking-[0.2em] ${
                      isActive ? 'text-[#f3d9b8]' : 'text-ink-muted/70'
                    }`}
                    lang="zh-Hant"
                    aria-hidden
                  >
                    {s.classicLabel}
                  </span>
                  <span className="whitespace-nowrap font-sans text-[12.5px] leading-tight sm:text-[13px]">
                    {sLabel.title}
                  </span>
                </button>
              )
            })}
          </div>

          {/* 장 진행 표기 — 一/三 식 */}
          <span
            aria-hidden
            className="hidden pt-[1.05rem] font-serif text-xs leading-none tracking-[0.25em] text-ink-muted/70 sm:block"
            lang="zh-Hant"
          >
            {['一', '二', '三'][chapter]} / 三
          </span>
        </div>
      </div>

      {/* ── 장 본문 — 3D 페이지 넘김 전환 ──────────────────────────────── */}
      <div style={{ perspective: '1800px' }}>
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={section.id}
          custom={direction}
          variants={pageTurn}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: 'preserve-3d', transformOrigin: direction >= 0 ? 'left center' : 'right center' }}
        >
          {/* 목판본 책 페이지 — 이중 광곽 안에 장 전체가 들어감 */}
          <div className="book-page rounded-[2px] px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            {/* 판심(版心) — 옛 책 가운데 접힘 부분의 서명 + 어미 문양 */}
            <div aria-hidden className="mb-10 flex flex-col items-center gap-1.5 select-none sm:mb-12">
              <span className="book-fishtail" />
              <span className="font-serif text-[10.5px] tracking-[0.5em] text-ink-muted/60" lang="zh-Hant">
                訓民正音
              </span>
              <span className="book-fishtail rotate-180" />
            </div>

            {/* 장 표지 */}
            <header className="relative mb-14 overflow-hidden sm:mb-16" aria-labelledby={`hunmin-${section.id}-title`}>
              {/* 세로쓰기 대형 한자 — 옛 책 표지의 제첨(題簽) 느낌 */}
              <span
                aria-hidden
                className="pointer-events-none absolute -top-2 right-0 hidden select-none font-serif leading-none text-ink/[0.06] dark:text-ink/[0.09] [writing-mode:vertical-rl] lg:block"
                style={{ fontSize: 'clamp(4rem, 8vw, 7rem)' }}
                lang="zh-Hant"
              >
                {section.classicLabel}
              </span>

              <div className="flex items-start gap-5 sm:gap-7">
                <SealStamp />
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
                  <p className="mt-2 font-sans text-xs tracking-[0.12em] text-ink-muted/85 sm:text-[13px]">
                    {label.sub}
                  </p>
                  {firstNum && lastNum ? (
                    <p className="mt-4 font-serif text-[11.5px] tracking-[0.14em] text-ink-muted/70">
                      [{firstNum}] – [{lastNum}] · {section.passages.length}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-8 h-px w-full bg-gradient-to-r from-hanji-border via-hanji-border/40 to-transparent" />
            </header>

            {/* 구절 목록 (+ 초성 장은 우측 패럴랙스 이미지) */}
            <div
              ref={bodyRef}
              className={
                section.id === 'initial'
                  ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(11rem,17rem)] lg:items-start lg:gap-x-10 xl:grid-cols-[minmax(0,1fr)_minmax(13rem,19rem)] xl:gap-x-14'
                  : undefined
              }
            >
              <div className="min-w-0 space-y-16 sm:space-y-20">
                {section.passages.map((p) => (
                  <PassageCard key={p.number} passage={p} />
                ))}
              </div>
              {section.id === 'initial' ? (
                <HunminSectionParallaxAside src={INITIAL_SECTION_IMAGE} alt="광화문 세종대왕 동상" />
              ) : null}
            </div>

            <ChapterEndMark />

            {/* 책 하단 장수(張數) — 옛 책의 쪽 표기 */}
            <p aria-hidden className="-mb-2 text-center font-serif text-[11px] tracking-[0.4em] text-ink-muted/55 select-none" lang="zh-Hant">
              第{['一', '二', '三'][chapter]}張
            </p>
          </div>

          {/* 책장 넘기기 — 이전 / 다음 장 */}
          <nav
            aria-label="장 이동"
            className="mt-8 mb-24 grid grid-cols-1 gap-3 sm:mt-10 sm:mb-32 sm:grid-cols-2 sm:gap-4"
          >
            {prevSection ? (
              <button
                type="button"
                onClick={() => goToChapter(chapter - 1)}
                className="group flex items-center justify-between gap-4 rounded-sm border border-hanji-border/80 bg-hanji-card px-5 py-4 text-start transition-all hover:border-gold/40 hover:shadow-[0_2px_12px_rgb(var(--ink-rgb)/0.07)] sm:px-6 sm:py-5"
              >
                <span
                  aria-hidden
                  className="text-gold transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1"
                >
                  ←
                </span>
                <span className="min-w-0 text-end">
                  <span className="block font-serif text-[11px] tracking-[0.2em] text-ink-muted/70" lang="zh-Hant" aria-hidden>
                    {CHAPTER_ORDINALS[chapter - 1]}
                  </span>
                  <span className="mt-1 block truncate font-sans text-sm text-ink group-hover:text-ink-accent">
                    {sectionLabels[prevSection.id].title}
                  </span>
                </span>
              </button>
            ) : (
              <span aria-hidden className="hidden sm:block" />
            )}

            {nextSection ? (
              <button
                type="button"
                onClick={() => goToChapter(chapter + 1)}
                className="group flex items-center justify-between gap-4 rounded-sm border border-hanji-border/80 bg-hanji-card px-5 py-4 text-start transition-all hover:border-gold/40 hover:shadow-[0_2px_12px_rgb(var(--ink-rgb)/0.07)] sm:px-6 sm:py-5"
              >
                <span className="min-w-0">
                  <span className="block font-serif text-[11px] tracking-[0.2em] text-ink-muted/70" lang="zh-Hant" aria-hidden>
                    {CHAPTER_ORDINALS[chapter + 1]}
                  </span>
                  <span className="mt-1 block truncate font-sans text-sm text-ink group-hover:text-ink-accent">
                    {sectionLabels[nextSection.id].title}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="text-gold transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                >
                  →
                </span>
              </button>
            ) : null}
          </nav>
        </motion.div>
      </AnimatePresence>
      </div>
    </>
  )
}
