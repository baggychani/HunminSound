/**
 * 관리자 수정 내역 (Admin Change History)
 *
 * - 저장소: src/data/admin-history.json (최근 200개 유지)
 * - 쓰기:   /api/admin/i18n-overrides PATCH 에서 자동 기록
 * - 읽기:   /api/admin/history GET
 */

export type HistoryAction = 'save' | 'remove' | 'dismiss'

export interface HistoryEntry {
  id: string
  timestamp: string       // ISO-8601
  username: string        // 로그인한 관리자 ID
  action: HistoryAction
  key: string             // "consonant:b:description:en"
  type: 'consonant' | 'vowel' | 'hunminPassage'
  itemId: string          // e.g. "b" / "52"
  itemName: string        // e.g. "ㅂ (비읍)" / "[52] 正音二十八字…"
  lang: string            // e.g. "en"
  oldValue?: string       // 이전 번역 (있었을 경우)
  newValue?: string       // 새 번역 (save 액션)
}

export const MAX_HISTORY = 100

export function makeHistoryEntry(
  params: Omit<HistoryEntry, 'id' | 'timestamp'>,
): HistoryEntry {
  return {
    ...params,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
  }
}

/** 키에서 type / itemId / lang 파싱 */
export function parseOverrideKey(key: string): {
  type: 'consonant' | 'vowel' | 'hunminPassage'
  itemId: string
  lang: string
} | null {
  const parts = key.split(':')
  if (parts.length !== 4) return null
  const [type, itemId, , lang] = parts
  if (type !== 'consonant' && type !== 'vowel' && type !== 'hunminPassage') return null
  return { type, itemId: itemId!, lang: lang! }
}

/** 액션 한국어 요약 */
export function describeAction(entry: HistoryEntry): string {
  const langMap: Record<string, string> = {
    en: 'English', zh: '中文', ja: '日本語', fr: 'Français',
    hi: 'हिन्दी', vi: 'Tiếng Việt', ru: 'Русский', ar: 'العربية',
  }
  const typeLabel =
    entry.type === 'consonant'
      ? '자음'
      : entry.type === 'vowel'
        ? '모음'
        : '훈민정음'
  const langLabel = langMap[entry.lang] ?? entry.lang
  if (entry.action === 'save') {
    if (entry.lang === 'ko') return `${typeLabel} ${entry.itemName} · 한국어 설명 수정`
    return `${typeLabel} ${entry.itemName} · ${langLabel} 번역 저장`
  }
  if (entry.action === 'remove') {
    if (entry.lang === 'ko') return `${typeLabel} ${entry.itemName} · 한국어 설명 원본으로 복원`
    return `${typeLabel} ${entry.itemName} · ${langLabel} 번역 삭제 (자동 번역으로 복귀)`
  }
  if (entry.action === 'dismiss') return `${typeLabel} ${entry.itemName} · ${langLabel} 번역 그대로 유지 확인`
  return entry.key
}
