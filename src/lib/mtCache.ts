import type { Lang } from '@/lib/i18n'
import mtFile from '@/data/mt-cache.json'

const file = mtFile as { version: number; entries: Record<string, string> }

/** 로컬 스토리지 키 접두사 */
export const MT_LS_PREFIX = 'sejong-mt:v4:'

/** 한글 원문이 바뀌면 해시가 바뀌어 번들·로컬 캐시가 자동 무효화됨 */
export function hashKoSource(text: string): string {
  let h = 0
  for (let i = 0; i < text.length; i++) {
    h = (Math.imul(31, h) + text.charCodeAt(i)) | 0
  }
  return (h >>> 0).toString(16)
}

/** 키에 버전을 넣어 MT 알고리즘(따옴표 보존 등)이 바뀌면 이전 번들·LS 캐시와 분리 */
export function buildMtKey(itemId: string, lang: Lang, koSource: string): string {
  return `${itemId}|${lang}|qprot-ph|${hashKoSource(koSource)}`
}

export function getBundledMachineTranslation(key: string): string | undefined {
  const t = file.entries[key]
  return typeof t === 'string' && t.trim() ? t : undefined
}
