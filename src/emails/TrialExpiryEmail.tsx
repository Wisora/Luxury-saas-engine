import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface TrialExpiryEmailProps {
  firstName?: string;
  brandName?: string;
  trialEndDate?: string;
}

export const TrialExpiryEmail = ({
  firstName = 'Creator',
  brandName = 'Your Brand',
  trialEndDate = 'in 3 days',
}: TrialExpiryEmailProps) => {
  const checkoutUrl = 'https://luxury-saas-engine.vercel.app/onboarding';

  return (
    <Html>
      <Head />
      <Preview>3 days left on your trial — Keep your storefront active ✨</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={logo}>AURA LUXURY PIPELINE</Text>
          <Heading style={h1}>3 Days Remaining on Your Free Trial ✨</Heading>
          <Text style={text}>
            Hi {firstName}, your 14-day free trial for <strong>{brandName}</strong> concludes {trialEndDate}.
          </Text>
          <Text style={text}>
            Lock in your subscription now to ensure your custom storefront and outbound tracking remain uninterrupted:
          </Text>

          <Section style={planContainer}>
            <Text style={planTitle}>Pro Creator Tier — R299/mo</Text>
            <Text style={planDesc}>Unlimited listings, full telemetry, inline CRUD editing, and instant CSV exports.</Text>
            
            <Text style={planTitle}>Luxe / Agency Tier — R799/mo</Text>
            <Text style={planDesc}>Custom domain integration (shop.yourbrand.co.za) + dedicated support.</Text>
          </Section>

          <Section style={btnContainer}>
            <Button style={button} href={checkoutUrl}>
              Upgrade via Paystack
            </Button>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            Need help choosing a plan? Reply directly to this email for personalized assistance.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default TrialExpiryEmail;

// --- Styles ---
const main = { backgroundColor: '#0f172a', fontFamily: 'sans-serif', padding: '20px 0' };
const container = { backgroundColor: '#1e293b', margin: '0 auto', padding: '40px 20px', borderRadius: '12px', maxWidth: '600px' };
const logo = { color: '#f59e0b', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' as const };
const h1 = { color: '#ffffff', fontSize: '24px', fontWeight: 'bold', marginTop: '10px' };
const text = { color: '#cbd5e1', fontSize: '15px', lineHeight: '24px' };
const planContainer = { borderLeft: '3px solid #f59e0b', paddingLeft: '15px', margin: '20px 0' };
const planTitle = { color: '#ffffff', fontSize: '15px', fontWeight: 'bold', margin: '8px 0 2px' };
const planDesc = { color: '#94a3b8', fontSize: '13px', margin: '0 0 10px' };
const btnContainer = { margin: '25px 0' };
const button = { backgroundColor: '#f59e0b', color: '#0f172a', fontWeight: 'bold', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', textDecoration: 'none' };
const hr = { borderColor: '#334155', margin: '30px 0 20px' };
const footer = { color: '#64748b', fontSize: '12px' };