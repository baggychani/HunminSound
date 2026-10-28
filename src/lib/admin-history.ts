/**
 * 관리자 수정 내역 (Admin Change History)
 *
 * - 저장소: src/data/admin-history.json (최근 200개 유지)
 * - 쓰기:   /api/admin/i18n-overrides PATCH 에서 자동 기록
 * - 읽기:   /api/admin/history GET
 */

export type HistoryAction = 'save' | 'remove' | 'dismiss' | 'restore' | 'code' | 'keep'

export type CodeConflict = {
  kind: 'text' | 'research'
  key: string
  label: string
  current: string
  code: string
}

/** 화면에는 저장됐지만 아직 GitHub 코드에 들어가지 않은 글 */
export type CodeOutboxNotice = {
  key: string
  label: string
  username: string
  at: string
  status?: 'blocked' | 'failed'
  error?: string
}

export interface HistoryEntry {
  id: string
  timestamp: string       // ISO-8601
  username: string        // 로그인한 관리자 ID
  action: HistoryAction
  key: string             // "consonant:b:description:en"
  type: 'consonant' | 'vowel' | 'hunminPassage' | 'home' | 'research'
  itemId: string          // e.g. "b" / "52"
  itemName: string        // e.g. "ㅂ (비읍)" / "[52] 正音二十八字…"
  lang: string            // e.g. "en"
  oldValue?: string       // 이전 번역 (있었을 경우)
  newValue?: string       // 새 번역 (save 액션)
  restorable?: boolean
}

export const MAX_HISTORY = 500

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
  type: 'consonant' | 'vowel' | 'hunminPassage' | 'home'
  itemId: string
  lang: string
} | null {
  const parts = key.split(':')
  if (parts.length !== 4) return null
  const [type, itemId, , lang] = parts
  if (type !== 'consonant' && type !== 'vowel' && type !== 'hunminPassage' && type !== 'home') return null
  return { type, itemId: itemId!, lang: lang! }
}

/** 액션 한국어 요약 */
export function describeAction(entry: HistoryEntry): string {
  if (entry.action === 'restore') return `${entry.itemName} · 이전 내용으로 복원`
  if (entry.action === 'code') {
    if (entry.type === 'research') return '연구 소개 · 코드 수정이 반영됨'
    return `${entry.itemName} · 코드 수정이 반영됨`
  }
  if (entry.action === 'keep') {
    if (entry.type === 'research') return '연구 소개 · 코드 수정은 반영하지 않고 화면 글을 유지'
    return `${entry.itemName} · 코드 수정은 반영하지 않고 화면 글을 유지`
  }
  if (entry.type === 'research') {
    if (entry.action === 'remove') return '연구 소개 · 코드 기준본으로 복원'
    if (entry.itemName && entry.itemName !== '연구 소개') return `연구 소개 · ${entry.itemName}`
    return '연구 소개 · 연구진·과제 정보 수정'
  }
  const langMap: Record<string, string> = {
    en: 'English', zh: '中文', ja: '日本語', fr: 'Français', de: 'Deutsch', es: 'Español',
    hi: 'हिन्दी', vi: 'Tiếng Việt', ru: 'Русский', ar: 'العربية',
    tr: 'Türkçe', id: 'Bahasa Indonesia', th: 'ภาษาไทย',
  }
  const typeLabel =
    entry.type === 'consonant'
      ? '자음'
      : entry.type === 'vowel'
        ? '모음'
        : entry.type === 'home'
          ? '메인 페이지'
          : '훈민정음'
  const langLabel = langMap[entry.lang] ?? entry.lang
  if (entry.action === 'save') {
    if (entry.lang === 'ko') return `${typeLabel} ${entry.itemName} · 한국어 설명 수정`
    return `${typeLabel} ${entry.itemName} · ${langLabel} 번역 저장`
  }
  if (entry.action === 'remove') {
    if (entry.lang === 'ko') return `${typeLabel} ${entry.itemName} · 한국어 설명 원본으로 복원`
    return `${typeLabel} ${entry.itemName} · ${langLabel} 기준 번역으로 복원`
  }
  if (entry.action === 'dismiss') return `${typeLabel} ${entry.itemName} · ${langLabel} 번역 그대로 유지 확인`
  return entry.key
}
