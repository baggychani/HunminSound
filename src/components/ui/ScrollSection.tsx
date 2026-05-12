'use client'

import { AnimatePresence, motion } from 'framer-motion'

interface ScrollSectionProps {
  isOpen: boolean
  children: React.ReactNode
}

/**
 * 두루마리(Scroll) 펼침 애니메이션 컴포넌트
 * 클릭 시 height: 0 → auto 로 부드럽게 펼쳐집니다.
 */
export function ScrollSection({ isOpen, children }: ScrollSectionProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="scroll-content"
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: {
              height: 'auto',
              opacity: 1,
              transition: {
                height: { duration: 0.55, ease: [0.04, 0.62, 0.23, 0.98] },
                opacity: { duration: 0.35, delay: 0.1 },
              },
            },
            collapsed: {
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
                opacity: { duration: 0.2 },
              },
            },
          }}
          style={{ overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
