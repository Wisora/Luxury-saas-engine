'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PRICING_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 39,
    currency: '$',
    period: '/month',
    description: 'Ideal for individual luxury curators and single-brand boutiques.',
    planCode: process.env.NEXT_PUBLIC_PAYSTACK_STARTER_PLAN_CODE || 'PLN_YOUR_STARTER_CODE',
    features: [
      '7-Day Free Trial',
      '1 Storefront / Tenant',
      'Up to 50 active catalog items',
      'Standard click telemetry & analytics',
      'Standard client support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Creator',
    price: 99,
    currency: '$',
    period: '/month',
    description: 'Ideal for independent luxury brokers and boutique dealers.',
    planCode: process.env.NEXT_PUBLIC_PAYSTACK_PRO_PLAN_CODE || 'PLN_YOUR_PRO_CODE',
    popular: true,
    features: [
      '7-Day Free Trial',
      'Market signal analysis & intake',
      'Up to 50 visual compliance audits/mo',
      'Standard intelligence reporting',
    ],
  },
  {
    id: 'deluxe',
    name: 'Deluxe Tier',
    price: 299,
    currency: '$',
    period: '/month',
    description: 'Designed for multi-brand luxury retailers & high-volume brokers.',
    planCode: process.env.NEXT_PUBLIC_PAYSTACK_DELUXE_PLAN_CODE || 'PLN_YOUR_DELUXE_CODE',
    features: [
      '7-Day Free Trial',
      'Unlimited visual compliance audits',
      'Custom VIP Drop campaign generator',
      'Apple Vision Pro 3D spatial canvas',
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('starter');
  const [subdomain, setSubdomain] = useState('');
  const [brandName, setBrandName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreateTenant(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const activePlan = PRICING_PLANS.find((p) => p.id === selectedPlan);

      if (!activePlan) {
        alert('Please select a valid pricing plan.');
        setLoading(false);
        return;
      }

      // Initialize Paystack Checkout
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          brandName: brandName,
          tenantSubdomain: subdomain,
          amount: activePlan.price, // Handled in API route as USD or converted to ZAR cents
          planCode: activePlan.planCode || 'PLN_DEFAULT_STARTER',
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Could not initiate checkout.');
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred during setup.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold text-white">Create Your Brand Storefront</h1>
          <p className="text-slate-400">Choose a plan and enter your brand details to get started.</p>
        </div>

        {/* Pricing Plan Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {PRICING_PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`cursor-pointer relative p-6 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-slate-800 shadow-lg shadow-amber-500/10 scale-105'
                    : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">
                    {`${plan.currency}${plan.price}`}
                  </span>
                  <span className="text-slate-400 text-sm">{plan.period}</span>
                </div>
                <p className="mt-3 text-xs text-slate-400 leading-relaxed">{plan.description}</p>
                <ul className="mt-4 space-y-2 border-t border-slate-700/50 pt-4 text-xs text-slate-300">
                  {plan.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Onboarding Form */}
        <form onSubmit={handleCreateTenant} className="bg-slate-800/70 border border-slate-700 p-8 rounded-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">
                Brand / Creator Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alchemy Avenue"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">
                Desired Subdomain Slug
              </label>
              <input
                type="text"
                required
                placeholder="e.g. alchemy"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">
              Billing Email Address
            </label>
            <input
              type="email"
              required
              placeholder="billing@alchemyavenue.co.za"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-base transition-colors shadow-lg cursor-pointer"
          >
            {loading ? 'Setting Up...' : 'Continue to Paystack Checkout ↗'}
          </button>
        </form>
      </div>
    </div>
  );
}