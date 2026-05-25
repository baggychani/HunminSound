'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import type { RefObject } from 'react'

const IMAGE_PATH = '/images/background.jpg'

interface HeroActBackdropProps {
  heroRef: RefObject<HTMLElement | null>
}

/**
 * 1막 배경 — 히어로 전체에 사진(크기 유지, 위치만 우측).
 * fixed + scrollYProgress 로 1막 벗어날 때 fade out.
 */
export function HeroActBackdrop({ heroRef }: HeroActBackdropProps) {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const layerOpacity = useTransform(scrollYProgress, [0, 0.2, 0.55, 1], [1, 0.75, 0.2, 0])

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      style={{ opacity: reduce ? 0.45 : layerOpacity }}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 top-[-7vh] h-[calc(100%+7vh)] origin-right scale-[0.86] opacity-[0.52] blur-[0.6px] saturate-[0.88] translate-x-[14vw] sm:top-[-7.5vh] sm:h-[calc(100%+7.5vh)] sm:translate-x-[16vw] lg:top-[-8vh] lg:h-[calc(100%+8vh)] lg:translate-x-[18vw]"
      >
        <Image
          src={IMAGE_PATH}
          alt=""
          fill
          priority
          className="object-cover object-[68%_28%] sm:object-[66%_26%] lg:object-[64%_24%]"
          sizes="100vw"
        />
      </motion.div>

      {/* 좌→우: 본문 쪽은 한지, 우측으로 갈수록 동상 */}
      <div className="absolute inset-0 bg-gradient-to-r from-hanji from-[0%] via-hanji via-[44%] via-hanji/88 via-[58%] via-hanji/35 via-[68%] to-transparent to-[94%] lg:via-[54%] lg:via-hanji/92 lg:via-[60%] lg:to-transparent lg:to-[82%]" />

      {/* 상단 — 헤더·제목 가독성 */}
      <div className="absolute inset-0 bg-gradient-to-b from-hanji from-[0%] via-hanji/75 via-[16%] to-transparent to-[36%]" />

      {/* 하단 — 소개 문단 가독성 */}
      <div className="absolute inset-0 bg-gradient-to-t from-hanji from-[0%] via-hanji/90 via-[18%] to-transparent to-[40%]" />
    </motion.div>
  )
}
