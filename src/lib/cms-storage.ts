/**
 * CMS 영속 저장소 — 로컬은 JSON 파일, Vercel(Upstash Redis)은 클라우드 KV.
 *
 * Vercel 대시보드 → Storage → Upstash Redis 연동 시
 * KV_REST_API_URL / KV_REST_API_TOKEN (또는 UPSTASH_REDIS_REST_*) 가 주입됩니다.
 */

import fs from 'fs'
import path from 'path'
import { Redis } from '@upstash/redis'
import type { OverridesStore } from '@/lib/i18n-overrides'
import type { HistoryEntry } from '@/lib/admin-history'
import type { ResearchContent } from '@/lib/research-content'

const CMS_KEYS = {
  overrides: 'hunminsound:cms:i18n-overrides',
  history: 'hunminsound:cms:admin-history',
  research: 'hunminsound:cms:research-content',
} as const

const FILE_PATHS = {
  overrides: path.join(process.cwd(), 'src', 'data', 'i18n-overrides.json'),
  history: path.join(process.cwd(), 'src', 'data', 'admin-history.json'),
  research: path.join(process.cwd(), 'src', 'data', 'research-content.json'),
} as const

let _redis: Redis | null | undefined

function resolveRedisCredentials(): { url: string; token: string } | null {
  const pairs: [string, string][] = [
    ['KV_REST_API_URL', 'KV_REST_API_TOKEN'],
    ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'],
    ['STORAGE_KV_REST_API_URL', 'STORAGE_KV_REST_API_TOKEN'],
    ['STORAGE_REST_API_URL', 'STORAGE_REST_API_TOKEN'],
    ['STORAGE_URL', 'STORAGE_TOKEN'],
  ]
  for (const [urlKey, tokenKey] of pairs) {
    const url = process.env[urlKey]
    const token = process.env[tokenKey]
    if (url && token) return { url, token }
  }
  // Vercel Custom Prefix (예: STORAGE → STORAGE_KV_REST_API_URL)
  for (const [key, url] of Object.entries(process.env)) {
    if (!key.endsWith('_REST_API_URL') || !url) continue
    const tokenKey = key.replace('_REST_API_URL', '_REST_API_TOKEN')
    const token = process.env[tokenKey]
    if (token) return { url, token }
  }
  return null
}

function getRedis(): Redis | null {
  if (_redis !== undefined) return _redis
  const creds = resolveRedisCredentials()
  if (!creds) {
    _redis = null
    return null
  }
  _redis = new Redis(creds)
  return _redis
}

/** Vercel 등 Redis가 설정된 프로덕션 환경 */
export function isCloudCmsEnabled(): boolean {
  return getRedis() !== null
}

function readFileJson<T>(filePath: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T
  } catch {
    return fallback
  }
}

function writeFileJson(filePath: string, data: unknown): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
}

async function readCloudJson<T>(key: string, seedPath: string, seedFallback: T): Promise<T> {
  const redis = getRedis()
  if (!redis) {
    return readFileJson(seedPath, seedFallback)
  }
  const cached = await redis.get<T>(key)
  if (cached !== null && cached !== undefined) {
    return cached
  }
  const seeded = readFileJson(seedPath, seedFallback)
  await redis.set(key, seeded)
  return seeded
}

async function writeCloudJson(key: string, data: unknown, filePath: string): Promise<void> {
  const redis = getRedis()
  if (redis) {
    await redis.set(key, data)
    return
  }
  if (process.env.VERCEL === '1') {
    throw new Error(
      'CMS_CLOUD_STORAGE_REQUIRED: Vercel에서는 Upstash Redis(KV) 연동이 필요합니다. ' +
        'Vercel 대시보드 → Storage → Upstash Redis를 프로젝트에 연결하세요.',
    )
  }
  writeFileJson(filePath, data)
}

/* ── i18n overrides ─────────────────────────────────────────────────────── */

export async function readOverridesStore(): Promise<OverridesStore> {
  return readCloudJson(CMS_KEYS.overrides, FILE_PATHS.overrides, {})
}

export async function writeOverridesStore(store: OverridesStore): Promise<void> {
  await writeCloudJson(CMS_KEYS.overrides, store, FILE_PATHS.overrides)
}

/* ── admin history ──────────────────────────────────────────────────────── */

export async function readAdminHistory(): Promise<HistoryEntry[]> {
  return readCloudJson(CMS_KEYS.history, FILE_PATHS.history, [])
}

export async function writeAdminHistory(history: HistoryEntry[]): Promise<void> {
  await writeCloudJson(CMS_KEYS.history, history, FILE_PATHS.history)
}

/* ── research content ───────────────────────────────────────────────────── */

export async function readResearchContent(): Promise<ResearchContent> {
  const fallback = readFileJson<ResearchContent>(FILE_PATHS.research, {} as ResearchContent)
  return readCloudJson(CMS_KEYS.research, FILE_PATHS.research, fallback)
}

export async function writeResearchContent(data: ResearchContent): Promise<void> {
  await writeCloudJson(CMS_KEYS.research, data, FILE_PATHS.research)
}
