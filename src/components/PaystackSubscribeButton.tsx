'use client';

import { useState } from 'react';

type Props = {
  email: string;
  tenantSubdomain: string;
  amountInZar: number;
  planCode?: string;
  buttonLabel?: string;
};

export default function PaystackSubscribeButton({
  email,
  tenantSubdomain,
  amountInZar,
  planCode,
  buttonLabel = 'Subscribe via Paystack',
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          tenantSubdomain,
          amountInZar,
          planCode,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Could not launch checkout.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error initiating Paystack checkout.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-sm transition-colors shadow-sm"
    >
      {loading ? 'Opening Checkout...' : `${buttonLabel} (R${amountInZar})`}
    </button>
  );
}