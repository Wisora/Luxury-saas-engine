import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. Static files (e.g. favicon.ico, sitemap.xml, robots.txt, images)
     */
    "/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)"
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Define root/app domains
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "wisora.com";

  // Extract the current subdomain or custom domain
  const currentHost = hostname
    .replace(`.localhost:3000`, "")
    .replace(`:${process.env.PORT || 3000}`, "")
    .replace(`.${appDomain}`, "");

  const searchParams = url.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  // 1. Main Platform Landing & Dashboard Routes
  if (
    currentHost === "app" ||
    currentHost === "www" ||
    currentHost === appDomain ||
    currentHost === "localhost"
  ) {
    return NextResponse.next();
  }

  // 2. Tenant Subdomain / Custom Domain Dynamic Rewrite
  // Rewrites requests to internal route: /tenants/[domain]/...
  return NextResponse.rewrite(
    new URL(`/tenants/${currentHost}${path}`, req.url)
  );
}