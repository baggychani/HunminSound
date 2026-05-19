import { VowelsPageClient } from '@/components/showcase/VowelsPageClient'
import { PageHeader } from '@/components/layout/PageHeader'
import { getVowels } from '@/lib/queries'
import { vowelsData } from '@/data/vowels'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '모음',
  description:
    '한국어 21개 모음의 조음 위치, 혀 높이와 전후 위치, MRI 영상을 통해 탐구합니다.',
}

export default async function VowelsPage() {
  const sanityData = await getVowels()
  const vowels = sanityData.length > 0 ? sanityData : vowelsData

  return (
    <div className="max-w-5xl mx-auto px-6">
      <PageHeader type="vowels" />
      <VowelsPageClient vowels={vowels} />
    </div>
  )
}
