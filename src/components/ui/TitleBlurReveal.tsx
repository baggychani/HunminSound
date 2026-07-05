'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface TitleBlurRevealProps {
  text: string
  className?: string
  /** 글자 간 시차(초). 기본 0.09 */
  stagger?: number
  /** 첫 글자 지연(초). 기본 0.12 */
  delay?: number
}

/**
 * 글자별 블러 인(Staggered Blur-in Text Reveal)
 * — 먹이 번지듯 한 글자씩 선명해지며 떠오르는 입장 효과.
 */
export function TitleBlurReveal({
  text,
  className = '',
  stagger = 0.09,
  delay = 0.12,
}: TitleBlurRevealProps) {
  const reduce = useReducedMotion()

  return (
    <span className={`inline-block ${className}`} aria-label={text} role="text">
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          aria-hidden
          className="inline-block"
          initial={reduce ? false : { opacity: 0, y: 20, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            delay: delay + i * stagger,
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}
