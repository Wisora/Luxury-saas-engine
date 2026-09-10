import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  // 1. Allow standard Vercel domain and localhost to serve root landing page
  if (
    hostname.includes('.vercel.app') ||
    hostname.includes('localhost') ||
    hostname.includes('127.0.0.1')
  ) {
    return NextResponse.next();
  }

  // 2. Multi-client dynamic subdomain resolution
  const url = request.nextUrl.clone();
  const currentHost = hostname.split(':')[0];
  const tenantSlug = currentHost.split('.')[0];

  if (tenantSlug && tenantSlug !== 'www' && tenantSlug !== 'wisora') {
    url.pathname = `/tenants/${tenantSlug}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};