import fs from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import { Redis } from '@upstash/redis'
import { codeBaseline } from '@/lib/cms-baseline'
import type { OverridesStore, TranslationOverride } from '@/lib/i18n-overrides'
import { makeHistoryEntry, MAX_HISTORY, type CodeConflict, type HistoryEntry } from '@/lib/admin-history'
import { validateResearchContent, type ResearchContent } from '@/lib/research-content'
import { summarizeResearchChange } from '@/lib/research-history'
import { codeChangeLabel, codeContentStamp, listCodeConflicts, planCodeSync, researchStamp, textStamp } from '@/lib/cms-code-sync'
import { codeAcceptStamp, pushOutboxToGithub, type CodeOutboxItem } from '@/lib/cms-code-writeback'

const KEY = 'hunminsound:cms:v2:current'
const BASELINE_KEY = 'hunminsound:cms:v2:baseline'
const OUTBOX_KEY = 'hunminsound:cms:v2:code-outbox'
const BACKFILL_KEY = 'hunminsound:cms:v2:code-backfill'
export const cmsDirectory = () => process.env.CMS_LOCAL_DIR || path.join(process.cwd(), '.cms')
export class CmsConflictError extends Error {}
type Content = { overrides: OverridesStore; research: ResearchContent }
type State = Content & {
  version: 2
  revision: string
  history: HistoryEntry[]
  researchCodeVersion?: string
  researchCodeConflict?: boolean
  researchCodeDeclined?: string
  syncedCodeStamp?: string
}
type Change = { kind: 'text'; key: string; before: TranslationOverride; after: TranslationOverride }
  | { kind: 'research'; before: ResearchContent; after: ResearchContent }
type Event = { change: Change; entry: HistoryEntry }

let redis: Redis | null | undefined
export function getCmsRedis(): Redis | null {
  if (redis !== undefined) return redis
  const pairs = [
    ['KV_REST_API_URL', 'KV_REST_API_TOKEN'], ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'],
    ['STORAGE_KV_REST_API_URL', 'STORAGE_KV_REST_API_TOKEN'], ['STORAGE_REST_API_URL', 'STORAGE_REST_API_TOKEN'],
    ['STORAGE_URL', 'STORAGE_TOKEN'],
    ...Object.keys(process.env).filter((k) => k.endsWith('_REST_API_URL')).map((k) => [k, k.replace('_REST_API_URL', '_REST_API_TOKEN')]),
  ]
  const pair = pairs.find(([url, token]) => process.env[url] && process.env[token])
  redis = pair ? new Redis({ url: process.env[pair[0]]!, token: process.env[pair[1]]! }) : null
  return redis
}

async function readJson<T>(file: string): Promise<T | null> {
  try { return JSON.parse(await fs.readFile(file, 'utf8')) as T }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw error // 읽기 실패나 손상을 빈 저장소로 취급하지 않는다.
  }
}

async function localLock<T>(fn: () => Promise<T>): Promise<T> {
  await fs.mkdir(cmsDirectory(), { recursive: true })
  const lock = path.join(cmsDirectory(), 'write.lock')
  const deadline = Date.now() + 10000
  let handle
  while (!handle) {
    try { handle = await fs.open(lock, 'wx') }
    catch (e) {
      if ((e as NodeJS.ErrnoException).code !== 'EEXIST') throw e
      if (Date.now() >= deadline) throw new Error('CMS_BUSY')
      await new Promise((r) => setTimeout(r, 40))
    }
  }
  try { return await fn() }
  finally { await handle.close(); await fs.unlink(lock) }
}

async function atomicFile(file: string, value: unknown) {
  const temp = `${file}.${randomUUID()}.tmp`
  await fs.writeFile(temp, JSON.stringify(value), 'utf8')
  try { await fs.rename(temp, file) }
  finally { await fs.unlink(temp).catch(() => {}) }
}

function checkState(state: State): State {
  if (state.version !== 2 || !state.revision || !state.overrides || !Array.isArray(state.history) ||
      validateResearchContent(state.research) !== true) throw new Error('CMS_INVALID_STATE')
  return state
}

