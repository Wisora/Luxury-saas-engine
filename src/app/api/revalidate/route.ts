import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const secret = process.env.REVALIDATION_SECRET_TOKEN;

    // 1. Verify Secret Token
    if (!secret || authHeader !== `Bearer ${secret}`) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { domain, tag, expireImmediately } = body;

    // 2. Revalidate Cache Tags
    if (tag) {
      // Purge immediate cache using the profile override
      revalidateTag(tag, expireImmediately ? "max" : "default");
    }

    // 3. Revalidate Specific Storefront Path
    if (domain) {
      revalidatePath(`/tenants/${domain}`);
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: Date.now(),
      domain: domain || null,
      tag: tag || null,
    });
  } catch {
    return NextResponse.json(
      { error: "Error executing cache revalidation" },
      { status: 500 }
    );
  }
}