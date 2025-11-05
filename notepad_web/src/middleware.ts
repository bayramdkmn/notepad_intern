import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/settings', '/tags', '/profile'];

const publicRoutes = ['/login', '/register', '/forgotPassword', '/reset-password', '/auth-redirect'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Token kontrolü
  const token = request.cookies.get('auth-token')?.value;

  const isHomePage = pathname === '/';
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if ((isHomePage || isProtectedRoute) && !token) {
    if (pathname === '/auth-redirect' || pathname === '/login') {
      return NextResponse.next();
    }
    const redirectUrl = new URL('/auth-redirect?to=/login', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (isPublicRoute && token) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
