import { cookies } from 'next/headers'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { ADMIN_SESSION_COOKIE, getAdminSessionSecret, verifyAdminSessionToken } from '@/lib/adminSession'

export default async function AdminHomePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  const username = await verifyAdminSessionToken(getAdminSessionSecret(), token)

  return <AdminDashboard username={username} />
}
