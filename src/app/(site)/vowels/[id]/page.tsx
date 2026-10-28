import { VowelsPageClient } from '@/components/showcase/VowelsPageClient'
import { PageHeader } from '@/components/layout/PageHeader'
import { PhonemeTextIndex } from '@/components/showcase/phonetics/PhonemeTextIndex'
import { phonemeMetadata } from '@/lib/phonemeRoutes'
import { loadVowelList } from '@/lib/queries'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const item = (await loadVowelList()).find((row) => row._id === params.id)
  if (!item) return {}
  return phonemeMetadata('/vowels', item)
}

export default async function VowelDetailPage({ params }: { params: { id: string } }) {
  const vowels = await loadVowelList()
  const item = vowels.find((row) => row._id === params.id)
  if (!item) notFound()

  return (
    <div className="site-container page-shell">
      <PageHeader type="vowels" />
      <Suspense fallback={null}>
        <VowelsPageClient vowels={vowels} />
      </Suspense>
      <PhonemeTextIndex items={[item]} />
    </div>
  )
}
