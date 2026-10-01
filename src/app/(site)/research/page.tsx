import type { Metadata } from 'next'
import { ResearchPageClient } from '@/components/showcase/ResearchPageClient'
import { loadResearchContent } from '@/lib/loadResearchContent'

export const metadata: Metadata = {
  title: '연구 소개',
  description: 'NRF 과제 정보, 연구진 소개, 연구 목적과 의의를 소개합니다.',
  keywords: ['연구 소개', 'NRF', '훈민정음 연구', 'MRI 음성 연구', '연구진', '과제 정보'],
}

export default async function ResearchPage() {
  const content = await loadResearchContent()
  return (
    <div className="site-container">
      <ResearchPageClient content={content} />
    </div>
  )
}
