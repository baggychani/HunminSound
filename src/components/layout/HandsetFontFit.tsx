'use client'

import { useLayoutEffect } from 'react'
import { fitHandsetFont } from '@/lib/viewportLayout'

/** 크롬이 폰을 980px 데스크톱으로 연 뒤에도 글자 크기가 삼성 인터넷과 같게 */
export function HandsetFontFit() {
  useLayoutEffect(() => {
    fitHandsetFont()
    window.addEventListener('resize', fitHandsetFont)
    window.addEventListener('orientationchange', fitHandsetFont)
    return () => {
      window.removeEventListener('resize', fitHandsetFont)
      window.removeEventListener('orientationchange', fitHandsetFont)
    }
  }, [])
  return null
}
