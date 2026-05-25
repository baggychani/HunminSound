'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

/** PageHeader(0–2) 다음 토글·차트 순차 등장 */
export const phoneticsContentFadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function PhoneticsFadeIn({
  index,
  children,
  className,
}: {
  index: number
  children: ReactNode
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) {
    return className ? <div className={className}>{children}</div> : <>{children}</>
  }
  return (
    <motion.div
      custom={index}
      variants={phoneticsContentFadeUp}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  )
}
