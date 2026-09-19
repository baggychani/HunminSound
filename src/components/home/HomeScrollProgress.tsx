'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import type { RefObject } from 'react'

/**
 * 헤더 바로 아래 붙는 금빛 스크롤 진행선 — 데스크톱 전용.
 * containerRef(1~4막을 감싸는 래퍼, 푸터 제외)를 기준으로 진행률을 재서,
 * 마지막 막(4막) 끝에서 100%가 차게 한다 — 문서 전체 기준(useScroll())이면
 * 푸터까지 내려가야 100%가 돼서 실제보다 더 남은 것처럼 보임.
 */
export function HomeScrollProgress({ containerRef }: { containerRef: RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
    layoutEffect: false,
  })
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 })

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, top: 'var(--site-header-h, 4rem)' }}
      className="fixed inset-x-0 z-[10000] hidden h-[2px] origin-left bg-gradient-to-r from-gold/40 via-gold to-gold-light sm:block"
    />
  )
}
