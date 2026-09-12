import { NextResponse } from 'next/server';
import Paystack from 'paystack-sdk';

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY || '');

export async function POST(req: Request) {
  try {
    const { email, amountInZar, tenantSubdomain, planCode } = await req.json();

    if (!email || !amountInZar || !tenantSubdomain) {
      return NextResponse.json(
        { error: 'Missing required parameters: email, amountInZar, tenantSubdomain' },
        { status: 400 }
      );
    }

    // Paystack takes amount in cents/kobo (R100.00 = 10000)
    const amountInCents = Math.round(amountInZar * 100);

    const response = await paystack.transaction.initialize({
      email,
      amount: amountInCents.toString(),
      plan: planCode || undefined,
      callback_url: `https://luxury-saas-engine.vercel.app/tenants/${tenantSubdomain}/dashboard?payment=success`,
      metadata: {
        tenantSubdomain,
        custom_fields: [
          {
            display_name: 'Tenant Subdomain',
            variable_name: 'tenant_subdomain',
            value: tenantSubdomain,
          },
        ],
      },
    });

    if (response.status && response.data?.authorization_url) {
      return NextResponse.json({ url: response.data.authorization_url });
    }

    return NextResponse.json(
      { error: response.message || 'Payment initialization failed' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Paystack Initialization Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}