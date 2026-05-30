import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email', '/session-expired', '/auth/callback']
  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p))

  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    const onboardingStatus = user.user_metadata?.onboarding_status as string | undefined
    const isOnboardingPath = pathname.startsWith('/onboarding')

    // Completed users cannot re-enter onboarding. Skipped users may return later to finish setup.
    if (onboardingStatus === 'completed' && isOnboardingPath) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    // Fresh users (no status yet) must complete or skip onboarding before accessing the app
    if (!onboardingStatus && !isOnboardingPath && !isPublic) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding/welcome'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