/** 기존 저장본을 지우지 않고 이동한다. 코드 기준본과 이전 데이터는 별도로 보존한다. */
let deployedCache: { baseline: ReturnType<typeof codeBaseline>; stamp: string } | null = null
function deployedCode() {
  if (!deployedCache) {
    const baseline = codeBaseline()
    deployedCache = { baseline, stamp: codeContentStamp(baseline) }
  }
  return deployedCache
}

async function initialState(): Promise<{ state: State; backup: unknown }> {
  const { baseline, stamp } = deployedCode()
  const client = getCmsRedis()
  const legacyOverrides = client
    ? await client.get<OverridesStore>('hunminsound:cms:i18n-overrides')
    : await readJson<OverridesStore>(path.join(process.cwd(), 'src/data/i18n-overrides.json'))
  const legacyHistory = client
    ? await client.get<HistoryEntry[]>('hunminsound:cms:admin-history')
    : await readJson<HistoryEntry[]>(path.join(process.cwd(), 'src/data/admin-history.json'))
  // 연구 소개의 기존 정본은 배포된 코드다. 폐기한 과거 Redis 연구 키는 되살리지 않는다.
  const overrides: OverridesStore = {}
  for (const [key, entry] of Object.entries(baseline.overrides)) {
    overrides[key] = { ...entry, codeVersion: textStamp(entry.value) }
  }
  for (const [key, value] of Object.entries(legacyOverrides ?? {})) {
    if (!overrides[key]) continue
    overrides[key] = { ...value, codeVersion: textStamp(baseline.overrides[key].value) }
  }
  return {
    state: {
      version: 2, revision: randomUUID(), overrides, research: baseline.research,
      history: (legacyHistory ?? []).slice(0, MAX_HISTORY),
      researchCodeVersion: researchStamp(baseline.research), researchCodeConflict: false, syncedCodeStamp: stamp,
    },
    backup: { createdAt: new Date().toISOString(), baseline, legacyOverrides, legacyHistory },
  }
}

async function readStoredState(): Promise<State> {
  const client = getCmsRedis()
  if (client) {
    const existing = await client.get<State>(KEY)
    if (existing) return checkState(existing)
    const { state, backup } = await initialState()
    await client.eval(`if redis.call('EXISTS', KEYS[1]) == 0 then
      if redis.call('EXISTS', KEYS[2]) == 1 then return -1 end
      redis.call('SET', KEYS[2], ARGV[2]); redis.call('SET', KEYS[1], ARGV[1]); return 1 end return 0`,
    [KEY, BASELINE_KEY], [JSON.stringify(state), JSON.stringify(backup)])
    const initialized = await client.get<State>(KEY)
    if (!initialized) throw new Error('CMS_RECOVERY_REQUIRED')
    return checkState(initialized)
  }
  if (process.env.VERCEL === '1') throw new Error('CMS_CLOUD_STORAGE_REQUIRED')
  const file = path.join(cmsDirectory(), 'current.json')
  const existing = await readJson<State>(file)
  if (existing) return checkState(existing)
  return localLock(async () => {
    const current = await readJson<State>(file)
    if (current) return checkState(current)
    const { state, backup } = await initialState()
    // 현재 파일만 사라진 경우 기존 기준본을 덮어쓰거나 조용히 초기화하지 않는다.
    await fs.writeFile(path.join(cmsDirectory(), 'baseline.json'), JSON.stringify(backup), { flag: 'wx' })
    await atomicFile(file, state)
    return state
  })
}

