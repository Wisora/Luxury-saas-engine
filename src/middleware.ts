import { NextResponse } from 'next/server';
import type { NextNextRequest } from 'next/server';

export function middleware(request: NextNextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Extract clean hostname lowercased
  const cleanHost = hostname.split(':')[0].toLowerCase();

  // Define master platform domains
  const isMasterDomain =
    cleanHost === 'luxuryengine.wisorainnovations.com' ||
    cleanHost === 'wisorainnovations.com' ||
    cleanHost === 'luxuryengine' ||
    cleanHost.endsWith('.vercel.app') ||
    cleanHost === 'localhost';

  // If request is targeting the root '/' on a master domain, ensure it serves root app
  if (isMasterDomain && url.pathname === '/') {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Ensure middleware runs on all page routes
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