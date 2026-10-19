import type { MetadataRoute } from 'next'
import { consonantsData } from '@/data/consonants'
import { vowelsData } from '@/data/vowels'
import { SITE_URL } from '@/lib/siteMeta'

const PUBLIC_ROUTES: { path: string; priority: number }[] = [
  { path: '', priority: 1 },
  { path: '/consonants', priority: 0.8 },
  { path: '/vowels', priority: 0.8 },
  { path: '/hunminjeongeum', priority: 0.8 },
  { path: '/research', priority: 0.6 },
  { path: '/privacy', priority: 0.2 },
]

const PHONEME_ROUTES = [
  ...consonantsData.map((item) => `/consonants/${item._id}`),
  ...vowelsData.map((item) => `/vowels/${item._id}`),
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    ...PUBLIC_ROUTES.map(({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority,
    })),
    ...PHONEME_ROUTES.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
