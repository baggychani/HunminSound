import home from '@/data/text/home.json'
import type { SiteTextTable } from '@/data/site-text'

const table: SiteTextTable = home

/** 홈 문구. 원문은 src/data/text/home.json */
export function homeText(id: string, lang: string): string {
  return table[id]?.[lang] ?? ''
}

/** 두 줄로 나눠 쓰는 옛 문구 자리용. 1은 첫 줄, 2는 나머지 줄. */
export function homeLine(id: string, lang: string, part: 1 | 2): string {
  const [first, ...rest] = homeText(id, lang).split('\n')
  return part === 1 ? first : rest.join('\n')
}
