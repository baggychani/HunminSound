import type { Metadata } from 'next'
import { HunminjeongeumPageClient } from '@/components/showcase/HunminjeongeumPageClient'

export const metadata: Metadata = {
  title: '훈민정음',
  description: '1443년 세종이 창제한 훈민정음(訓民正音)의 제자 원리 — 상형과 조음 과학의 만남.',
}

export default function HunminjeongeumPage() {
  return (
    <div className="max-w-5xl mx-auto px-6">
      <HunminjeongeumPageClient />
    </div>
  )
}
