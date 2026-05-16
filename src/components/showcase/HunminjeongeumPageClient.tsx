'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'

/* ── 섹션 아이콘·한자 글리프 (언어 무관) ────────────────────────────── */
const SECTION_META = [
  { id: 'sec1', icon: '·',  gloss: '三才' },
  { id: 'sec2', icon: 'ㅇ', gloss: '象形' },
  { id: 'sec3', icon: 'ㅡ', gloss: '合成' },
  { id: 'sec4', icon: '音', gloss: '音節' },
] as const

/* ── 애니메이션 variants ──────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
}

const TITLE_CHARS = ['훈', '민', '정', '음']

export function HunminjeongeumPageClient() {
  const { lang } = useLang()
  const m = getMessages(lang)

  /* ── 스크롤 패럴랙스 ─────────────────────────────────────────── */
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 700], [0, -90])
  const bgOpacity = useTransform(scrollY, [0, 500], [1, 0.4])

  const sections = [
    { ...SECTION_META[0], title: m.hunminjeongeumSec1Title, sub: m.hunminjeongeumSec1Sub },
    { ...SECTION_META[1], title: m.hunminjeongeumSec2Title, sub: m.hunminjeongeumSec2Sub },
    { ...SECTION_META[2], title: m.hunminjeongeumSec3Title, sub: m.hunminjeongeumSec3Sub },
    { ...SECTION_META[3], title: m.hunminjeongeumSec4Title, sub: m.hunminjeongeumSec4Sub },
  ]

  return (
    <>
      {/* ── 헤더 ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden pt-16 pb-20 border-b border-hanji-border mb-20">
        {/* 배경 장식: 거대 한자 — 스크롤 패럴랙스 */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ fontSize: 'clamp(5rem, 18vw, 14rem)', y: bgY, opacity: bgOpacity }}
          className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none font-serif leading-none text-ink/[0.035] dark:text-ink/[0.055]"
          aria-hidden
        >
          訓民正音
        </motion.span>

        {/* 레이블 */}
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="font-sans text-[11px] uppercase tracking-[0.22em] text-ink-muted/90 mb-6"
        >
          Hunminjeongeum · 訓民正音 · 1443
        </motion.p>

        {/* 메인 타이틀 — 글자 단위 순차 등장 */}
        <h1
          className="font-serif leading-none text-ink mb-6 flex"
          style={{ fontSize: 'clamp(3rem, 9vw, 5.5rem)' }}
          aria-label="훈민정음"
        >
          {TITLE_CHARS.map((char, i) => (
            <motion.span
              key={char}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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

        {/* 부제 */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="font-serif text-xl sm:text-2xl text-ink-soft mb-8"
        >
          {m.hunminjeongeumSubtitle}
        </motion.p>

        {/* 설명 */}
        <motion.p
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="font-sans text-sm text-ink-muted leading-relaxed max-w-2xl"
        >
          {m.hunminjeongeumPageDesc}
        </motion.p>

        {/* 기본 5자음 형태 — 시각적 악센트 */}
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
              className="font-serif text-3xl sm:text-4xl text-ink-muted/70 dark:text-ink-muted/50 select-none"
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

      {/* ── 섹션 목록 ─────────────────────────────────────────────────── */}
      <div className="space-y-24 pb-32 sm:space-y-28 sm:pb-36">
        {sections.map((section, idx) => (
          <motion.section
            key={section.id}
            custom={idx}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            aria-labelledby={`hj-section-${section.id}`}
          >
            {/* 소제목 행 */}
            <div className="flex items-end gap-4 mb-10 sm:mb-12 border-b border-hanji-border pb-5">
              <span
                className="font-serif text-3xl sm:text-4xl text-ink-muted/30 dark:text-ink-muted/20 select-none leading-none shrink-0"
                aria-hidden
                lang="ko"
              >
                {section.icon}
              </span>
              <div className="min-w-0">
                <h2
                  id={`hj-section-${section.id}`}
                  className="font-serif text-2xl sm:text-3xl text-ink tracking-tight leading-snug"
                >
                  {section.title}
                </h2>
                <p className="mt-1 font-sans text-xs tracking-[0.12em] text-ink-muted/80 uppercase">
                  {section.sub}
                </p>
              </div>
              <span
                className="ms-auto shrink-0 font-serif text-base text-ink-muted/25 dark:text-ink-muted/15 select-none hidden sm:block"
                aria-hidden
              >
                {section.gloss}
              </span>
            </div>

            {/* 내용 준비 중 */}
            <div className="relative min-h-[220px] sm:min-h-[260px] overflow-hidden rounded-sm border border-hanji-border bg-hanji-warm/20 dark:bg-hanji-warm/10">
              <span
                className="pointer-events-none absolute right-6 bottom-4 select-none font-serif text-[clamp(4rem,12vw,8rem)] leading-none text-ink/[0.025] dark:text-ink/[0.04]"
                aria-hidden
              >
                {section.gloss}
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-sans text-sm text-ink-muted/40 tracking-[0.1em]">
                  {m.comingSoon}
                </p>
              </div>
            </div>
          </motion.section>
        ))}
      </div>
    </>
  )
}
