import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Helper to sanitize incoming domain strings
function sanitizeDomain(rawDomain: string): string {
  if (!rawDomain) return 'demo';
  const decoded = decodeURIComponent(rawDomain);
  return decoded.split('.')[0].split(':')[0].toLowerCase();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    const cleanDomain = sanitizeDomain(domain);

    // Find tenant by subdomain or custom domain, including products
    const tenant = await prisma.tenant.findFirst({
      where: {
        OR: [
          { subdomain: cleanDomain },
          { subdomain: domain },
          { customDomain: domain },
        ],
      },
      include: {
        products: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!tenant) {
      // Return a polite empty storefront object instead of a hard 404 crash
      return NextResponse.json({
        id: 'fallback-tenant',
        name: cleanDomain.toUpperCase(),
        accentColor: '#D4AF37',
        products: [],
      });
    }

    return NextResponse.json(tenant);
  } catch (error: unknown) {
    console.error('Storefront API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}