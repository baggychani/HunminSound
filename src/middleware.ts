import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_SESSION_COOKIE, adminSessionCookieOptions, getAdminSessionSecret, readAdminSession } from '@/lib/adminSession'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin')) return NextResponse.next()

  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
    return NextResponse.next()
  }

  const secret = getAdminSessionSecret()
  if (!secret || secret.length < 16) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('error', 'config')
    return NextResponse.redirect(url)
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  const session = await readAdminSession(secret, token)

  if (!session.ok) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('from', pathname)
    const redirect = NextResponse.redirect(url)
    redirect.cookies.set(ADMIN_SESSION_COOKIE, '', { ...adminSessionCookieOptions(), maxAge: 0 })
    return redirect
  }

  const response = NextResponse.next()
  if (session.renewed) response.cookies.set(ADMIN_SESSION_COOKIE, session.token, adminSessionCookieOptions())
  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
