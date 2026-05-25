'use client'

import dynamic from 'next/dynamic'
import { SnapScrollLayout } from '@/components/site/SnapScrollLayout'
import { SiteFooter } from '@/components/site/SiteFooter'
import { V2ScrollAmbient } from '@/components/site/effects/V2ScrollAmbient'
import { HeroSection } from '@/components/site/sections/HeroSection'
import { OverviewSection } from '@/components/site/sections/OverviewSection'
import { ContactSection } from '@/components/site/sections/ContactSection'
import type { ResearchContent } from '@/lib/research-content'
import type { Consonant, Vowel } from '@/types'

const SoundArchiveSection = dynamic(
  () => import('@/components/site/sections/SoundArchiveSection').then((m) => m.SoundArchiveSection),
  { ssr: false, loading: () => <SectionPlaceholder /> },
)
const HunminCarouselSection = dynamic(
  () => import('@/components/site/sections/HunminCarouselSection').then((m) => m.HunminCarouselSection),
  { ssr: false, loading: () => <SectionPlaceholder /> },
)
const PublicationsSection = dynamic(
  () => import('@/components/site/sections/PublicationsSection').then((m) => m.PublicationsSection),
  { loading: () => <SectionPlaceholder /> },
)
const TeamSection = dynamic(
  () => import('@/components/site/sections/TeamSection').then((m) => m.TeamSection),
  { loading: () => <SectionPlaceholder /> },
)
const NewsSection = dynamic(
  () => import('@/components/site/sections/NewsSection').then((m) => m.NewsSection),
  { loading: () => <SectionPlaceholder /> },
)

function SectionPlaceholder() {
  return <div className="min-h-[50dvh] animate-pulse bg-stone-200/30" aria-hidden />
}

interface HomePageClientProps {
  consonants: Consonant[]
  vowels: Vowel[]
  research: ResearchContent
}

export function HomePageClient({ consonants, vowels, research }: HomePageClientProps) {
  return (
    <>
      <V2ScrollAmbient />
      <SnapScrollLayout>
      <HeroSection />
      <OverviewSection content={research} />
      <SoundArchiveSection consonants={consonants} vowels={vowels} />
      <HunminCarouselSection />
      <PublicationsSection />
      <TeamSection content={research} />
      <NewsSection />
      <ContactSection />
      <SiteFooter />
      </SnapScrollLayout>
    </>
  )
}
