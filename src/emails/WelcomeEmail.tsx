import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  firstName?: string;
  brandName?: string;
  subdomain?: string;
}

export const WelcomeEmail = ({
  firstName = 'Creator',
  brandName = 'Your Brand',
  subdomain = 'demo',
}: WelcomeEmailProps) => {
  const storeUrl = `https://${subdomain}.luxury-saas-engine.vercel.app`;

  return (
    <Html>
      <Head />
      <Preview>Welcome to Aura — Your luxury storefront is ready 🥂</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={logo}>AURA LUXURY PIPELINE</Text>
          <Heading style={h1}>Welcome to Aura, {firstName}! 🥂</Heading>
          <Text style={text}>
            We are thrilled to have <strong>{brandName}</strong> on board. Your white-labeled luxury storefront is officially live and ready for setup.
          </Text>

          <Section style={btnContainer}>
            <Button style={button} href={storeUrl}>
              Visit Your Storefront
            </Button>
          </Section>

          <Text style={subheading}>3 Quick Steps to Launch Today:</Text>
          <Text style={listItem}>
            <strong>1. Log in to Dashboard:</strong> Access your catalog editor to customize brand details.
          </Text>
          <Text style={listItem}>
            <strong>2. Add Your First Products:</strong> Paste your curated links and high-res imagery.
          </Text>
          <Text style={listItem}>
            <strong>3. Add Link to Bio:</strong> Share your exclusive Aura URL on Instagram, TikTok, or YouTube.
          </Text>

          <Hr style={hr} />
          <Text style={footer}>
            Need help setting up your collections? Reply directly to this email—our team is on standby to help.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

// --- Styles ---
const main = { backgroundColor: '#0f172a', fontFamily: 'sans-serif', padding: '20px 0' };
const container = { backgroundColor: '#1e293b', margin: '0 auto', padding: '40px 20px', borderRadius: '12px', maxWidth: '600px' };
const logo = { color: '#f59e0b', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' as const };
const h1 = { color: '#ffffff', fontSize: '24px', fontWeight: 'bold', marginTop: '10px' };
const text = { color: '#cbd5e1', fontSize: '15px', lineHeight: '24px' };
const subheading = { color: '#ffffff', fontSize: '16px', fontWeight: 'bold', marginTop: '25px' };
const listItem = { color: '#94a3b8', fontSize: '14px', lineHeight: '22px', margin: '6px 0' };
const btnContainer = { margin: '25px 0' };
const button = { backgroundColor: '#f59e0b', color: '#0f172a', fontWeight: 'bold', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', textDecoration: 'none' };
const hr = { borderColor: '#334155', margin: '30px 0 20px' };
const footer = { color: '#64748b', fontSize: '12px', lineHeight: '18px' };