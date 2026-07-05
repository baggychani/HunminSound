'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

/** 헤더 바로 아래 붙는 금빛 스크롤 진행선 — 데스크톱 전용 */
export function HomeScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 })

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, top: 'var(--site-header-h, 4rem)' }}
      className="fixed inset-x-0 z-[10000] hidden h-[2px] origin-left bg-gradient-to-r from-gold/40 via-gold to-gold-light sm:block"
    />
  )
}
