'use client'

import { useEffect, useState, type ReactNode } from 'react'

interface ScrollSectionProps {
  isOpen: boolean
  children: ReactNode
  className?: string
}

/**
 * 두루마리 펼침. 픽셀 높이로 고정하면 영상·설명이 늦게 늘어날 때
 * 아래가 잘리므로, 열린 뒤에는 내용 높이 그대로 둔다.
 */
export function ScrollSection({ isOpen, children, className }: ScrollSectionProps) {
  const [held, setHeld] = useState<ReactNode>(isOpen ? children : null)

  useEffect(() => {
    if (isOpen) setHeld(children)
  }, [isOpen, children])

  return (
    <div
      className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.04,0.62,0.23,0.98)] ${
        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      } ${className ?? ''}`}
      onTransitionEnd={(event) => {
        if (event.target !== event.currentTarget) return
        if (event.propertyName !== 'grid-template-rows') return
        if (!isOpen) setHeld(null)
      }}
    >
      <div className="min-h-0 overflow-hidden">{isOpen ? children : held}</div>
    </div>
  )
}
