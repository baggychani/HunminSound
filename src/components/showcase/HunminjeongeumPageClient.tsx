'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
import { HUNMIN_PASSAGE_SECTIONS } from '@/data/hunminjeongeumPassages'
import { PassageSection } from './hunminjeongeum/PassageSection'
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

export function HunminjeongeumPageClient() {
  const { lang } = useLang()
  const m = getMessages(lang)

  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 700], [0, -90])
  const bgOpacity = useTransform(scrollY, [0, 500], [1, 0.4])

  const sectionLabels: Record<
    (typeof HUNMIN_PASSAGE_SECTIONS)[number]['id'],
    { title: string; sub: string }
  > = {
    initial: { title: m.hunminInitialTitle, sub: m.hunminInitialSub },
    medial: { title: m.hunminMedialTitle, sub: m.hunminMedialSub },
    appraisal: { title: m.hunminAppraisalTitle, sub: m.hunminAppraisalSub },
  }

  return (
    <>
      {/* ── 헤더 ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden pt-16 pb-20 border-b border-hanji-border mb-20">
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
          className="font-sans text-sm text-ink-muted leading-relaxed max-w-2xl"
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

      {/* ── 일러두기 (상단) ────────────────────────────────────────── */}
      <div className="mb-14 sm:mb-16">
        <EditorialNote />
      </div>

      {/* ── 본문: 해례본 구절 3개 섹션 ──────────────────────────────── */}
      <div className="space-y-28 pb-24 sm:space-y-32 sm:pb-32">
        {HUNMIN_PASSAGE_SECTIONS.map((section) => {
          const label = sectionLabels[section.id]
          return (
            <PassageSection
              key={section.id}
              id={`hunmin-${section.id}`}
              title={label.title}
              subtitle={label.sub}
              classicLabel={section.classicLabel}
              passages={section.passages}
            />
          )
        })}
      </div>
    </>
  )
}
