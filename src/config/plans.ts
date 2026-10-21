export interface Plan {
  id: string;
  name: string;
  priceUSD: number;
  priceZAR: number;
  amountZARInCents: number;
  paystackPlanCode: string;
  description: string;
  features: string[];
}

export const SUBSCRIPTION_PLANS: Record<string, Plan> = {
  starter: {
    id: "starter",
    name: "Starter",
    priceUSD: 39,
    priceZAR: 640,
    amountZARInCents: 64000,
    paystackPlanCode: process.env.NEXT_PUBLIC_PAYSTACK_STARTER_PLAN_CODE || "PLN_k2glfghofgnnbdg",
    description: "Ideal for individual luxury curators and single-brand boutiques.",
    features: [
      "7-Day Free Trial",
      "1 Storefront / Tenant",
      "Up to 50 active catalog items",
      "Standard click telemetry & analytics",
      "Standard client support",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceUSD: 99,
    priceZAR: 1620,
    amountZARInCents: 162000,
    paystackPlanCode: process.env.NEXT_PUBLIC_PAYSTACK_PRO_PLAN_CODE || "PLN_YOUR_PRO_CODE",
    description: "Ideal for independent luxury brokers and boutique dealers.",
    features: [
      "7-Day Free Trial",
      "Market signal analysis & intake",
      "Up to 50 visual compliance audits/mo",
      "Standard intelligence reporting",
      "Automated outreach tools",
    ],
  },
  deluxe: {
    id: "deluxe",
    name: "Deluxe",
    priceUSD: 299,
    priceZAR: 4900,
    amountZARInCents: 490000,
    paystackPlanCode: process.env.NEXT_PUBLIC_PAYSTACK_DELUXE_PLAN_CODE || "PLN_YOUR_DELUXE_CODE",
    description: "Designed for multi-brand luxury retailers & high-volume brokers.",
    features: [
      "7-Day Free Trial",
      "Unlimited visual compliance audits",
      "Custom VIP Drop campaign generator",
      "Apple Vision Pro 3D spatial canvas",
      "Strategy AI agent & PDF executive reports",
      "Priority worker execution speeds",
    ],
  },
};