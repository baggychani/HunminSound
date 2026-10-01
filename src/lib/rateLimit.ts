/**
 * 메모리 기반 IP별 요청 횟수 제한.
 *
 * 서버리스 인스턴스별로 독립적이라 완벽한 방어는 아니지만(콜드스타트·다중 인스턴스마다
 * 리셋), 단일 요청 남발형 스팸·오남용을 막는 데는 충분하다.
 */
const buckets = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(scope: string, ip: string, max: number, windowMs: number): boolean {
  const key = `${scope}:${ip}`
  const now = Date.now()
  const entry = buckets.get(key)
  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= max) return false
  entry.count += 1
  return true
}

export function getClientIp(req: Request): string {
  const raw = req.headers.get('x-forwarded-for') ?? ''
  const parts = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  // 프록시는 뒤에 덧붙이므로 맨 뒤(서버에 가장 가까운 쪽)가 가장 믿을 만하다.
  // 맨 앞은 클라이언트가 마음대로 적을 수 있어 속도 제한 우회에 쓰일 수 있다.
  return parts.length > 0 ? parts[parts.length - 1]! : 'unknown'
}

/**
 * 공개 API용 이중 제한: IP별(엄격) + 전체(관대).
 * 헤더 위조로 IP별을 피해가도 전체 상한에는 반드시 걸리게 한다.
 */
export function checkPublicRateLimit(
  scope: string,
  ip: string,
  maxPerIp: number,
  windowMs: number,
  maxGlobal: number,
): boolean {
  if (!checkRateLimit(scope, ip, maxPerIp, windowMs)) return false
  return checkRateLimit(`${scope}:global`, 'all', maxGlobal, windowMs)
}
