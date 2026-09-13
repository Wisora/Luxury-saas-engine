import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import WelcomeEmail from '@/emails/WelcomeEmail';

export async function POST(req: Request) {
  try {
    // Check for API key at runtime inside the handler
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY is not configured in environment variables.');
      return NextResponse.json(
        { error: 'Email service unconfigured' },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const { email, firstName, brandName, subdomain } = await req.json();

    const data = await resend.emails.send({
      from: 'Aura Luxury <onboarding@yourdomain.com>',
      to: [email],
      subject: 'Welcome to Aura — Your luxury storefront is ready 🥂',
      react: WelcomeEmail({ firstName, brandName, subdomain }),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Resend Delivery Error:', error);
    return NextResponse.json(
      { error: 'Email delivery failed' },
      { status: 500 }
    );
  }
}