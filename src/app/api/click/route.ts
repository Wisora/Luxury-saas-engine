import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const productId = searchParams.get("productId");
  const tenantId = searchParams.get("tenantId");
  const rawTargetUrl = searchParams.get("url");

  // Fallback destination if no target URL is provided
  const targetUrl = rawTargetUrl ? decodeURIComponent(rawTargetUrl) : "/";

  // Helper function to safely handle external vs internal redirects
  const getRedirectResponse = (url: string) => {
    try {
      if (url.startsWith("http://") || url.startsWith("https://")) {
        return NextResponse.redirect(url);
      }
      return NextResponse.redirect(new URL(url, request.url));
    } catch {
      return NextResponse.redirect(new URL("/", request.url));
    }
  };

  if (!productId || !tenantId) {
    return getRedirectResponse(targetUrl);
  }

  try {
    const userAgent = request.headers.get("user-agent") || "unknown";
    const referrer = request.headers.get("referer") || "direct";

    // Matching schema model: Click -> prisma.click
    await prisma.click.create({
      data: {
        productId,
        tenantId,
        userAgent,
        referrer,
      },
    });
  } catch (error) {
    console.error("Failed to record click telemetry:", error);
  }

  return getRedirectResponse(targetUrl);
}