async function commitMany(previous: State, next: State, events: Event[]): Promise<void> {
  const client = getCmsRedis()
  if (client) {
    const payload = events.map((event) => ({ key: `hunminsound:cms:v2:event:${event.entry.id}`, value: JSON.stringify(event) }))
    const ok = await client.eval(`local current = redis.call('GET', KEYS[1])
      if not current or cjson.decode(current).revision ~= ARGV[1] then return 0 end
      local events = cjson.decode(ARGV[3])
      for i, event in ipairs(events) do redis.call('SET', event.key, event.value) end
      redis.call('SET', KEYS[1], ARGV[2])
      return 1`,
    [KEY], [previous.revision, JSON.stringify(next), JSON.stringify(payload)])
    if (ok !== 1) throw new CmsConflictError()
    return
  }
  await localLock(async () => {
    const file = path.join(cmsDirectory(), 'current.json')
    const current = await readJson<State>(file)
    if (current?.revision !== previous.revision) throw new CmsConflictError()
    if (events.length) {
      await fs.mkdir(path.join(cmsDirectory(), 'history'), { recursive: true })
      for (const event of events) {
        // 복원 자료 기록이 성공한 뒤에만 현재 파일을 원자적으로 교체한다.
        await fs.writeFile(path.join(cmsDirectory(), 'history', `${event.entry.id}.json`), JSON.stringify(event), { flag: 'wx' })
      }
    }
    await atomicFile(file, next)
  })
}

async function commit(previous: State, next: State, event: Event): Promise<void> {
  await commitMany(previous, next, [event])
}

function eventsForCodePlan(plan: ReturnType<typeof planCodeSync>): Event[] {
  const events: Event[] = []
  for (const change of plan.textChanges) {
    const after = { ...change.after, updatedAt: randomUUID() }
    plan.overrides[change.key] = after
    events.push({
      change: { kind: 'text', key: change.key, before: change.before, after },
      entry: historyFor({ kind: 'text', key: change.key, before: change.before, after }, '코드', 'code', codeChangeLabel(change.key)),
    })
  }
  if (plan.researchChange) {
    events.push({
      change: { kind: 'research', before: plan.researchChange.before, after: plan.researchChange.after },
      entry: historyFor({ kind: 'research', before: plan.researchChange.before, after: plan.researchChange.after }, '코드', 'code', '연구 소개'),
    })
  }
  return events
}

async function syncDeployedCode(state: State, allowRetry = true): Promise<State> {
  const { baseline, stamp } = deployedCode()
  if (state.syncedCodeStamp === stamp && state.researchCodeVersion) return state
  const plan = planCodeSync(state, baseline, stamp)
  if (!plan.changed) return state
  const events = eventsForCodePlan(plan)
  const next: State = {
    ...state,
    overrides: plan.overrides,
    research: plan.research,
    researchCodeVersion: plan.researchCodeVersion,
    researchCodeConflict: plan.researchCodeConflict,
    researchCodeDeclined: plan.researchCodeDeclined,
    syncedCodeStamp: plan.syncedCodeStamp,
    revision: randomUUID(),
    history: events.map((event) => event.entry).reverse().concat(state.history).slice(0, MAX_HISTORY),
  }
  try {
    await commitMany(state, next, events)
  } catch (error) {
    if (!(error instanceof CmsConflictError) || !allowRetry) throw error
    return syncDeployedCode(await readStoredState(), false)
  }
  const takenByCode = plan.textChanges.map((change) => change.key)
  if (plan.researchChange) takenByCode.push('research')
  if (takenByCode.length) await dropOutbox(takenByCode).catch((error) => console.error('[cms] code outbox cleanup failed:', error))
  if (plan.researchChange) {
    const kept = new Set(photoNamesOf(plan.researchChange.after))
    const candidates = photoNamesOf(plan.researchChange.before).filter((name) => !kept.has(name))
    await releasePhotos(candidates)
  }
  return next
}

export async function readCmsState(): Promise<State> {
  const state = await readStoredState()
  try {
    return await syncDeployedCode(state)
  } catch (error) {
    console.error('[cms] code sync failed:', error)
    return state
  }
}

export function currentCodeConflicts(state: State): CodeConflict[] {
  return listCodeConflicts(state)
}

function historyFor(change: Change, username: string, action: HistoryEntry['action'], name?: string): HistoryEntry {
  const research = change.kind === 'research' ? summarizeResearchChange(change.before, change.after) : null
  const [type, id, , lang] = change.kind === 'text' ? change.key.split(':') : ['research', 'research', '', 'ko']
  return {
    ...makeHistoryEntry({ username, action, key: change.kind === 'text' ? change.key : 'research',
      type: type as HistoryEntry['type'], itemId: id, itemName: research?.label ?? name ?? id, lang,
      oldValue: change.kind === 'text' ? change.before.value.slice(0, 3000) : research!.oldValue,
      newValue: change.kind === 'text' ? change.after.value.slice(0, 3000) : research!.newValue }),
    id: randomUUID(), restorable: true,
  }
}

