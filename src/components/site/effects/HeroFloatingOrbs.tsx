'use client'

import { motion, useReducedMotion } from 'framer-motion'

const ORBS = [
  { color: 'rgba(245,158,11,0.35)', size: 'min(55vw,420px)', x: '8%', y: '12%', dur: 18, delay: 0 },
  { color: 'rgba(99,102,241,0.28)', size: 'min(48vw,360px)', x: '72%', y: '8%', dur: 22, delay: 2 },
  { color: 'rgba(217,191,36,0.2)', size: 'min(40vw,300px)', x: '55%', y: '58%', dur: 20, delay: 1 },
  { color: 'rgba(14,165,233,0.18)', size: 'min(36vw,280px)', x: '-5%', y: '62%', dur: 24, delay: 3 },
] as const

export function HeroFloatingOrbs() {
  const reduce = useReducedMotion()

  return (
    <motion.div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[80px] sm:blur-[100px]"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          }}
          animate={
            reduce
              ? undefined
              : {
                  x: [0, 24, -16, 0],
                  y: [0, -20, 14, 0],
                  scale: [1, 1.08, 0.96, 1],
                }
          }
          transition={
            reduce
              ? undefined
              : {
                  duration: orb.dur,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: orb.delay,
                }
          }
        />
      ))}
      {/* 미세한 골드 그레인 스캔라인 */}
      <div className="v2-hero-scanlines absolute inset-0 opacity-[0.04]" />
    </motion.div>
  )
}
