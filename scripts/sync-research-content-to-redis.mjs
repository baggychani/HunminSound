/**
 * 로컬 research-content.json → Upstash Redis 동기화
 * 프로덕션 CMS가 예전 데이터를 들고 있을 때 실행합니다.
 *
 * 실행: node scripts/sync-research-content-to-redis.mjs
 * (KV_REST_API_URL + KV_REST_API_TOKEN 또는 UPSTASH_* 환경변수 필요)
 */
import fs from 'node:fs'
import path from 'node:path'
import { Redis } from '@upstash/redis'

const CMS_KEY = 'hunminsound:cms:research-content'
const FILE_PATH = path.join(process.cwd(), 'src', 'data', 'research-content.json')

function resolveRedisCredentials() {
  const pairs = [
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
  return null
}

const creds = resolveRedisCredentials()
if (!creds) {
  console.error('Redis credentials not found. Set KV_REST_API_URL + KV_REST_API_TOKEN (or UPSTASH_*).')
  process.exit(1)
}

const data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'))
const redis = new Redis(creds)

await redis.set(CMS_KEY, data)
console.log(`Synced ${FILE_PATH} → ${CMS_KEY}`)