async function saveChange(
  previous: State, change: Change, username: string, action: HistoryEntry['action'], name?: string,
  historyValues?: { oldValue: string; newValue: string },
) {
  const entry = historyFor(change, username, action, name)
  if (historyValues) {
    entry.oldValue = historyValues.oldValue
    entry.newValue = historyValues.newValue
  }
  const next: State = { ...previous, revision: randomUUID(), history: [entry, ...previous.history].slice(0, MAX_HISTORY) }
  if (change.kind === 'text') next.overrides = { ...previous.overrides, [change.key]: change.after }
  else next.research = change.after
  await commit(previous, next, { change, entry })
  const dropped = previous.history.slice(MAX_HISTORY - 1)
  if (change.kind === 'research' || dropped.some((item) => item.type === 'research' && item.restorable)) {
    const candidates: string[] = []
    if (change.kind === 'research') {
      const kept = new Set(photoNamesOf(change.after))
      for (const photoName of photoNamesOf(change.before)) if (!kept.has(photoName)) candidates.push(photoName)
    }
    for (const item of dropped) candidates.push(...await eventPhotoNames(item))
    await releasePhotos(candidates)
  }
  return next
}

export async function saveText(input: {
  key: string; value?: string; sourceSnapshot?: string; remove?: boolean; staleDismissed?: boolean;
  expectedVersion: string | null; displayName?: string;
}, username: string): Promise<OverridesStore> {
  const current = await readCmsState()
  const baseline = codeBaseline().overrides[input.key]
  if (!baseline) throw new Error('CMS_INVALID_KEY')
  const before = current.overrides[input.key] ?? { ...baseline }
  if ((before.updatedAt || null) !== input.expectedVersion) throw new CmsConflictError()
  const after = input.remove ? { ...baseline } : input.staleDismissed
    ? { ...before, staleDismissed: true }
    : { ...before, value: input.value!, sourceSnapshot: input.sourceSnapshot!, staleDismissed: false }
  after.updatedAt = randomUUID() // 같은 밀리초에 저장해도 구분되는 항목 버전
  const codeHash = textStamp(baseline.value)
  if (input.remove) {
    after.codeVersion = codeHash
    delete after.pendingCode
    delete after.codeDeclined
  } else {
    after.codeVersion = before.codeVersion ?? codeHash
    if (before.pendingCode && after.value !== before.pendingCode) after.pendingCode = before.pendingCode
    if (before.codeDeclined) after.codeDeclined = before.codeDeclined
    if (after.pendingCode && after.value === after.pendingCode) {
      after.codeVersion = textStamp(after.pendingCode)
      delete after.pendingCode
      delete after.codeDeclined
    }
  }
  const next = await saveChange(current, { kind: 'text', key: input.key, before, after }, username,
    input.remove ? 'remove' : input.staleDismissed ? 'dismiss' : 'save', input.displayName)
  if (after.value !== before.value) await sendTextToCode(input.key, before.value, after.value, username)
  return next.overrides
}

export const researchVersion = researchStamp
export async function readResearchContent() { return (await readCmsState()).research }
export async function readResearchContentForAdmin() {
  const data = await readResearchContent()
  return { data, sha: researchVersion(data) }
}
export async function writeResearchContent(data: ResearchContent, version: string | null, username: string) {
  const current = await readCmsState()
  if (version !== researchVersion(current.research)) throw new CmsConflictError()
  if (validateResearchContent(data) !== true) throw new Error('CMS_INVALID_RESEARCH')
  await saveChange(current, { kind: 'research', before: current.research, after: data }, username, 'save', '연구 소개')
  await sendResearchToCode(current.research, data, username)
  return researchVersion(data)
}
export async function restoreResearchBaseline(version: string | null, username: string) {
  const current = await readCmsState()
  if (version !== researchVersion(current.research)) throw new CmsConflictError()
  const after = codeBaseline().research
  if (validateResearchContent(after) !== true) throw new Error('CMS_INVALID_RESEARCH')
  await saveChange(current, { kind: 'research', before: current.research, after }, username, 'remove', '연구 소개')
  await sendResearchToCode(current.research, after, username)
  return researchVersion(after)
}
const PHOTO_NAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/
const PHOTO_PREFIX = 'hunminsound:cms:v2:photo:'
const MAX_PHOTO_BYTES = 4 * 1024 * 1024

