import fs from 'fs/promises'
import path from 'path'
import { createHash, randomUUID } from 'crypto'
import { Redis } from '@upstash/redis'
import { codeBaseline } from '@/lib/cms-baseline'
import type { OverridesStore, TranslationOverride } from '@/lib/i18n-overrides'
import { makeHistoryEntry, MAX_HISTORY, type HistoryEntry } from '@/lib/admin-history'
import { validateResearchContent, type ResearchContent } from '@/lib/research-content'

const KEY = 'hunminsound:cms:v2:current'
const BASELINE_KEY = 'hunminsound:cms:v2:baseline'
export const cmsDirectory = () => process.env.CMS_LOCAL_DIR || path.join(process.cwd(), '.cms')
export class CmsConflictError extends Error {}
type Content = { overrides: OverridesStore; research: ResearchContent }
type State = Content & { version: 2; revision: string; history: HistoryEntry[] }
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
async function initialState(): Promise<{ state: State; backup: unknown }> {
  const baseline = codeBaseline()
  const client = getCmsRedis()
  const legacyOverrides = client
    ? await client.get<OverridesStore>('hunminsound:cms:i18n-overrides')
    : await readJson<OverridesStore>(path.join(process.cwd(), 'src/data/i18n-overrides.json'))
  const legacyHistory = client
    ? await client.get<HistoryEntry[]>('hunminsound:cms:admin-history')
    : await readJson<HistoryEntry[]>(path.join(process.cwd(), 'src/data/admin-history.json'))
  // 연구 소개의 기존 정본은 배포된 코드다. 폐기한 과거 Redis 연구 키는 되살리지 않는다.
  const overrides = { ...baseline.overrides }
  for (const [key, value] of Object.entries(legacyOverrides ?? {})) {
    if (Object.prototype.hasOwnProperty.call(overrides, key)) overrides[key] = value
  }
  return {
    state: { version: 2, revision: randomUUID(), overrides, research: baseline.research, history: (legacyHistory ?? []).slice(0, MAX_HISTORY) },
    backup: { createdAt: new Date().toISOString(), baseline, legacyOverrides, legacyHistory },
  }
}

export async function readCmsState(): Promise<State> {
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

async function commit(previous: State, next: State, event: Event): Promise<void> {
  const client = getCmsRedis()
  if (client) {
    const ok = await client.eval(`local current = redis.call('GET', KEYS[1])
      if not current or cjson.decode(current).revision ~= ARGV[1] then return 0 end
      redis.call('SET', KEYS[2], ARGV[3]); redis.call('SET', KEYS[1], ARGV[2]); return 1`,
    [KEY, `hunminsound:cms:v2:event:${event.entry.id}`],
    [previous.revision, JSON.stringify(next), JSON.stringify(event)])
    if (ok !== 1) throw new CmsConflictError()
    return
  }
  await localLock(async () => {
    const file = path.join(cmsDirectory(), 'current.json')
    const current = await readJson<State>(file)
    if (current?.revision !== previous.revision) throw new CmsConflictError()
    await fs.mkdir(path.join(cmsDirectory(), 'history'), { recursive: true })
    // 복원 자료 기록이 성공한 뒤에만 현재 파일을 원자적으로 교체한다.
    await fs.writeFile(path.join(cmsDirectory(), 'history', `${event.entry.id}.json`), JSON.stringify(event), { flag: 'wx' })
    await atomicFile(file, next)
  })
}

function historyFor(change: Change, username: string, action: HistoryEntry['action'], name?: string): HistoryEntry {
  const [type, id, , lang] = change.kind === 'text' ? change.key.split(':') : ['research', 'research', '', 'ko']
  return {
    ...makeHistoryEntry({ username, action, key: change.kind === 'text' ? change.key : 'research',
      type: type as HistoryEntry['type'], itemId: id, itemName: name ?? id, lang,
      oldValue: change.kind === 'text' ? change.before.value.slice(0, 3000) : '연구진·과제 정보 변경 전 내용',
      newValue: change.kind === 'text' ? change.after.value.slice(0, 3000) : '연구진·과제 정보 변경 후 내용' }),
    id: randomUUID(), restorable: true,
  }
}

async function saveChange(previous: State, change: Change, username: string, action: HistoryEntry['action'], name?: string) {
  const entry = historyFor(change, username, action, name)
  const next: State = { ...previous, revision: randomUUID(), history: [entry, ...previous.history].slice(0, MAX_HISTORY) }
  if (change.kind === 'text') next.overrides = { ...previous.overrides, [change.key]: change.after }
  else next.research = change.after
  await commit(previous, next, { change, entry })
  return next
}

export async function saveText(input: {
  key: string; value?: string; sourceSnapshot?: string; remove?: boolean; staleDismissed?: boolean;
  expectedVersion: string | null; displayName?: string;
}, username: string): Promise<OverridesStore> {
  const current = await readCmsState()
  const before = current.overrides[input.key]
  const baseline = codeBaseline().overrides[input.key]
  if (!before || !Object.prototype.hasOwnProperty.call(codeBaseline().overrides, input.key)) throw new Error('CMS_INVALID_KEY')
  if ((before.updatedAt || null) !== input.expectedVersion) throw new CmsConflictError()
  const after = input.remove ? { ...baseline } : input.staleDismissed
    ? { ...before, staleDismissed: true }
    : { ...before, value: input.value!, sourceSnapshot: input.sourceSnapshot!, staleDismissed: false }
  after.updatedAt = randomUUID() // 같은 밀리초에 저장해도 구분되는 항목 버전
  return (await saveChange(current, { kind: 'text', key: input.key, before, after }, username,
    input.remove ? 'remove' : input.staleDismissed ? 'dismiss' : 'save', input.displayName)).overrides
}

export const researchVersion = (data: ResearchContent) => createHash('sha256').update(JSON.stringify(data)).digest('hex')
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
  return researchVersion(data)
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

export async function readOverridesStore() { return (await readCmsState()).overrides }
export async function readAdminHistory() { return (await readCmsState()).history }

export async function restoreCmsEntry(id: string, expectedRevision: string, username: string) {
  if (!/^[a-f0-9-]{36}$/.test(id)) throw new Error('CMS_INVALID_HISTORY')
  const current = await readCmsState()
  if (current.revision !== expectedRevision) throw new CmsConflictError()
  const client = getCmsRedis()
  const event = client ? await client.get<Event>(`hunminsound:cms:v2:event:${id}`)
    : await readJson<Event>(path.join(cmsDirectory(), 'history', `${id}.json`))
  if (!event) throw new Error('CMS_INVALID_HISTORY')
  const change: Change = event.change.kind === 'text'
    ? { kind: 'text', key: event.change.key, before: current.overrides[event.change.key],
      after: { ...event.change.before, updatedAt: randomUUID() } }
    : { kind: 'research', before: current.research, after: event.change.before }
  await saveChange(current, change, username, 'restore', event.entry.itemName)
}
