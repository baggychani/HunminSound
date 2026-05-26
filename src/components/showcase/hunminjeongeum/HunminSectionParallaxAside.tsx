'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

interface HunminSectionParallaxAsideProps {
  src: string
  alt: string
}

/** 섹션 우측 여백 — 스크롤에 따라 아주 살짝 위아래로 움직이는 장식 이미지 */
export function HunminSectionParallaxAside({ src, alt }: HunminSectionParallaxAsideProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.15'],
  })

  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [18, -18])

  return (
    <div ref={containerRef} className="pointer-events-none hidden lg:block">
      <div className="sticky top-[calc(var(--site-header-h,4rem)+1.75rem)]">
        <motion.div style={{ y }} className="will-change-transform">
          <div className="overflow-hidden rounded-sm border border-hanji-border/50 bg-hanji/30 shadow-[0_1px_0_rgb(var(--ink-rgb)/0.04)]">
            <Image
              src={src}
              alt={alt}
              width={3024}
              height={4032}
              sizes="(min-width: 1024px) 28vw, 0px"
              className="h-auto w-full object-cover object-[center_38%]"
              priority={false}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
