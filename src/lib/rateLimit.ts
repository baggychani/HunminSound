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
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
}
