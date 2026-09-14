import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Define your main app domain(s)
  const mainDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost:3000";

  // Check if current request is on a subdomain or custom domain
  const isCustomDomain = !hostname.includes(mainDomain);
  const subdomain = hostname.replace(`.${mainDomain}`, "");

  if (isCustomDomain) {
    // Rewrite custom domain directly to /tenants/[domain]
    return NextResponse.rewrite(new URL(`/tenants/${hostname}${url.pathname}`, request.url));
  }

  if (subdomain && subdomain !== hostname && subdomain !== "www") {
    // Rewrite subdomain directly to /tenants/[subdomain]
    return NextResponse.rewrite(new URL(`/tenants/${subdomain}${url.pathname}`, request.url));
  }

  return NextResponse.next();
}