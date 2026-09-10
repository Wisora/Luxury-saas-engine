import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ error: 'Missing productId parameter' }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, tenantId: true, affiliateUrl: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Record click telemetry in Supabase
    await prisma.click.create({
      data: {
        tenantId: product.tenantId,
        productId: product.id,
        userAgent: request.headers.get('user-agent') || undefined,
        referrer: request.headers.get('referer') || undefined,
      },
    });

    // 302 Redirect buyer directly to merchant affiliate URL
    return NextResponse.redirect(product.affiliateUrl, 302);
  } catch (err: unknown) {
    console.error('Click tracking error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}