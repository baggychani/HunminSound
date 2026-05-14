'use client'

import { useState } from 'react'
import { ConsonantChart } from '@/components/showcase/ConsonantChart'
import { PhoneticsViewToggle, type ChartViewMode } from '@/components/showcase/PhoneticsViewToggle'
import type { Consonant } from '@/types'

export function ConsonantsPageClient({ consonants }: { consonants: Consonant[] }) {
  const [viewMode, setViewMode] = useState<ChartViewMode>('modern')

  return (
    <>
      <PhoneticsViewToggle className="mb-12 mt-2" mode={viewMode} onModeChange={setViewMode} />
      <ConsonantChart consonants={consonants} viewMode={viewMode} />
    </>
  )
}
