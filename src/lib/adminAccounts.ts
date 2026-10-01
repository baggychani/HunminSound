import { timingSafeEqual } from 'node:crypto'
import bcrypt from 'bcryptjs'

export type AdminAccount = {
  username: string
  /** 평문 또는 bcrypt 해시($2a$·$2b$·$2y$). 해시는 scripts/make-admin-hash.mjs 로 생성. */
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

/** 서버 전용 환경 변수에서 관리자 계정 목록 (평문·bcrypt 해시 모두 허용, 해시 권장) */
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

export function isBcryptHash(stored: string): boolean {
  return stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$')
}

export async function findAdmin(username: string, password: string): Promise<AdminAccount | null> {
  const user = username.trim()
  const accounts = getAdminAccounts()
  for (const account of accounts) {
    if (!timingSafeStringEqual(account.username, user)) continue
    if (isBcryptHash(account.password)) {
      // 해시 비교는 bcrypt에 위임 (내부적으로 타이밍 공격에 안전)
      if (await bcrypt.compare(password, account.password)) return account
    } else if (timingSafeStringEqual(account.password, password)) {
      return account
    }
  }
  return null
}
