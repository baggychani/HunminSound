import type { Metadata } from 'next'
import {
  Noto_Serif_KR,
  Noto_Sans_KR,
  Noto_Sans_Devanagari,
  Noto_Sans_Arabic,
} from 'next/font/google'
import { Providers } from '@/components/theme/Providers'
import './globals.css'

const notoSerifKr = Noto_Serif_KR({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  preload: false,
})

const notoSansKr = Noto_Sans_KR({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: false,
})

const notoSansDevanagari = Noto_Sans_Devanagari({
  weight: ['400', '500', '600'],
  subsets: ['devanagari'],
  variable: '--font-devanagari',
  display: 'swap',
  preload: false,
})

const notoSansArabic = Noto_Sans_Arabic({
  weight: ['400', '500', '600', '700'],
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  title: {
    default: '세종말소리 · Sejong Speech Sounds',
    template: '%s · 세종말소리',
  },
  description:
    '1443년 세종이 훈민정음(訓民正音)으로 제시한 상형 원리를 MRI·음성공학·AI 융합으로 실증하는 세종말소리.',
  keywords: ['한국어', '음성학', '조음', 'MRI', '자음', '모음', 'phonetics', 'Korean', 'articulation'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${notoSerifKr.variable} ${notoSansKr.variable} ${notoSansDevanagari.variable} ${notoSansArabic.variable}`}
    >
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
