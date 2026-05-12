import { ConsonantChart } from '@/components/showcase/ConsonantChart'
import { PageHeader } from '@/components/layout/PageHeader'
import { getConsonants } from '@/lib/queries'
import { consonantsData } from '@/data/consonants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '자음',
  description:
    '한국어 19개 자음의 조음 위치, 조음 방법, MRI 영상을 통해 탐구합니다.',
}

export default async function ConsonantsPage() {
  const sanityData = await getConsonants()
  const consonants = sanityData.length > 0 ? sanityData : consonantsData

  return (
    <div className="max-w-5xl mx-auto px-6">
      <PageHeader type="consonants" />
      <ConsonantChart consonants={consonants} />
    </div>
  )
}