function photoFile(name: string): string {
  if (!PHOTO_NAME.test(name)) throw new Error('CMS_INVALID_PHOTO')
  const dir = path.join(cmsDirectory(), 'photos')
  const file = path.join(dir, name)
  const relative = path.relative(dir, file)
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('CMS_INVALID_PHOTO')
  return file
}

export async function writeTeamPhoto(name: string, bytes: Buffer): Promise<string> {
  if (bytes.length === 0 || bytes.length > MAX_PHOTO_BYTES) throw new Error('CMS_INVALID_PHOTO')
  const file = photoFile(name)
  const client = getCmsRedis()
  if (client) {
    await client.set(`${PHOTO_PREFIX}${name}`, bytes.toString('base64'))
    return `/media/team/${name}`
  }
  if (process.env.VERCEL === '1') throw new Error('CMS_CLOUD_STORAGE_REQUIRED')
  await fs.mkdir(path.dirname(file), { recursive: true })
  const temp = `${file}.${randomUUID()}.tmp`
  await fs.writeFile(temp, bytes)
  try { await fs.rename(temp, file) }
  finally { await fs.unlink(temp).catch(() => {}) }
  return `/media/team/${name}`
}

export async function readTeamPhoto(name: string): Promise<Buffer | null> {
  let file: string
  try { file = photoFile(name) }
  catch { return null }
  const client = getCmsRedis()
  if (client) {
    const stored = await client.get<string>(`${PHOTO_PREFIX}${name}`)
    if (typeof stored !== 'string' || !stored) return null
    return Buffer.from(stored, 'base64')
  }
  if (process.env.VERCEL === '1') throw new Error('CMS_CLOUD_STORAGE_REQUIRED')
  try { return await fs.readFile(file) }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw error
  }
}

function mediaPhotoName(src: string | undefined): string | null {
  const name = src?.startsWith('/media/team/') ? src.slice('/media/team/'.length) : ''
  return PHOTO_NAME.test(name) ? name : null
}

function photoNamesOf(data: ResearchContent): string[] {
  const names: string[] = []
  for (const row of data.team.rows) {
    const name = mediaPhotoName(row.photo)
    if (name && !names.includes(name)) names.push(name)
  }
  return names
}

async function readEvent(id: string): Promise<Event | null> {
  if (!/^[a-f0-9-]{36}$/.test(id)) return null
  const client = getCmsRedis()
  return client
    ? client.get<Event>(`hunminsound:cms:v2:event:${id}`)
    : readJson<Event>(path.join(cmsDirectory(), 'history', `${id}.json`))
}

async function eventPhotoNames(entry: HistoryEntry): Promise<string[]> {
  if (entry.type !== 'research' || !entry.restorable) return []
  const event = await readEvent(entry.id)
  if (!event || event.change.kind !== 'research') return []
  return [...photoNamesOf(event.change.before), ...photoNamesOf(event.change.after)]
}

export async function deleteTeamPhoto(name: string): Promise<void> {
  const file = photoFile(name)
  const client = getCmsRedis()
  if (client) {
    await client.del(`${PHOTO_PREFIX}${name}`)
    return
  }
  if (process.env.VERCEL === '1') throw new Error('CMS_CLOUD_STORAGE_REQUIRED')
  await fs.unlink(file).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== 'ENOENT') throw error
  })
}

// 현재 페이지나 되돌릴 수 있는 수정 이력이 아직 쓰는 사진은 지우지 않는다.
async function releasePhotos(candidates: string[]) {
  const pending = Array.from(new Set(candidates))
  if (pending.length === 0) return
  try {
    const state = await readCmsState()
    const keep = new Set(photoNamesOf(state.research))
    for (const entry of state.history) {
      for (const name of await eventPhotoNames(entry)) keep.add(name)
    }
    for (const name of pending) {
      if (!keep.has(name)) await deleteTeamPhoto(name)
    }
  } catch (error) {
    console.error('[cms] unused photo cleanup failed:', error)
  }
}

