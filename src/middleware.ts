import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  // 1. Pass through standard Vercel deployment URLs & local development
  if (
    hostname.includes('.vercel.app') ||
    hostname.includes('localhost') ||
    hostname.includes('127.0.0.1')
  ) {
    return NextResponse.next();
  }

  // 2. Custom multi-tenant subdomain resolution (if visiting via custom subdomains)
  const url = request.nextUrl.clone();
  const currentHost = hostname.split(':')[0]; // remove port if present
  
  // Extract tenant slug (e.g. "brand" from "brand.wisora.com")
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