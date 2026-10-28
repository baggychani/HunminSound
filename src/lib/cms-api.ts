import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE, getAdminSessionSecret, verifyAdminSessionToken } from '@/lib/adminSession'
import { CmsConflictError } from '@/lib/cms-storage'

export async function cmsUser() {
  return verifyAdminSessionToken(getAdminSessionSecret(), cookies().get(ADMIN_SESSION_COOKIE)?.value)
}
export const noStore = { 'Cache-Control': 'no-store' }
export function cmsError(error: unknown) {
  if (error instanceof CmsConflictError) return NextResponse.json({ message: '다른 저장과 겹쳤습니다. 입력한 내용은 유지됩니다. 최신 내용을 확인한 뒤 다시 저장해 주세요.' }, { status: 409 })
  console.error('[cms]', error)
  return NextResponse.json({ message: '내용을 저장하거나 불러오지 못했습니다. 잠시 뒤 다시 시도해 주세요. 계속 실패하면 개발자에게 문의해 주세요.' }, { status: 503 })
}