export async function discardTeamPhoto(src: string): Promise<void> {
  const name = mediaPhotoName(src)
  if (!name) throw new Error('CMS_INVALID_PHOTO')
  await releasePhotos([name])
}

export async function readOverridesStore() { return (await readCmsState()).overrides }
export async function readAdminHistory() { return (await readCmsState()).history }

function pinRestoredText(key: string, previous: TranslationOverride): TranslationOverride {
  const codeText = deployedCode().baseline.overrides[key]?.value
  const after: TranslationOverride = { ...previous, updatedAt: randomUUID() }
  delete after.pendingCode
  if (codeText === undefined) return after
  after.codeVersion = textStamp(codeText)
  if (after.value !== codeText) after.codeDeclined = textStamp(codeText)
  else delete after.codeDeclined
  return after
}

export async function restoreCmsEntry(id: string, expectedRevision: string, username: string) {
  if (!/^[a-f0-9-]{36}$/.test(id)) throw new Error('CMS_INVALID_HISTORY')
  const current = await readCmsState()
  if (current.revision !== expectedRevision) throw new CmsConflictError()
  const event = await readEvent(id)
  if (!event) throw new Error('CMS_INVALID_HISTORY')
  if (event.change.kind === 'text') {
    const key = event.change.key
    const before = current.overrides[key]
    const after = pinRestoredText(key, event.change.before)
    await saveChange(current, { kind: 'text', key, before, after }, username, 'restore', event.entry.itemName)
    if (after.value !== before?.value) await sendTextToCode(key, before?.value ?? '', after.value, username)
    return
  }
  const after = event.change.before
  const codeHash = researchStamp(deployedCode().baseline.research)
  const prepared: State = {
    ...current,
    researchCodeConflict: false,
    researchCodeDeclined: researchStamp(after) === codeHash ? undefined : codeHash,
  }
  await saveChange(prepared, { kind: 'research', before: current.research, after }, username, 'restore', event.entry.itemName)
  await sendResearchToCode(current.research, after, username)
}

export async function resolveCodeConflict(
  input: { kind: 'text' | 'research'; key?: string; choice: 'code' | 'keep' },
  revision: string,
  username: string,
) {
  if (input.choice !== 'code' && input.choice !== 'keep') throw new Error('CMS_INVALID_CONFLICT')
  const current = await readCmsState()
  if (current.revision !== revision) throw new CmsConflictError()
  if (input.kind === 'research') {
    if (!current.researchCodeConflict) throw new Error('CMS_INVALID_CONFLICT')
    const codeResearch = deployedCode().baseline.research
    const codeHash = researchStamp(codeResearch)
    if (input.choice === 'code') {
      const prepared: State = { ...current, researchCodeVersion: codeHash, researchCodeConflict: false, researchCodeDeclined: undefined }
      await saveChange(prepared, { kind: 'research', before: current.research, after: codeResearch }, username, 'code', '연구 소개')
      await dropOutbox(['research'])
      return
    }
    const prepared: State = { ...current, researchCodeConflict: false, researchCodeDeclined: codeHash }
    await saveChange(prepared, { kind: 'research', before: current.research, after: current.research }, username, 'keep', '연구 소개', {
      oldValue: '배포된 코드의 연구 소개', newValue: '화면에 저장한 연구 소개',
    })
    await sendResearchToCode(codeResearch, current.research, username)
    return
  }
  if (input.kind !== 'text' || !input.key) throw new Error('CMS_INVALID_CONFLICT')
  const before = current.overrides[input.key]
  if (!before?.pendingCode || !deployedCode().baseline.overrides[input.key]) throw new Error('CMS_INVALID_CONFLICT')
  if (input.choice === 'code') {
    const after: TranslationOverride = {
      ...before, value: before.pendingCode, codeVersion: textStamp(before.pendingCode), updatedAt: randomUUID(),
    }
    delete after.pendingCode
    delete after.codeDeclined
    await saveChange(current, { kind: 'text', key: input.key, before, after }, username, 'code', codeChangeLabel(input.key))
    await dropOutbox([input.key])
    return
  }
  const after: TranslationOverride = { ...before, codeDeclined: textStamp(before.pendingCode) }
  delete after.pendingCode
  await saveChange(current, { kind: 'text', key: input.key, before, after }, username, 'keep', codeChangeLabel(input.key), {
    oldValue: before.pendingCode, newValue: before.value,
  })
  await sendTextToCode(input.key, before.pendingCode, before.value, username)
}

