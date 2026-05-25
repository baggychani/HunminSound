'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import type { RefObject } from 'react'

const IMAGE_PATH = '/images/background.jpg'

/** 좌측 — 강한 페더 */
const IMAGE_LEFT_FEATHER =
  'linear-gradient(to right, transparent 0%, transparent 16%, rgba(0,0,0,0.06) 24%, rgba(0,0,0,0.28) 34%, rgba(0,0,0,0.58) 44%, rgba(0,0,0,0.82) 54%, black 66%, black 100%)'

/** 하단 — 왼쪽보다는 약하지만 끝선이 안 보이게 */
const IMAGE_BOTTOM_FEATHER =
  'linear-gradient(to top, transparent 0%, transparent 4%, rgba(0,0,0,0.1) 11%, rgba(0,0,0,0.38) 20%, rgba(0,0,0,0.68) 30%, rgba(0,0,0,0.9) 38%, black 46%, black 100%)'

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

      {/* 좌→우: 마스크와 겹쳐 한지 쪽 완전히 녹임 */}
      <div className="absolute inset-0 bg-gradient-to-r from-hanji from-[0%] via-hanji via-[38%] via-hanji/95 via-[52%] via-hanji/55 via-[62%] to-transparent to-[88%] lg:via-[48%] lg:via-hanji/98 lg:via-[58%] lg:to-transparent lg:to-[78%]" />

      {/* 상단 — 헤더·제목 가독성 */}
      <div className="absolute inset-0 bg-gradient-to-b from-hanji from-[0%] via-hanji/75 via-[16%] to-transparent to-[36%]" />

      {/* 하단 — 소개 문단·이미지 하단 외곽선 녹임 */}
      <div className="absolute inset-0 bg-gradient-to-t from-hanji from-[0%] via-hanji/95 via-[14%] via-hanji/55 via-[28%] to-transparent to-[46%]" />
    </motion.div>
  )
}
