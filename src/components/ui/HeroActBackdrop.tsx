'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import type { RefObject } from 'react'

const IMAGE_PATH = '/images/background.jpg'

/**
 * @feather-left-mask — 동상 이미지 좌측 페더 (mask-image)
 * 검색: feather-left-mask
 * • transparent 구간 = 지워짐 / black = 선명
 * • 숫자를 줄이면(예: 16→12) 좌측이 더 많이 지워짐, 늘리면(16→20) 덜 지워짐
 */
const IMAGE_LEFT_FEATHER =
  'linear-gradient(to right, transparent 0%, transparent 14%, rgba(0,0,0,0.06) 22%, rgba(0,0,0,0.28) 32%, rgba(0,0,0,0.58) 42%, rgba(0,0,0,0.82) 52%, black 64%, black 100%)'

/**
 * @feather-bottom-mask — 동상 이미지 하단 페더 (mask-image)
 * 검색: feather-bottom-mask
 */
const IMAGE_BOTTOM_FEATHER =
  'linear-gradient(to top, transparent 0%, transparent 2%, rgba(0,0,0,0.18) 6%, rgba(0,0,0,0.52) 10%, rgba(0,0,0,0.82) 14%, black 19%, black 100%)'

const IMAGE_MASK = `${IMAGE_LEFT_FEATHER}, ${IMAGE_BOTTOM_FEATHER}`

interface HeroActBackdropProps {
  heroRef: RefObject<HTMLElement | null>
}

/**
 * 1막 배경 — 히어로 섹션 안 absolute(1막 밖으로 새나가지 않음).
 * scrollY 기준으로 1막 이탈 시 opacity 페이드아웃.
 */
export function HeroActBackdrop({ heroRef }: HeroActBackdropProps) {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()

  const layerOpacity = useTransform(scrollY, (y) => {
    if (reduce) return 0.45

    const end =
      heroRef.current?.offsetHeight ??
      (typeof window !== 'undefined' ? window.innerHeight : 800)

    const enter = end * 0.06
    const mid = end * 0.32
    const exit = end * 0.72

    if (y <= enter) return 1
    if (y >= exit) return 0
    if (y <= mid) {
      const t = (y - enter) / (mid - enter)
      return 1 - t * 0.62
    }
    const t = (y - mid) / (exit - mid)
    return 0.38 * (1 - t)
  })

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ opacity: layerOpacity }}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 top-[-7vh] h-[calc(100%+7vh)] origin-right scale-[0.86] opacity-[0.52] blur-[0.6px] saturate-[0.88] translate-x-[14vw] sm:top-[-7.5vh] sm:h-[calc(100%+7.5vh)] sm:translate-x-[16vw] lg:top-[-8vh] lg:h-[calc(100%+8vh)] lg:translate-x-[18vw]"
        style={{
          WebkitMaskImage: IMAGE_MASK,
          WebkitMaskComposite: 'source-in',
          maskImage: IMAGE_MASK,
          maskComposite: 'intersect',
        }}
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

      {/*
       * @feather-left-overlay — 좌→우 한지 오버레이 (동상 좌측 페더 보조)
       * 검색: feather-left-overlay
       * • via-[38%] 등 %를 줄이면 한지가 덜 침범(동상 더 선명), 늘리면 더 지워짐
       */}
      <div className="absolute inset-0 bg-gradient-to-r from-hanji from-[0%] via-hanji via-[34%] via-hanji/95 via-[50%] via-hanji/55 via-[58%] to-transparent to-[86%] lg:via-[44%] lg:via-hanji/98 lg:via-[56%] lg:to-transparent lg:to-[76%]" />

      {/* @feather-top-overlay — 상단 페더 (검색: feather-top-overlay) */}
      <div className="absolute inset-0 bg-gradient-to-b from-hanji from-[0%] via-hanji/75 via-[16%] to-transparent to-[36%]" />

      {/* @feather-bottom-overlay — 하단 페더 (검색: feather-bottom-overlay) */}
      <div className="absolute inset-0 bg-gradient-to-t from-hanji from-[0%] via-hanji/85 via-[8%] to-transparent to-[22%]" />
    </motion.div>
  )
}
