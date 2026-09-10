import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  // 1. ALWAYS pass through Next.js Server Actions & Internal System Requests
  if (
    request.headers.has('next-action') || 
    request.headers.has('x-action') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // 2. Pass through root platform landing page & local development
  if (
    hostname === 'wisora.com' ||
    hostname.includes('.vercel.app') ||
    hostname.includes('localhost') ||
    hostname.includes('127.0.0.1')
  ) {
    return NextResponse.next();
  }

  // 3. Client Domain Resolution (Subdomains or Custom Domains)
  const url = request.nextUrl.clone();
  const currentHost = hostname.split(':')[0]; // strip port if present

  // Check if request is a direct subdomain (e.g. monarch.wisora.com)
  const isSubdomain = currentHost.endsWith('.wisora.com');
  const domainSlug = isSubdomain ? currentHost.split('.')[0] : currentHost;

  if (domainSlug && domainSlug !== 'www') {
    // Rewrite host to page route parameter: src/app/tenants/[domain]/page.tsx
    url.pathname = `/tenants/${domainSlug}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};