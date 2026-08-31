'use client';
import React, { useState } from "react";
import { Info, X } from "lucide-react";

export const AffiliateBanner: React.FC = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-gray-900 border-b border-gray-800 text-xs text-gray-400 py-2 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Info className="w-4 h-4 text-amber-500 shrink-0" />
        <span>
          <strong>Affiliate Disclosure:</strong> Aura Orchestrator curates verified luxury assets. Clicking outbound merchant links may earn us an affiliate commission at no extra cost to you.
        </span>
      </div>
      <button 
        onClick={() => setVisible(false)}
        className="text-gray-500 hover:text-white ml-4"
        aria-label="Close disclosure"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};