import type { Metadata } from 'next'
import { HunminjeongeumPageClient } from '@/components/showcase/HunminjeongeumPageClient'

export const metadata: Metadata = {
  title: '훈민정음',
  description: '1443년 세종이 창제한 훈민정음(訓民正音)의 제자 원리 — 상형과 조음 과학의 만남.',
  keywords: ['훈민정음', '해례본', '제자해', '상형 원리', '초성자', '중성자', 'Hunminjeongeum'],
}

export default function HunminjeongeumPage() {
  return (
    <div className="site-container">
      <HunminjeongeumPageClient />
    </div>
  )
}
