// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware in development
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }

  // Allow access to coming-soon page, API routes, Next.js assets, and public files
  if (
    pathname.startsWith('/coming-soon') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') || // next.js assets
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/) // public images
  ) {
    return NextResponse.next();
  }

  // Redirect everything else to coming-soon
  return NextResponse.redirect(new URL('/coming-soon', request.url));
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
