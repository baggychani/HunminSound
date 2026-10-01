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

  return (
    <div className="relative overflow-hidden pt-16 pb-10 border-b border-hanji-border mb-16">
      <AnimatePresence mode="wait">
        <motion.div key={type} className="relative">
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            exit="exit"
            className="font-sans text-[11px] uppercase tracking-[0.22em] text-ink-muted mb-6"
          >
            {label}
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
            <span className="text-ink-muted">{m.clickToExplore}</span>
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
