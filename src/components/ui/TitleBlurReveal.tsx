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

/** 데바나가리·태국어·아랍어는 글자마다 나누면 모음 부호와 연결이 풀린다 */
function revealUnits(text: string): string[] {
  if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0900-\u097F\u0E00-\u0E7F]/.test(text)) {
    return [text]
  }
  return Array.from(text)
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
  const units = revealUnits(text)
  const together = units.length === 1 && text.length > 1

  return (
    <span className={`inline-block ${className}`} aria-label={text} role="text">
      {units.map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          aria-hidden
          className={together ? 'inline' : 'inline-block'}
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
