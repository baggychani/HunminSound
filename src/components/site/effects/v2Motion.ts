export const EASE_OUT = [0.22, 1, 0.36, 1] as const

export const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.65, ease: EASE_OUT },
  }),
}

export const fadeScale = {
  hidden: { opacity: 0, scale: 0.92 },
  show: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.06, duration: 0.55, ease: EASE_OUT },
  }),
}

export const slideIn = {
  hidden: { opacity: 0, x: -28 },
  show: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.07, duration: 0.6, ease: EASE_OUT },
  }),
}

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
