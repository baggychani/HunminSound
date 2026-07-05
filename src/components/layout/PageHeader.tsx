'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'
import { TitleBlurReveal } from '@/components/ui/TitleBlurReveal'

interface PageHeaderProps {
  type: 'consonants' | 'vowels'
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

export function PageHeader({ type }: PageHeaderProps) {
  const { lang } = useLang()
  const m = getMessages(lang)

  const isConsonants = type === 'consonants'

  const label = isConsonants ? 'Korean Consonants' : 'Korean Vowels'
  const title = isConsonants ? m.consonants : m.vowels
  const desc = isConsonants ? m.consonantsPageDesc : m.vowelsPageDesc
  const count = isConsonants ? m.consonantsCount : m.vowelsCount
  const previewGlyphs = isConsonants
    ? (['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'] as const)
    : (['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅡ'] as const)

  return (
    <div className="relative overflow-hidden pt-16 pb-16 border-b border-hanji-border mb-16">
      {/* 배경 워터마크 — 훈민정음 페이지와 같은 계열 */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 select-none font-jamo leading-none text-ink/[0.04] dark:text-ink/[0.06]"
        style={{ fontSize: 'clamp(5rem, 14vw, 10rem)' }}
        lang="ko"
      >
        {title}
      </span>

      <AnimatePresence mode="wait">
        <motion.div key={type} className="relative">
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            exit="exit"
            className="font-sans text-[11px] uppercase tracking-[0.22em] text-ink-muted/90 mb-6"
          >
            {label} · {count}
          </motion.p>

          <h1
            className="font-jamo leading-none text-ink mb-6"
            style={{ fontSize: 'clamp(2.35rem, 7vw, 4.1rem)' }}
            lang="ko"
          >
            <TitleBlurReveal text={title} />
          </h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            exit="exit"
            className="max-w-none break-keep font-sans text-sm leading-relaxed text-ink-muted [overflow-wrap:break-word]"
          >
            {desc}
            <br />
            <span className="text-ink-muted/70">{m.clickToExplore}</span>
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            exit="exit"
            className="mt-10 flex items-end gap-4 sm:gap-6"
            dir="ltr"
            lang="ko"
          >
            {previewGlyphs.map((glyph, i) => (
              <motion.span
                key={glyph}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="font-jamo text-3xl sm:text-4xl text-ink-muted/70 select-none"
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
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
