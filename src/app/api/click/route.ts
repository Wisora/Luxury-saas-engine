import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const productId = searchParams.get("productId");
    const tenantId = searchParams.get("tenantId");
    const rawTargetUrl = searchParams.get("url");

    // Safely decode the target URL with fallback
    let targetUrl = "/";
    if (rawTargetUrl) {
      try {
        targetUrl = decodeURIComponent(rawTargetUrl);
      } catch {
        targetUrl = "/";
      }
    }

    // 🛑 LOOP GUARD: Prevent infinite loops if affiliate URL points to itself, API, or hash
    if (
      !targetUrl ||
      targetUrl === "#" ||
      targetUrl.includes("/api/click") ||
      targetUrl.startsWith("javascript:")
    ) {
      targetUrl = "/";
    }

    // Log click telemetry safely in the background if valid IDs exist
    if (productId && tenantId) {
      const userAgent = request.headers.get("user-agent") || "unknown";
      const referrer = request.headers.get("referer") || "direct";

      await prisma.click.create({
        data: {
          productId,
          tenantId,
          userAgent,
          referrer,
        },
      }).catch((err) => {
        console.error("Failed to record click telemetry:", err);
      });
    }

    // Execute safe external or internal redirect
    if (targetUrl.startsWith("http://") || targetUrl.startsWith("https://")) {
      return NextResponse.redirect(targetUrl);
    }
    
    return NextResponse.redirect(new URL(targetUrl, request.url));
    
  } catch (error) {
    console.error("Click telemetry route error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}