/**
 * 배포(Vercel) 전 필수 환경변수 점검 스크립트.
 * 값 자체는 출력하지 않고 설정 여부만 확인합니다.
 *
 * 로컬 실행: node scripts/check-deploy-env.mjs
 * 프로덕션 값 점검: vercel env pull .env.production.local 로 받은 뒤
 *   node -r dotenv/config scripts/check-deploy-env.mjs dotenv_config_path=.env.production.local
 *   (또는 아무 dotenv 로더로 해당 파일을 로드하고 실행)
 */

const REDIS_PAIRS = [
  ['KV_REST_API_URL', 'KV_REST_API_TOKEN'],
  ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'],
  ['STORAGE_KV_REST_API_URL', 'STORAGE_KV_REST_API_TOKEN'],
  ['STORAGE_REST_API_URL', 'STORAGE_REST_API_TOKEN'],
  ['STORAGE_URL', 'STORAGE_TOKEN'],
]

function findRedisPair() {
  for (const [urlKey, tokenKey] of REDIS_PAIRS) {
    if (process.env[urlKey] && process.env[tokenKey]) return [urlKey, tokenKey]
  }
  for (const [key, url] of Object.entries(process.env)) {
    if (!key.endsWith('_REST_API_URL') || !url) continue
    const tokenKey = key.replace('_REST_API_URL', '_REST_API_TOKEN')
    if (process.env[tokenKey]) return [key, tokenKey]
  }
  return null
}

const checks = []

function check(label, ok, detail) {
  checks.push({ label, ok, detail })
}

// SMTP (공개 문의 폼 발송)
const smtpUser = process.env.SMTP_USER?.trim()
const smtpPass = process.env.SMTP_PASS?.trim()
check(
  'SMTP (SMTP_USER / SMTP_PASS)',
  Boolean(smtpUser && smtpPass),
  smtpUser && smtpPass
    ? `발신 계정 ${smtpUser} 설정됨`
    : '미설정 — 공개 문의 폼 제출 시 SMTP_NOT_CONFIGURED 에러 응답',
)
check(
  'CONTACT_TO (문의 수신 주소)',
  Boolean(process.env.CONTACT_TO?.trim()),
  process.env.CONTACT_TO?.trim()
    ? `수신 주소 지정됨 (${process.env.CONTACT_TO})`
    : '미설정 — 기본값 sejong@sejongkorea.org 로 발송됨(의도한 주소인지 확인)',
)

// Redis / Upstash KV (연구소개 CMS 콘텐츠 영속 저장)
const redisPair = findRedisPair()
check(
  'Redis(Upstash KV) 연동',
  Boolean(redisPair),
  redisPair
    ? `${redisPair[0]} / ${redisPair[1]} 로 연동 확인`
    : '미설정 — Vercel(VERCEL=1) 환경에서는 관리자 콘텐츠 저장이 CMS_CLOUD_STORAGE_REQUIRED 에러로 실패함',
)

// Sanity (선택 — 미설정 시 로컬 정적 데이터로 폴백하는 것은 정상 동작)
const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim()
check(
  'Sanity 프로젝트 연동 (선택)',
  Boolean(sanityProjectId),
  sanityProjectId
    ? `프로젝트 ID 설정됨`
    : '미설정 — 자음/모음 페이지가 src/data/*.ts 정적 데이터로 표시됨(정상적인 폴백)',
)

const width = Math.max(...checks.map((c) => c.label.length))
console.log('배포 전 환경변수 점검\n')
for (const c of checks) {
  const status = c.ok ? '[OK]     ' : '[MISSING]'
  console.log(`${status} ${c.label.padEnd(width)}  ${c.detail}`)
}

const requiredMissing = checks
  .slice(0, 3)
  .some((c) => !c.ok)

console.log('')
if (requiredMissing) {
  console.log('필수 항목(SMTP/Redis) 중 누락이 있습니다. 10/14 전 Vercel 대시보드에서 값을 등록하세요.')
  process.exitCode = 1
} else {
  console.log('필수 항목 확인 완료.')
}
