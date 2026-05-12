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
    '한국어 자음과 모음의 조음 과정을 MRI 영상으로 탐구하는 한국어 음성학 연구 아카이브.',
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
