import type { Metadata } from 'next'
import { ResearchPageClient } from '@/components/showcase/ResearchPageClient'
import { loadResearchContent } from '@/lib/loadResearchContent'

export const metadata: Metadata = {
  title: '연구 소개',
  description: 'NRF 과제 정보, 연구진 소개, 연구 목적과 의의를 소개합니다.',
}

/* 매 요청마다 Redis를 조회하지 않도록 캐시하고, 관리자 저장 시점(revalidatePath)에만 갱신 */

export default async function ResearchPage() {
  const content = await loadResearchContent()
  return (
    <div className="site-container">
      <ResearchPageClient content={content} />
    </div>
  )
}
