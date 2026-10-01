import { VowelsPageClient } from '@/components/showcase/VowelsPageClient'
import { PageHeader } from '@/components/layout/PageHeader'
import { getVowels } from '@/lib/queries'
import { vowelsData } from '@/data/vowels'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: '모음',
  description:
    '한국어 21개 모음의 조음 위치, 혀 높이와 전후 위치, MRI 영상을 통해 탐구합니다.',
  keywords: ['모음', '한국어 모음', '단모음', '이중모음', '혀 위치', 'MRI', 'Korean vowels'],
}

/** Sanity에 연결되어 있으면 1시간마다 새 글을 반영 (미연결 시 로컬 데이터 그대로) */
export const revalidate = 3600

export default async function VowelsPage() {
  const sanityData = await getVowels()
  const vowels = sanityData.length > 0 ? sanityData : vowelsData

  return (
    <div className="site-container">
      <PageHeader type="vowels" />
      <Suspense fallback={null}>
        <VowelsPageClient vowels={vowels} />
      </Suspense>
    </div>
  )
}
