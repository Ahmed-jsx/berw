// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// Since tokens are stored in localStorage, middleware can't access them
// We'll keep middleware minimal and rely on client-side AuthGuard
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow all routes to pass through
  // Auth protection is handled by AuthGuard component on the client
  
  // Optional: Add security headers
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
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

// Alternative: If you want to handle some redirects at middleware level
// You could check for a custom header or cookie that indicates auth status
/*
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const protectedRoutes = ['/dashboard', '/profile', '/admin'];
  const authRoutes = ['/login', '/register'];
  
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // For protected routes, let the client-side AuthGuard handle the redirect
  // This ensures the token can be checked properly
  
  const response = NextResponse.next();
  
  // Add cache control headers for auth-sensitive pages
  if (isProtectedRoute || isAuthRoute) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
  
  return response;
}
*/