// ── 관리자 화면 저장 → GitHub 코드 ─────────────────────────────────────────────
// 화면 글은 위에서 이미 바뀌었다. 여기서 실패해도 저장은 그대로 두고, 대기열에 남겨 다시 시도한다.

type OutboxSettle = { key: string; id: string; remove: boolean; status?: CodeOutboxItem['status']; error?: string }

const outboxFile = () => path.join(cmsDirectory(), 'code-outbox.json')

function parseOutboxValue(value: unknown): CodeOutboxItem | null {
  const item = typeof value === 'string' ? JSON.parse(value) as CodeOutboxItem : value as CodeOutboxItem
  return item && typeof item.key === 'string' && typeof item.id === 'string' ? item : null
}

export async function readCodeOutbox(): Promise<CodeOutboxItem[]> {
  const client = getCmsRedis()
  const raw = client
    ? await client.hgetall<Record<string, unknown>>(OUTBOX_KEY)
    : await readJson<Record<string, CodeOutboxItem>>(outboxFile())
  return Object.values(raw ?? {}).map(parseOutboxValue).filter((item): item is CodeOutboxItem => item !== null)
    .sort((a, b) => a.at.localeCompare(b.at))
}

async function putOutbox(items: CodeOutboxItem[]): Promise<void> {
  if (items.length === 0) return
  const client = getCmsRedis()
  const merge = (previous: CodeOutboxItem | null, item: CodeOutboxItem): CodeOutboxItem =>
    previous ? { ...item, accept: Array.from(new Set([...item.accept, ...previous.accept])) } : item
  if (client) {
    for (const item of items) {
      const previous = parseOutboxValue(await client.hget(OUTBOX_KEY, item.key))
      await client.hset(OUTBOX_KEY, { [item.key]: JSON.stringify(merge(previous, item)) })
    }
    return
  }
  if (process.env.VERCEL === '1') throw new Error('CMS_CLOUD_STORAGE_REQUIRED')
  await localLock(async () => {
    const all = (await readJson<Record<string, CodeOutboxItem>>(outboxFile())) ?? {}
    for (const item of items) all[item.key] = merge(all[item.key] ?? null, item)
    await atomicFile(outboxFile(), all)
  })
}

/** 그 사이 같은 글이 다시 저장됐다면(id가 다르면) 건드리지 않는다. */
async function settleOutbox(updates: OutboxSettle[]): Promise<void> {
  if (updates.length === 0) return
  const client = getCmsRedis()
  if (client) {
    for (const update of updates) {
      await client.eval(`local current = redis.call('HGET', KEYS[1], ARGV[1])
        if not current then return 0 end
        local item = cjson.decode(current)
        if item.id ~= ARGV[2] then return 0 end
        if ARGV[3] == '1' then redis.call('HDEL', KEYS[1], ARGV[1]) return 1 end
        item.status = ARGV[4]
        item.error = ARGV[5]
        redis.call('HSET', KEYS[1], ARGV[1], cjson.encode(item))
        return 1`,
      [OUTBOX_KEY], [update.key, update.id, update.remove ? '1' : '0', update.status ?? '', update.error ?? ''])
    }
    return
  }
  await localLock(async () => {
    const all = (await readJson<Record<string, CodeOutboxItem>>(outboxFile())) ?? {}
    for (const update of updates) {
      const item = all[update.key]
      if (!item || item.id !== update.id) continue
      if (update.remove) delete all[update.key]
      else all[update.key] = { ...item, status: update.status, error: update.error }
    }
    await atomicFile(outboxFile(), all)
  })
}

