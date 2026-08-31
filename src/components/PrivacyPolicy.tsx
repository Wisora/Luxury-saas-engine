'use client';
import React from "react";

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-300">
      <h1 className="text-3xl font-bold mb-4 text-white">Privacy Policy</h1>
      <p className="mb-4 text-sm text-gray-400">Last updated: August 2026</p>
      
      <p className="mb-4">
        Aura Orchestrator ("we," "our," or "us") respects your privacy. This Privacy Policy outlines how we collect, use, and protect information when you visit our luxury asset marketplace portal.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-white">1. Information Collection</h2>
      <p className="mb-4">
        We do not require user account creation to browse our catalog. We may collect non-personally identifiable technical data such as IP address, browser type, device details, and referral source via standard analytics tools to optimize portal performance.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-white">2. Cookies & Tracking Technologies</h2>
      <p className="mb-4">
        We use cookies and third-party tracking scripts solely to facilitate outbound affiliate link redirection, measure site performance, and ensure proper session handling.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-white">3. Third-Party Links & Affiliate Networks</h2>
      <p className="mb-4">
        Our portal contains outbound links to external merchant websites (including luxury watch and handbag retailers). When you click an outbound link, third-party affiliate networks (such as CJ Affiliate, Rakuten Advertising, and Impact) may place tracking cookies on your device to attribute purchases. We have no control over third-party privacy practices.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-white">4. Contact Us</h2>
      <p className="mb-4">
        If you have questions regarding this Privacy Policy, please reach out via our contact channels on the portal.
      </p>
    </div>
  );
};