import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/siteMeta'

const PUBLIC_ROUTES: { path: string; priority: number }[] = [
  { path: '', priority: 1 },
  { path: '/consonants', priority: 0.8 },
  { path: '/vowels', priority: 0.8 },
  { path: '/hunminjeongeum', priority: 0.8 },
  { path: '/research', priority: 0.6 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return PUBLIC_ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: 'monthly',
    priority,
  }))
}
