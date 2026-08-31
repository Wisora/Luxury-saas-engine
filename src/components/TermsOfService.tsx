'use client';
import React from "react";

export const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-300">
      <h1 className="text-3xl font-bold mb-4 text-white">Terms of Service & Affiliate Disclosure</h1>
      <p className="mb-4 text-sm text-gray-400">Last updated: August 2026</p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-white">1. Affiliate Disclosure</h2>
      <p className="mb-4">
        Aura Orchestrator operates as a curated luxury directory and platform. Certain links on this website are affiliate links. If you click through an outbound merchant link and make a purchase, we may earn an affiliate commission at zero additional cost to you.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-white">2. Product Listings & Pricing Disclaimer</h2>
      <p className="mb-4">
        All pricing, product availability, serial verification status, and specifications displayed on this portal are fetched automatically and subject to real-time changes. Aura Orchestrator does not process payments directly, process shipments, or handle product returns. Final transactions are completed entirely on the target merchant's authorized checkout platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-white">3. Intellectual Property</h2>
      <p className="mb-4">
        Brand names, trademarks, and imagery (such as Rolex, Hermès, Audemars Piguet, and Patek Philippe) belong to their respective copyright holders. Their inclusion on this portal is strictly for descriptive curation and identification purposes.
      </p>
    </div>
  );
};