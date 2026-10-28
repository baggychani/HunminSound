import { PageHeader } from '@/components/layout/PageHeader'
import { ConsonantsPageClient } from '@/components/showcase/ConsonantsPageClient'
import { PhonemeTextIndex } from '@/components/showcase/phonetics/PhonemeTextIndex'
import { redirectLegacyPhonemeQuery } from '@/lib/phonemeRoutes'
import { loadConsonantList } from '@/lib/queries'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: '자음',
  description:
    '한국어 19개 자음의 조음 위치, 조음 방법, MRI 영상을 통해 탐구합니다.',
  keywords: ['자음', '한국어 자음', '조음 위치', '조음 방법', 'MRI', 'Korean consonants'],
  alternates: { canonical: '/consonants' },
  openGraph: { url: '/consonants' },
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ConsonantsPage({
  searchParams,
}: {
  searchParams?: { id?: string | string[]; view?: string | string[] }
}) {
  const consonants = await loadConsonantList()
  redirectLegacyPhonemeQuery('/consonants', searchParams, consonants)

  return (
    <div className="site-container page-shell">
      <PageHeader type="consonants" />
      <Suspense fallback={null}>
        <ConsonantsPageClient consonants={consonants} />
      </Suspense>
      <PhonemeTextIndex items={consonants} basePath="/consonants" />
    </div>
  )
}
