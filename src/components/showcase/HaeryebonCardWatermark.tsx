'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

const SRC = '/images/hunmin/hunminjeongeum_transparent.png'

// ─────────────────────────────────────────────────────────────
// 수동 조절 — 아래 값만 바꿔 가며 확인 (메인 훈민정음 카드)
// 블렌드·왼쪽 페더·투명도 → globals.css 의 .haeryebon-watermark-*
// ─────────────────────────────────────────────────────────────

/** 워터마크가 들어가는 영역 (카드 네 모서리 기준, % / 음수 = 밖으로 확장) */
const ZONE = {
  left: '42%', // ↑ 오른쪽으로 밀림 (예: 40% = 더 왼쪽, 46% = 더 오른쪽)
  right: '-5%', // ↑ 음수 절댓값 크면 오른쪽 끝까지 더 채움
  top: '-10%', // ↑ 음수 크면 위로 넓어짐 → 전체가 위로 올라감
  bottom: '-12%', // ↑ 음수 크면 아래로 넓어짐 → 전체가 아래로 내려감
} as const

/** <img> — object-right = 영역 안에서 오른쪽 정렬 (center / right) */
const IMG_OBJECT = 'object-contain object-right' as const

/** 확대 (1 = 100%, 크면 오른쪽·가장자리까지 더 채움) */
const IMG_SCALE = 1.12

/**
 * 기본 세로 위치 (px).
 * 양수 = 아래, 음수 = 위. 스크롤 패럴랙스는 이 값에 더해짐.
 */
const BASE_OFFSET_Y = 10

/** 스크롤 시 Y 이동량 (px). [화면 위→아래] 구간 min ~ max */
const PARALLAX_Y = { min: -150, max: 150 } as const

/**
 * 스크롤 시 회전 (deg).
 * ROTATE_SPAN = min↔max 사이 각도 폭 (예: 2.5 → ±1.25°, 3.5 → ±1.75°).
 * ROTATE_CENTER 기준으로 위·아래로 span/2 만큼 흔들림.
 */
const ROTATE_CENTER = -3
const ROTATE_SPAN = 3.5
const ROTATE = {
  min: ROTATE_CENTER - ROTATE_SPAN / 2, // 스크롤 위쪽 (span=3.5 → -4.75°)
  max: ROTATE_CENTER + ROTATE_SPAN / 2, // 스크롤 아래쪽 (span=3.5 → -1.25°)
  reduceMotion: ROTATE_CENTER,
} as const

// ─────────────────────────────────────────────────────────────

export function HaeryebonCardWatermark() {
  const ref = useRef<HTMLDivElement | null>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const yParallax = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [PARALLAX_Y.min, PARALLAX_Y.max],
  )
  const y = useTransform(yParallax, (v) => v + BASE_OFFSET_Y)
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [ROTATE.reduceMotion, ROTATE.reduceMotion] : [ROTATE.min, ROTATE.max],
  )

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <motion.div
        className="haeryebon-watermark-feather absolute"
        style={{
          left: ZONE.left,
          right: ZONE.right,
          top: ZONE.top,
          bottom: ZONE.bottom,
        }}
      >
        <motion.img
          src={SRC}
          alt=""
          decoding="async"
          style={{ y, rotate, scale: IMG_SCALE }}
          className={`haeryebon-watermark-img h-full w-full select-none ${IMG_OBJECT}`}
        />
      </motion.div>
    </motion.div>
  )
}
