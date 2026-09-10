import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subdomain = searchParams.get('subdomain');

  if (!subdomain) {
    return NextResponse.json({ error: 'Missing subdomain parameter' }, { status: 400 });
  }

  try {
    // 1. Resolve tenant ID from subdomain
    const tenant = await prisma.tenant.findUnique({
      where: { subdomain },
      select: { id: true, name: true },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // 2. Query all click event logs for the tenant
    const clicks = await prisma.click.findMany({
      where: { tenantId: tenant.id },
      include: {
        product: {
          select: { title: true, category: true, price: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 3. Format CSV header and rows
    const csvHeader = 'Click ID,Timestamp,Product Title,Category,Price,User Agent,Referrer\n';
    
    const csvRows = clicks.map((click) => {
      const sanitizedTitle = `"${click.product.title.replace(/"/g, '""')}"`;
      const sanitizedCategory = `"${click.product.category.replace(/"/g, '""')}"`;
      const sanitizedUserAgent = `"${(click.userAgent || 'Unknown').replace(/"/g, '""')}"`;
      const sanitizedReferrer = `"${(click.referrer || 'Direct').replace(/"/g, '""')}"`;
      const formattedDate = new Date(click.createdAt).toISOString();

      return [
        click.id,
        formattedDate,
        sanitizedTitle,
        sanitizedCategory,
        click.product.price.toFixed(2),
        sanitizedUserAgent,
        sanitizedReferrer,
      ].join(',');
    }).join('\n');

    const csvContent = csvHeader + csvRows;

    // 4. Return response with disposition headers to force download in browser
    const filename = `${tenant.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-click-telemetry.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err: unknown) {
    console.error('CSV Export Error:', err);
    return NextResponse.json({ error: 'Failed to generate CSV export' }, { status: 500 });
  }
}