import type { Metadata } from 'next'
import { ResearchPageClient } from '@/components/showcase/ResearchPageClient'

export const metadata: Metadata = {
  title: '연구 소개',
  description: 'NRF 과제 정보, 연구진 소개, 연구 목적과 의의를 소개합니다.',
}

export default function ResearchPage() {
  return (
    <div className="max-w-5xl mx-auto px-6">
      <ResearchPageClient />
    </div>
  )
}
