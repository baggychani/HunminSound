'use client'

import { motion } from 'framer-motion'
import { PassageCard } from './PassageCard'
import type { HunminPassage } from '@/data/hunminjeongeumPassages'

interface PassageSectionProps {
  id: string
  title: string
  subtitle?: string
  classicLabel?: string
  passages: HunminPassage[]
}

export function PassageSection({
  id,
  title,
  subtitle,
  classicLabel,
  passages,
}: PassageSectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      aria-labelledby={`${id}-title`}
    >
      {/* 섹션 헤더 */}
      <header className="mb-12 sm:mb-14">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-hanji-border pb-5">
          <div className="min-w-0">
            <h2
              id={`${id}-title`}
              className="font-jamo text-2xl leading-snug tracking-tight text-ink sm:text-3xl"
              lang="ko"
            >
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1.5 font-sans text-xs tracking-[0.12em] text-ink-muted/85 sm:text-[13px]">
                {subtitle}
              </p>
            ) : null}
          </div>
          {classicLabel ? (
            <span
              aria-hidden
              className="font-serif text-[clamp(2rem,6vw,3rem)] leading-none text-ink/[0.07] dark:text-ink/[0.09] select-none"
              lang="zh-Hant"
            >
              {classicLabel}
            </span>
          ) : null}
        </div>
      </header>

      {/* 카드 리스트 */}
      <div className="space-y-16 sm:space-y-20">
        {passages.map((p) => (
          <PassageCard key={p.number} passage={p} />
        ))}
      </div>
    </motion.section>
  )
}
