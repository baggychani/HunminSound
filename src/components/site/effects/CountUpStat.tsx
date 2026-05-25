'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

export function CountUpStat({
  value,
  className,
}: {
  value: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    if (!inView) return
    const match = value.match(/^(\d+)(.*)$/)
    if (!match) {
      setDisplay(value)
      return
    }
    const target = parseInt(match[1], 10)
    const suffix = match[2]
    let frame = 0
    const total = 36
    const id = window.setInterval(() => {
      frame += 1
      const progress = frame / total
      const eased = 1 - (1 - progress) ** 3
      setDisplay(`${Math.round(target * eased)}${suffix}`)
      if (frame >= total) window.clearInterval(id)
    }, 22)
    return () => window.clearInterval(id)
  }, [inView, value])

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {display}
    </motion.span>
  )
}
