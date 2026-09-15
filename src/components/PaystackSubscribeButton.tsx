
'use client';

import React, { useState } from "react";
import { SUBSCRIPTION_PLANS, Plan } from "../config/plans";

// Declare PaystackPop globally on the Window interface to eliminate TypeScript errors cleanly
declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key?: string;
        email: string;
        plan?: string;
        currency?: string;
        metadata?: Record<string, unknown>;
        callback?: (response: { reference: string }) => void;
        onClose?: () => void;
      }) => { openIframe: () => void };
    };
  }
}

interface PaystackSubscribeButtonProps {
  planKey: "pro" | "deluxe";
  userEmail: string;
  onSuccess?: (reference: string) => void;
  onClose?: () => void;
  className?: string;
}

export const PaystackSubscribeButton: React.FC<PaystackSubscribeButtonProps> = ({
  planKey,
  userEmail,
  onSuccess,
  onClose,
  className,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const plan: Plan = SUBSCRIPTION_PLANS[planKey];

  const handleSubscribe = async () => {
    setLoading(true);

    const initializePaystack = () => {
      if (typeof window !== "undefined" && window.PaystackPop) {
        const handler = window.PaystackPop.setup({
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
          email: userEmail,
          plan: plan.paystackPlanCode,
          currency: "ZAR",
          metadata: {
            plan_id: plan.id,
            plan_name: plan.name,
            price_usd: plan.priceUSD,
            custom_fields: [
              {
                display_name: "Billing Tier",
                variable_name: "billing_tier",
                value: `${plan.name} ($${plan.priceUSD}/mo)`,
              },
            ],
          },
          callback: (response: { reference: string }) => {
            setLoading(false);
            if (onSuccess) onSuccess(response.reference);
          },
          onClose: () => {
            setLoading(false);
            if (onClose) onClose();
          },
        });
        handler.openIframe();
      } else {
        alert("Paystack SDK failed to load. Please check your internet connection.");
        setLoading(false);
      }
    };

    if (typeof window !== "undefined" && !window.PaystackPop) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => initializePaystack();
      document.body.appendChild(script);
    } else {
      initializePaystack();
    }
  };

  return (
    <button
      type="button"
      onClick={handleSubscribe}
      disabled={loading || !userEmail}
      className={
        className ||
        "w-full py-3 px-6 rounded-lg font-semibold text-xs tracking-wide transition-all cursor-pointer bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-50"
      }
    >
      {loading ? "Initializing Checkout..." : `Subscribe to ${plan.name} ($${plan.priceUSD}/mo)`}
    </button>
  );
};