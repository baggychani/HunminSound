'use client'

import { useState } from 'react'
import { VowelChart } from '@/components/showcase/VowelChart'
import { PhoneticsViewToggle, type ChartViewMode } from '@/components/showcase/PhoneticsViewToggle'
import { PhoneticsFadeIn } from '@/components/showcase/phonetics/phoneticsPageMotion'
import type { Vowel } from '@/types'

export function VowelsPageClient({ vowels }: { vowels: Vowel[] }) {
  const [viewMode, setViewMode] = useState<ChartViewMode>('modern')

  return (
    <>
      <PhoneticsFadeIn index={0}>
        <PhoneticsViewToggle className="mb-12 mt-2" mode={viewMode} onModeChange={setViewMode} />
      </PhoneticsFadeIn>
      <PhoneticsFadeIn index={1}>
        <VowelChart vowels={vowels} viewMode={viewMode} />
      </PhoneticsFadeIn>
    </>
  )
}
