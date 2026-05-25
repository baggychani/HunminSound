'use client'

import { useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/** 레거시 홈 NavCard 와 동일 — 마우스에 끌려오는 자모 */
export function MagneticGlyph({
  children,
  className,
  pull = 3,
  threshold = 45,
}: {
  children: string
  className?: string
  pull?: number
  threshold?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 150, damping: 20 })
  const sy = useSpring(y, { stiffness: 150, damping: 20 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < threshold) {
        const strength = (1 - dist / threshold) * pull
        x.set((dx / dist) * strength)
        y.set((dy / dist) * strength)
      } else {
        x.set(0)
        y.set(0)
      }
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [pull, threshold, x, y])

  return (
    <motion.span ref={ref} style={{ x: sx, y: sy }} className={className}>
      {children}
    </motion.span>
  )
}
