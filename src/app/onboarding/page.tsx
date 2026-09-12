'use client';

import { useState } from 'react';

const PRICING_PLANS = [
  {
    id: 'starter',
    name: 'Starter / Trial',
    price: 0,
    period: '14 Days Free',
    description: 'Perfect for testing out your storefront and tracking initial clicks.',
    planCode: '',
    features: ['Up to 10 Listed Products', 'Basic Telemetry Analytics', 'Standard Support'],
  },
  {
    id: 'pro',
    name: 'Pro Creator',
    price: 299,
    period: '/month',
    description: 'For active affiliate creators scaling their recommendations.',
    planCode: 'PLN_pro_299_zar', // Create this in Paystack Dashboard -> Plans
    popular: true,
    features: ['Unlimited Products', 'Full Telemetry & CSV Exports', 'Inline Product Editing', 'Priority Support'],
  },
  {
    id: 'luxe',
    name: 'Luxe / Agency',
    price: 799,
    period: '/month',
    description: 'For established brands requiring custom domain routing and dedicated analytics.',
    planCode: 'PLN_luxe_799_zar', // Create this in Paystack Dashboard -> Plans
    features: ['Everything in Pro', 'Custom Domain Setup', 'Advanced Click Insights', '1-on-1 Onboarding'],
  },
];

export default function OnboardingPage() {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [subdomain, setSubdomain] = useState('');
  const [brandName, setBrandName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreateTenant(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const activePlan = PRICING_PLANS.find((p) => p.id === selectedPlan);

      // 1. If Free/Starter Plan selected, skip payment and redirect to dashboard
      if (!activePlan || activePlan.price === 0) {
        window.location.href = `/tenants/${subdomain}/dashboard`;
        return;
      }

      // 2. Initialize Paystack Checkout for Paid Plans
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          tenantSubdomain: subdomain,
          amountInZar: activePlan.price,
          planCode: activePlan.planCode,
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
                  <span className="text-3xl font-extrabold text-white">R{plan.price}</span>
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
                placeholder="e.g. Luxe Living"
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
                placeholder="e.g. luxeliving"
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
              placeholder="billing@yourbrand.co.za"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-base transition-colors shadow-lg"
          >
            {loading ? 'Setting Up...' : selectedPlan === 'starter' ? 'Launch Storefront (Free Trial)' : 'Continue to Paystack Checkout ↗'}
          </button>
        </form>
      </div>
    </div>
  );
}