async function dropOutbox(keys: string[]): Promise<void> {
  const client = getCmsRedis()
  if (client) {
    await client.hdel(OUTBOX_KEY, ...keys)
    return
  }
  if (process.env.VERCEL === '1') return
  await localLock(async () => {
    const all = await readJson<Record<string, CodeOutboxItem>>(outboxFile())
    if (!all) return
    for (const key of keys) delete all[key]
    await atomicFile(outboxFile(), all)
  })
}

function outboxItem(key: string, value: string, accept: string[], label: string, username: string): CodeOutboxItem {
  return {
    id: randomUUID(), key, value, label, username, at: new Date().toISOString(),
    accept: Array.from(new Set(accept.map((text) => codeAcceptStamp(key, text)))),
  }
}

async function sendTextToCode(key: string, before: string, after: string, username: string) {
  const codeText = deployedCode().baseline.overrides[key]?.value
  const accept = codeText === undefined ? [before] : [before, codeText]
  await sendToCode([outboxItem(key, after, accept, codeChangeLabel(key), username)])
}

async function sendResearchToCode(before: ResearchContent, after: ResearchContent, username: string) {
  if (researchStamp(before) === researchStamp(after)) return
  const accept = [JSON.stringify(before), JSON.stringify(deployedCode().baseline.research)]
  await sendToCode([outboxItem('research', JSON.stringify(after), accept, '연구 소개', username)])
}

async function sendToCode(items: CodeOutboxItem[]) {
  try {
    await putOutbox(items)
  } catch (error) {
    console.error('[cms] code outbox failed:', error)
  }
}

/** 이 기능 이전에 화면에서만 고쳐 둔 글도 한 번은 코드에 넣는다. */
async function backfillOutbox(state: State): Promise<void> {
  const client = getCmsRedis()
  if (client) {
    if ((await client.set(BACKFILL_KEY, new Date().toISOString(), { nx: true })) === null) return
  } else {
    try { await fs.writeFile(path.join(cmsDirectory(), 'code-backfill'), new Date().toISOString(), { flag: 'wx' }) }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'EEXIST') return
      throw error
    }
  }
  const { baseline } = deployedCode()
  const lastEditor = (key: string) => state.history.find((entry) => entry.key === key)?.username ?? '관리자'
  const items: CodeOutboxItem[] = []
  for (const [key, entry] of Object.entries(state.overrides)) {
    const codeText = baseline.overrides[key]?.value
    if (codeText === undefined || entry.value === codeText || entry.pendingCode) continue
    items.push(outboxItem(key, entry.value, [codeText], codeChangeLabel(key), lastEditor(key)))
  }
  if (!state.researchCodeConflict && researchStamp(state.research) !== researchStamp(baseline.research)) {
    items.push(outboxItem('research', JSON.stringify(state.research), [JSON.stringify(baseline.research)], '연구 소개', lastEditor('research')))
  }
  await putOutbox(items)
}

let flushing: Promise<void> | null = null

/** 대기 중인 글을 GitHub 코드에 넣는다. 코드에서 같은 글을 따로 고쳤으면 덮지 않고 남겨 둔다. */
export function flushCodeOutbox(): Promise<void> {
  if (!flushing) {
    flushing = (async () => {
      await backfillOutbox(await readCmsState())
      const items = await readCodeOutbox()
      if (items.length === 0) return
      const result = await pushOutboxToGithub(items)
      const byId = new Map(items.map((item) => [item.id, item]))
      const updates: OutboxSettle[] = []
      for (const id of result.done) updates.push({ key: byId.get(id)!.key, id, remove: true })
      for (const id of result.blocked) {
        const item = byId.get(id)!
        if (item.status !== 'blocked') updates.push({ key: item.key, id, remove: false, status: 'blocked' })
      }
      for (const { id, error } of result.failed) {
        const item = byId.get(id)!
        if (item.status !== 'failed' || item.error !== error) updates.push({ key: item.key, id, remove: false, status: 'failed', error })
      }
      await settleOutbox(updates)
    })().finally(() => { flushing = null })
  }
  return flushing
}
