/**
 * Sanity Studio 내장 페이지 — /studio
 * 교수님 및 연구진 전용 콘텐츠 관리 페이지입니다.
 */
import type { Metadata, Viewport } from 'next'
import StudioClient from './StudioClient'

export const metadata: Metadata = {
  title: '세종말소리 관리자 · Sanity Studio',
  robots: { index: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const dynamic = 'force-dynamic'

export default function StudioPage() {
  return <StudioClient />
}
