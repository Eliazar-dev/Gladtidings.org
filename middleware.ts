import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  console.log('Middleware invoked for pathname:', pathname)

  // Admin route protection with passcode
  if (pathname.startsWith('/admin') && pathname !== '/admin/gate') {
    const passcodeCookie = req.cookies.get('admin-passcode')?.value
    console.log('Admin route, cookie:', passcodeCookie)

    if (!passcodeCookie || passcodeCookie !== 'valid') {
      console.log('Redirecting to gate')
      return NextResponse.redirect(new URL(`/admin/gate?redirect=${pathname}`, req.url))
    }
  }

  // Account route protection
  if (pathname.startsWith('/account')) {
    const token = req.cookies.get('sb-access-token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/login?redirect=/account', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
}
