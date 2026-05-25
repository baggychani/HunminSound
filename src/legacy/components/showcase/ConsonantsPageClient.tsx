'use client'

import { useState } from 'react'
import { ConsonantChart } from '@/legacy/components/showcase/ConsonantChart'
import { PhoneticsViewToggle, type ChartViewMode } from '@/legacy/components/showcase/PhoneticsViewToggle'
import { PhoneticsFadeIn } from '@/legacy/components/showcase/phonetics/phoneticsPageMotion'
import type { Consonant } from '@/types'

export function ConsonantsPageClient({ consonants }: { consonants: Consonant[] }) {
  const [viewMode, setViewMode] = useState<ChartViewMode>('modern')

  return (
    <>
      <PhoneticsFadeIn index={0}>
        <PhoneticsViewToggle className="mb-12 mt-2" mode={viewMode} onModeChange={setViewMode} />
      </PhoneticsFadeIn>
      <PhoneticsFadeIn index={1}>
        <ConsonantChart consonants={consonants} viewMode={viewMode} />
      </PhoneticsFadeIn>
    </>
  )
}
