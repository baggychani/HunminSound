import { PageHeader } from '@/components/layout/PageHeader'
import { ConsonantsPageClient } from '@/components/showcase/ConsonantsPageClient'
import { getConsonants } from '@/lib/queries'
import { consonantsData } from '@/data/consonants'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: '자음',
  description:
    '한국어 19개 자음의 조음 위치, 조음 방법, MRI 영상을 통해 탐구합니다.',
  keywords: ['자음', '한국어 자음', '조음 위치', '조음 방법', 'MRI', 'Korean consonants'],
}

/** Sanity에 연결되어 있으면 1시간마다 새 글을 반영 (미연결 시 로컬 데이터 그대로) */
export const revalidate = 3600

export default async function ConsonantsPage() {
  const sanityData = await getConsonants()
  const consonants = sanityData.length > 0 ? sanityData : consonantsData

  return (
    <div className="site-container">
      <PageHeader type="consonants" />
      <Suspense fallback={null}>
        <ConsonantsPageClient consonants={consonants} />
      </Suspense>
    </div>
  )
}
