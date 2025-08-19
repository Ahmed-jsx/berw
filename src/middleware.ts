// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { serverFetcher } from '@/lib/fetcher';

const protectedRoutes = ['/dashboard', '/profile', '/admin'];
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // If accessing protected route without session, redirect to login
  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Validate session for protected routes
  if (isProtectedRoute && sessionCookie) {
    try {
      const cookieString = request.cookies.toString();
      await serverFetcher('/auth/me', { requiresAuth: true }, cookieString);
    } catch (error) {
      // Invalid session, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('session');
      return response;
    }
  }

  // If authenticated user tries to access auth pages, redirect to dashboard
  if (isAuthRoute && sessionCookie) {
    try {
      const cookieString = request.cookies.toString();
      await serverFetcher('/auth/me', { requiresAuth: true }, cookieString);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      // Invalid session, allow access to auth pages
      const response = NextResponse.next();
      response.cookies.delete('session');
      return response;
    }
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