import {
  Noto_Sans,
  Noto_Sans_JP,
  Noto_Sans_SC,
  Noto_Sans_Thai,
  Noto_Serif,
  Noto_Serif_JP,
  Noto_Serif_SC,
  Noto_Serif_Thai,
} from 'next/font/google'

/**
 * 한국어 Noto KR에는 없는 문자를 언어별로 채운다.
 * next/font가 빌드 때 woff2를 받아 우리 도메인에서 제공한다.
 * preload는 끈다. 한국어 첫 화면이 일본어·중국어 파일을 받지 않게.
 * 인자는 리터럴만 허용된다. 공통 객체를 펼치면 빌드가 거절한다.
 */

export const notoSerifJp = Noto_Serif_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-serif-ja',
  display: 'swap',
  preload: false,
})

export const notoSansJp = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-sans-ja',
  display: 'swap',
  preload: false,
})

export const notoSerifSc = Noto_Serif_SC({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-serif-sc',
  display: 'swap',
  preload: false,
})

export const notoSansSc = Noto_Sans_SC({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-sans-sc',
  display: 'swap',
  preload: false,
})

export const notoSerifThai = Noto_Serif_Thai({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'thai'],
  variable: '--font-serif-thai',
  display: 'swap',
  preload: false,
})

export const notoSansThai = Noto_Sans_Thai({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'thai'],
  variable: '--font-sans-thai',
  display: 'swap',
  preload: false,
})

export const notoSerifCyr = Noto_Serif({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-serif-cyr',
  display: 'swap',
  preload: false,
})

export const notoSansCyr = Noto_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans-cyr',
  display: 'swap',
  preload: false,
})

/** 베트남어 성조, 터키어 ğ ş ı */
export const notoSerifExt = Noto_Serif({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-serif-ext',
  display: 'swap',
  preload: false,
})

export const notoSansExt = Noto_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-sans-ext',
  display: 'swap',
  preload: false,
})

export const languageFontVariables = [
  notoSerifJp,
  notoSansJp,
  notoSerifSc,
  notoSansSc,
  notoSerifThai,
  notoSansThai,
  notoSerifCyr,
  notoSansCyr,
  notoSerifExt,
  notoSansExt,
]
  .map((font) => font.variable)
  .join(' ')
