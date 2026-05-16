import { timingSafeEqual } from 'node:crypto'

export type AdminAccount = {
  username: string
  password: string
}

function parseAdminUsersJson(raw: string | undefined): AdminAccount[] | null {
  if (!raw?.trim()) return null
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    const out: AdminAccount[] = []
    for (const row of parsed) {
      if (!row || typeof row !== 'object') continue
      const u = (row as { username?: unknown }).username
      const p = (row as { password?: unknown }).password
      if (typeof u === 'string' && typeof p === 'string' && u.trim() && p.length > 0) {
        out.push({ username: u.trim(), password: p })
      }
    }
    return out
  } catch {
    return []
  }
}

/** 서버 전용 환경 변수에서 관리자 계정 목록 (비밀 평문 또는 해시 저장은 후속 단계에서 확장 가능) */
export function getAdminAccounts(): AdminAccount[] {
  const fromJson = parseAdminUsersJson(process.env.ADMIN_USERS)
  if (fromJson !== null && fromJson.length > 0) return fromJson

  const username = process.env.ADMIN_USERNAME?.trim()
  const password = process.env.ADMIN_PASSWORD
  if (username && password) return [{ username, password }]
  return []
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const aa = Buffer.from(a, 'utf8')
  const bb = Buffer.from(b, 'utf8')
  if (aa.length !== bb.length) return false
  return timingSafeEqual(aa, bb)
}

export function findAdmin(username: string, password: string): AdminAccount | null {
  const user = username.trim()
  const accounts = getAdminAccounts()
  for (const account of accounts) {
    if (timingSafeStringEqual(account.username, user) && timingSafeStringEqual(account.password, password)) {
      return account
    }
  }
  return null
}
