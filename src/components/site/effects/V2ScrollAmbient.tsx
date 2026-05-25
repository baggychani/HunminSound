'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

/**
 * v2 원페이지 전역 스크롤 연동 앰비언트.
 * 레거시 ScrollColorWash 의 블롭·패럴랙스를 v2 팔레트로 재해석.
 */
export function V2ScrollAmbient() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()

  const goldOpacity = useTransform(scrollYProgress, [0, 0.15, 0.45, 0.7], [0.7, 0.35, 0.2, 0.08])
  const sageOpacity = useTransform(scrollYProgress, [0.2, 0.45, 0.65, 0.85], [0.05, 0.45, 0.35, 0.1])
  const violetOpacity = useTransform(scrollYProgress, [0.45, 0.65, 0.9, 1], [0.05, 0.4, 0.5, 0.25])
  const roseOpacity = useTransform(scrollYProgress, [0.65, 0.85, 1], [0.05, 0.35, 0.45])

  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])
  const y2 = useTransform(scrollYProgress, [0, 1], ['8%', '-6%'])
  const y3 = useTransform(scrollYProgress, [0, 1], ['14%', '2%'])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        style={{
          opacity: reduce ? 0.25 : goldOpacity,
          y: reduce ? 0 : y1,
          background: 'radial-gradient(55% 50% at 20% 25%, rgba(245,158,11,0.55) 0%, transparent 72%)',
        }}
        className="absolute -left-[15%] top-[2%] h-[65vh] w-[75vw] rounded-full blur-[100px] sm:blur-[140px]"
      />
      <motion.div
        style={{
          opacity: reduce ? 0.2 : sageOpacity,
          y: reduce ? 0 : y2,
          background: 'radial-gradient(50% 45% at 78% 42%, rgba(52,211,153,0.45) 0%, transparent 75%)',
        }}
        className="absolute -right-[18%] top-[30%] h-[70vh] w-[80vw] rounded-full blur-[110px] sm:blur-[150px]"
      />
      <motion.div
        style={{
          opacity: reduce ? 0.18 : violetOpacity,
          y: reduce ? 0 : y3,
          background: 'radial-gradient(48% 42% at 65% 72%, rgba(139,92,246,0.4) 0%, transparent 78%)',
        }}
        className="absolute right-[5%] top-[55%] h-[60vh] w-[70vw] rounded-full blur-[100px] sm:blur-[130px]"
      />
      <motion.div
        style={{
          opacity: reduce ? 0.15 : roseOpacity,
          background: 'radial-gradient(45% 40% at 25% 88%, rgba(244,63,94,0.35) 0%, transparent 80%)',
        }}
        className="absolute -left-[10%] bottom-[-5%] h-[50vh] w-[65vw] rounded-full blur-[90px] sm:blur-[120px]"
      />
    </div>
  )
}
