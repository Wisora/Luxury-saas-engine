import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch all active tenant subdomains and configuration
export async function GET() {
  try {
    const tenants = await prisma.tenant.findMany({
      select: {
        id: true,
        name: true,
        subdomain: true,
        customDomain: true,
        isAutomationEnabled: true,
      },
    });

    return NextResponse.json(tenants, { status: 200 });
  } catch (error) {
    console.error('GET /api/domains error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenant domains' },
      { status: 500 }
    );
  }
}

// POST: Handle direct tenant creation/updates from client requests
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subdomain, name } = body;

    if (!subdomain) {
      return NextResponse.json(
        { error: 'Subdomain parameter is required' },
        { status: 400 }
      );
    }

    const tenant = await prisma.tenant.upsert({
      where: { subdomain },
      update: { 
        name: name || subdomain 
      },
      create: {
        name: name || subdomain,
        subdomain,
      },
    });

    return NextResponse.json(tenant, { status: 200 });
  } catch (error) {
    console.error('POST /api/domains error:', error);
    return NextResponse.json(
      { error: 'Failed to process domain request' },
      { status: 500 }
    );
  }
}