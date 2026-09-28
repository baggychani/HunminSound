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
import researchContentJson from '@/data/research-content.json'
import {
  GithubConflictError,
  isGithubContentEnabled,
  readGithubFile,
  writeGithubFile,
} from '@/lib/githubContent'

const CMS_KEYS = {
  overrides: 'hunminsound:cms:i18n-overrides',
  history: 'hunminsound:cms:admin-history',
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
  // 관리자 저장과 초기화가 겹쳐도 저장본을 덮어쓰지 않는다.
  await redis.set(key, seeded, { nx: true })
  return (await redis.get<T>(key)) ?? seeded
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

/**
 * 원본은 코드의 research-content.json 하나다.
 * - 코드로 고치고 푸시 → 재배포로 반영
 * - 관리자 페이지 저장 → 같은 파일을 GitHub에 커밋 → 재배포로 반영
 */
const RESEARCH_REPO_PATH = 'src/data/research-content.json'

/** 공개 페이지용 — 배포에 포함된 JSON */
export async function readResearchContent(): Promise<ResearchContent> {
  return researchContentJson as ResearchContent
}

/** 기존 파일 형식(4칸 들여쓰기 + 끝 줄바꿈)과 같게 — 관리자 저장 커밋의 diff가 바뀐 줄만 나오도록 */
function serializeResearch(data: ResearchContent): string {
  return JSON.stringify(data, null, 4) + '\n'
}

/**
 * 관리자 편집용 — GitHub 최신본(재배포 전이라도 방금 저장한 내용이 보이도록).
 * sha는 저장 시 동시 수정 감지에 쓴다. 로컬(토큰 없음)에서는 파일을 읽고 sha는 null.
 */
export async function readResearchContentForAdmin(): Promise<{ data: ResearchContent; sha: string | null }> {
  if (isGithubContentEnabled()) {
    const { text, sha } = await readGithubFile(RESEARCH_REPO_PATH)
    return { data: JSON.parse(text) as ResearchContent, sha }
  }
  return { data: readFileJson(FILE_PATHS.research, researchContentJson as ResearchContent), sha: null }
}

/** 성공 시 새 sha(로컬은 null). 그 사이 코드로 수정됐으면 GithubConflictError */
export async function writeResearchContent(
  data: ResearchContent,
  sha: string | null,
  editor: string,
): Promise<string | null> {
  if (isGithubContentEnabled()) {
    if (!sha) throw new GithubConflictError()
    return writeGithubFile(
      RESEARCH_REPO_PATH,
      serializeResearch(data),
      sha,
      `content: 관리자 페이지에서 연구 소개 수정 (${editor})`,
    )
  }
  if (process.env.VERCEL === '1') {
    throw new Error('GITHUB_NOT_CONFIGURED')
  }
  fs.writeFileSync(FILE_PATHS.research, serializeResearch(data), 'utf8')
  return null
}
