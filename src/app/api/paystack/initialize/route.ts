import { NextResponse } from 'next/server';
import Paystack from 'paystack-sdk';

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY || '');

interface PaystackInitPayload {
  email: string;
  amount: number;
  callback_url: string;
  plan?: string;
  metadata: {
    tenantSubdomain: string;
    custom_fields: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, amountInZar, tenantSubdomain, planCode } = body;

    if (!email || !amountInZar || !tenantSubdomain) {
      return NextResponse.json(
        { error: 'Missing required parameters: email, amountInZar, tenantSubdomain' },
        { status: 400 }
      );
    }

    // Paystack takes amount in subunits (cents/kobo) as an integer
    const amountInCents = Math.round(Number(amountInZar) * 100);

    // Build payload using the explicit interface instead of 'any'
    const payload: PaystackInitPayload = {
      email,
      amount: amountInCents,
      callback_url: `http://localhost:3000/dashboard?payment=success`,
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
    };

    // Only attach plan if a valid planCode is provided and isn't a placeholder
    if (planCode && !planCode.includes('YOUR_')) {
      payload.plan = planCode;
    }

    const response = await paystack.transaction.initialize(payload);

    if (response.status && response.data?.authorization_url) {
      return NextResponse.json({ url: response.data.authorization_url });
    }

    return NextResponse.json(
      { error: response.message || 'Payment initialization failed' },
      { status: 400 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Paystack Initialization Error:', errorMessage);
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}