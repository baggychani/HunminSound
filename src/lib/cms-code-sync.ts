import { createHash } from 'crypto'
import { parseOverrideKey, type CodeConflict } from '@/lib/admin-history'
import type { OverridesStore, TranslationOverride } from '@/lib/i18n-overrides'
import type { ResearchContent } from '@/lib/research-content'

export function textStamp(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

export function researchStamp(data: ResearchContent): string {
  return textStamp(JSON.stringify(data))
}

export type CodeSyncState = {
  overrides: OverridesStore
  research: ResearchContent
  researchCodeVersion?: string
  researchCodeConflict?: boolean
  researchCodeDeclined?: string
  syncedCodeStamp?: string
}

export type CodeSyncPlan = {
  overrides: OverridesStore
  research: ResearchContent
  researchCodeVersion: string
  researchCodeConflict: boolean
  researchCodeDeclined?: string
  syncedCodeStamp: string
  textChanges: { key: string; before: TranslationOverride; after: TranslationOverride }[]
  researchChange: { before: ResearchContent; after: ResearchContent } | null
  changed: boolean
}

function clip(value: string): string {
  const flat = value.replace(/\s+/g, ' ').trim()
  if (!flat) return '없음'
  return flat.length <= 180 ? flat : `${flat.slice(0, 180)}…`
}

export function codeChangeLabel(key: string): string {
  const parsed = parseOverrideKey(key)
  if (!parsed) return key
  const typeLabel =
    parsed.type === 'consonant' ? '자음'
      : parsed.type === 'vowel' ? '모음'
        : parsed.type === 'home' ? '메인 페이지'
          : '훈민정음'
  const lang = parsed.lang === 'ko' ? '한국어' : parsed.lang
  return `${typeLabel} ${parsed.itemId} · ${lang}`
}

function withoutChoice(entry: TranslationOverride): TranslationOverride {
  const next = { ...entry }
  delete next.pendingCode
  delete next.codeDeclined
  return next
}

export function codeContentStamp(baseline: { overrides: OverridesStore; research: ResearchContent }): string {
  const parts: string[] = []
  for (const key of Object.keys(baseline.overrides).sort()) parts.push(key, baseline.overrides[key].value)
  parts.push(researchStamp(baseline.research))
  return textStamp(parts.join('\n'))
}

/** 배포된 코드와 화면 글을 맞춘다. 양쪽이 서로 다르게 고친 문장은 덮지 않는다. */
export function planCodeSync(
  state: CodeSyncState,
  baseline: { overrides: OverridesStore; research: ResearchContent },
  stamp = codeContentStamp(baseline),
): CodeSyncPlan {
  const overrides: OverridesStore = { ...state.overrides }
  const textChanges: CodeSyncPlan['textChanges'] = []
  let overridesChanged = false

  for (const key of Object.keys(baseline.overrides)) {
    const codeText = baseline.overrides[key].value
    const codeHash = textStamp(codeText)
    const stored = overrides[key]
    if (!stored) {
      const after: TranslationOverride = { ...baseline.overrides[key], codeVersion: codeHash }
      overrides[key] = after
      textChanges.push({ key, before: { ...after, value: '', updatedAt: '' }, after })
      overridesChanged = true
      continue
    }
    if (!stored.codeVersion) {
      overrides[key] = { ...stored, codeVersion: codeHash }
      overridesChanged = true
      continue
    }
    if (stored.codeDeclined === codeHash) continue
    if (stored.codeVersion === codeHash) {
      if (stored.pendingCode && stored.value === codeText) {
        overrides[key] = withoutChoice(stored)
        overridesChanged = true
      }
      continue
    }
    if (textStamp(stored.value) === stored.codeVersion || stored.value === codeText) {
      const aligned = stored.value === codeText && !stored.pendingCode && !stored.codeDeclined
      const after = withoutChoice({ ...stored, value: codeText, codeVersion: codeHash })
      if (!aligned || stored.codeVersion !== codeHash) {
        overrides[key] = after
        overridesChanged = true
        if (stored.value !== codeText) textChanges.push({ key, before: stored, after })
      }
      continue
    }
    if (stored.pendingCode !== codeText) {
      overrides[key] = { ...stored, pendingCode: codeText }
      overridesChanged = true
    }
  }

  const codeHash = researchStamp(baseline.research)
  const storeHash = researchStamp(state.research)
  let research = state.research
  let researchCodeVersion = state.researchCodeVersion ?? ''
  let researchCodeConflict = false
  let researchCodeDeclined = state.researchCodeDeclined
  let researchChange: CodeSyncPlan['researchChange'] = null

  if (state.researchCodeDeclined === codeHash) {
    researchCodeConflict = false
  } else if (!state.researchCodeVersion) {
    researchCodeVersion = codeHash
    researchCodeConflict = storeHash !== codeHash
  } else if (state.researchCodeVersion === codeHash) {
    researchCodeConflict = storeHash !== codeHash
  } else if (storeHash === state.researchCodeVersion || storeHash === codeHash) {
    if (storeHash !== codeHash) {
      research = baseline.research
      researchChange = { before: state.research, after: baseline.research }
    }
    researchCodeVersion = codeHash
    researchCodeConflict = false
    researchCodeDeclined = undefined
  } else {
    researchCodeConflict = true
  }

  const declinedSame = (researchCodeDeclined || undefined) === (state.researchCodeDeclined || undefined)
  const changed = overridesChanged || researchChange !== null || researchCodeVersion !== (state.researchCodeVersion ?? '')
    || researchCodeConflict !== (state.researchCodeConflict === true) || !declinedSame || stamp !== state.syncedCodeStamp

  return {
    overrides, research, researchCodeVersion, researchCodeConflict, researchCodeDeclined, syncedCodeStamp: stamp,
    textChanges, researchChange, changed,
  }
}

export function listCodeConflicts(state: { overrides: OverridesStore; researchCodeConflict?: boolean }): CodeConflict[] {
  const conflicts: CodeConflict[] = []
  if (state.researchCodeConflict) {
    conflicts.push({
      kind: 'research', key: 'research', label: '연구 소개',
      current: '화면에 저장한 연구 소개', code: '배포된 코드의 연구 소개',
    })
  }
  for (const [key, entry] of Object.entries(state.overrides)) {
    if (!entry.pendingCode) continue
    conflicts.push({ kind: 'text', key, label: codeChangeLabel(key), current: clip(entry.value), code: clip(entry.pendingCode) })
  }
  return conflicts
}
