import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const redirect = searchParams.get('redirect') ?? '/'

  console.log('Callback - Code exists:', !!code)
  console.log('Callback - Redirect:', redirect)

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    console.log('Callback - Session exists:', !!data.session)
    console.log('Callback - Error:', error?.message)
    console.log('Callback - User email:', data.session?.user?.email)

    if (error) {
      console.error('Auth error:', error)
      return NextResponse.redirect(new URL('/login?error=oauth_failed', req.url))
    }

    // Create response with redirect
    const response = NextResponse.redirect(new URL(redirect, req.url))

    // Set session cookies
    if (data.session) {
      console.log('Callback - Setting cookies')
      response.cookies.set('sb-access-token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
      response.cookies.set('sb-refresh-token', data.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
    } else {
      console.log('Callback - No session to set cookies')
    }

    return response
  }

  console.log('Callback - No code, redirecting to:', redirect)
  return NextResponse.redirect(new URL(redirect, req.url))
}
