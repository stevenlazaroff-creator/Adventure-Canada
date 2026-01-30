import { createServerClient } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/listings', '/analytics', '/settings', '/billing']

// Routes that should redirect authenticated users (e.g., login, register)
const authRoutes = ['/login', '/register', '/forgot-password']

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  // First, handle i18n routing
  const intlResponse = intlMiddleware(request)

  // Get the pathname without locale prefix
  const pathname = request.nextUrl.pathname
  const pathnameWithoutLocale = pathname.replace(/^\/(en|fr)/, '') || '/'

  // Check if this is a protected or auth route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  )

  // If not a protected or auth route, just return the intl response
  if (!isProtectedRoute && !isAuthRoute) {
    return intlResponse
  }

  // Create Supabase client for auth check
  let response = intlResponse || NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get locale from pathname
  const locale = pathname.match(/^\/(en|fr)/)?.[1] || 'en'

  // Protected route: redirect to login if not authenticated
  if (isProtectedRoute && !user) {
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set('redirect', pathnameWithoutLocale)
    return NextResponse.redirect(loginUrl)
  }

  // Auth route: redirect to dashboard if already authenticated
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
  }

  return response
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - api routes
    // - _next (Next.js internals)
    // - static files (images, etc.)
    // - auth callback
    '/((?!api|_next|auth|.*\\..*).*)',
  ],
}
