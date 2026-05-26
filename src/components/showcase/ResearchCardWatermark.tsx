'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useMaxSm } from '@/hooks/useMaxSm'

const SRC = '/images/research/articulation-silhouette.jpg'

const ZONE = {
  left: '38%',
  right: '-6%',
  top: '-18%',
  bottom: '-18%',
} as const

const ZONE_MOBILE = {
  left: '28%',
  right: '-14%',
  top: '-20%',
  bottom: '-20%',
} as const

const IMG_SCALE = 1.05
const IMG_SCALE_MOBILE = 1.35

/** 메인 연구 소개 카드 — 조음 단면 실루엣 워터마크 (은은한 은색 톤) */
export function ResearchCardWatermark() {
  const ref = useRef<HTMLDivElement | null>(null)
  const isMobile = useMaxSm()
  const reduceMotion = useReducedMotion()
  const zone = isMobile ? ZONE_MOBILE : ZONE

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-8, 8])

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <motion.div
        className={`research-watermark-feather absolute${isMobile ? ' research-watermark-feather--mobile' : ''}`}
        style={{
          left: zone.left,
          right: zone.right,
          top: zone.top,
          bottom: zone.bottom,
        }}
      >
        <motion.img
          src={SRC}
          alt=""
          decoding="async"
          style={{ y, scale: isMobile ? IMG_SCALE_MOBILE : IMG_SCALE }}
          className="research-watermark-img h-full w-full select-none object-contain object-right"
        />
      </motion.div>
    </motion.div>
  )
}
