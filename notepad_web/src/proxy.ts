import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/settings', '/tags', '/profile'];

const publicRoutes = ['/login', '/register', '/forgotPassword', '/reset-password', '/auth-redirect'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('auth-token')?.value;

  const isHomePage = pathname === '/';
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Debug logs for Safari
  console.log('=== PROXY DEBUG ===');
  console.log('Path:', pathname);
  console.log('Token exists:', !!token);
  console.log('Token length:', token?.length || 0);
  console.log('Is Home:', isHomePage);
  console.log('Is Protected:', isProtectedRoute);
  console.log('Is Public:', isPublicRoute);
  console.log('==================');

  // If no token and trying to access protected routes or homepage
  if ((isHomePage || isProtectedRoute) && !token) {
    // Allow auth-redirect and login pages
    if (pathname === '/auth-redirect' || pathname === '/login') {
      console.log('✓ Allowing access to:', pathname);
      return NextResponse.next();
    }
    const redirectUrl = new URL('/auth-redirect?to=/login', request.url);
    console.log('→ Redirecting to auth-redirect from:', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If user has token and tries to access public routes (except auth-redirect), redirect to home
  if (isPublicRoute && token && pathname !== '/auth-redirect') {
    const homeUrl = new URL('/', request.url);
    console.log('→ Redirecting to home (has token, on public route)');
    return NextResponse.redirect(homeUrl);
  }

  console.log('✓ Allowing access');
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
