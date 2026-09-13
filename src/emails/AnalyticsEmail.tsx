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

interface AnalyticsEmailProps {
  firstName?: string;
  subdomain?: string;
}

export const AnalyticsEmail = ({
  firstName = 'Creator',
  subdomain = 'demo',
}: AnalyticsEmailProps) => {
  const dashboardUrl = `https://luxury-saas-engine.vercel.app/tenants/${subdomain}/dashboard`;

  return (
    <Html>
      <Head />
      <Preview>Unlocking your telemetry & click analytics 📊</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={logo}>AURA LUXURY PIPELINE</Text>
          <Heading style={h1}>Track Your High-Ticket Recommendations 📊</Heading>
          <Text style={text}>
            Hi {firstName}, now that your storefront is running, let’s talk about tracking what your audience actually engages with.
          </Text>

          <Section style={featureBox}>
            <Text style={featureTitle}>⚡ Live Outbound Telemetry</Text>
            <Text style={featureDesc}>See exactly which luxury items earn the highest outbound clicks in real time.</Text>
            
            <Text style={featureTitle}>📥 Instant CSV Exports</Text>
            <Text style={featureDesc}>Download your raw telemetry data anytime to analyze peak engagement hours.</Text>
            
            <Text style={featureTitle}>✏️ Inline Catalog Updates</Text>
            <Text style={featureDesc}>Swap out sold-out items in seconds without breaking bio links.</Text>
          </Section>

          <Section style={btnContainer}>
            <Button style={button} href={dashboardUrl}>
              View Live Dashboard
            </Button>
          </Section>

          <Text style={tipText}>
            💡 <strong>Pro Tip:</strong> Creators who feature 5 to 8 hyper-curated items convert <strong>3x higher</strong> than those listing massive, unfiltered lists.
          </Text>

          <Hr style={hr} />
          <Text style={footer}>Aura Luxury Pipeline • Automated Monetization Engine</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AnalyticsEmail;

// --- Styles ---
const main = { backgroundColor: '#0f172a', fontFamily: 'sans-serif', padding: '20px 0' };
const container = { backgroundColor: '#1e293b', margin: '0 auto', padding: '40px 20px', borderRadius: '12px', maxWidth: '600px' };
const logo = { color: '#f59e0b', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' as const };
const h1 = { color: '#ffffff', fontSize: '24px', fontWeight: 'bold', marginTop: '10px' };
const text = { color: '#cbd5e1', fontSize: '15px', lineHeight: '24px' };
const featureBox = { backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', margin: '20px 0' };
const featureTitle = { color: '#f59e0b', fontSize: '14px', fontWeight: 'bold', margin: '8px 0 2px' };
const featureDesc = { color: '#94a3b8', fontSize: '13px', margin: '0 0 10px' };
const btnContainer = { margin: '25px 0' };
const button = { backgroundColor: '#f59e0b', color: '#0f172a', fontWeight: 'bold', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', textDecoration: 'none' };
const tipText = { color: '#e2e8f0', fontSize: '13px', fontStyle: 'italic', backgroundColor: '#334155', padding: '12px', borderRadius: '6px' };
const hr = { borderColor: '#334155', margin: '30px 0 20px' };
const footer = { color: '#64748b', fontSize: '12px' };