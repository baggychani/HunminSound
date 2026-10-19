import { PageHeader } from '@/components/layout/PageHeader'
import { ConsonantsPageClient } from '@/components/showcase/ConsonantsPageClient'
import { PhonemeTextIndex } from '@/components/showcase/phonetics/PhonemeTextIndex'
import { consonantsData } from '@/data/consonants'
import { phonemeMetadata } from '@/lib/phonemeRoutes'
import { loadConsonantList } from '@/lib/queries'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export const revalidate = 3600

export function generateStaticParams() {
  return consonantsData.map((item) => ({ id: item._id }))
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const item = (await loadConsonantList()).find((row) => row._id === params.id)
  if (!item) return {}
  return phonemeMetadata('/consonants', item)
}

export default async function ConsonantDetailPage({ params }: { params: { id: string } }) {
  const consonants = await loadConsonantList()
  const item = consonants.find((row) => row._id === params.id)
  if (!item) notFound()

  return (
    <div className="site-container page-shell">
      <PageHeader type="consonants" />
      <Suspense fallback={null}>
        <ConsonantsPageClient consonants={consonants} />
      </Suspense>
      <PhonemeTextIndex items={[item]} />
    </div>
  )
}
