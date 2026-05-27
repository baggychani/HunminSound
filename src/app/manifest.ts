import type { MetadataRoute } from 'next'
import { SITE_TAB_TITLE } from '@/lib/siteMeta'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_TAB_TITLE,
    short_name: '세종말소리',
    description: '훈민정음 창제 원리의 과학적 재조명',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f1eb',
    theme_color: '#f5f1eb',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
