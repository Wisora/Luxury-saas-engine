'use client';

import { useState, useTransition } from 'react';
import { toggleAutomation } from '@/app/actions/automation';

type Props = {
  subdomain: string;
  initialEnabled: boolean;
};

export default function AutomationToggle({ subdomain, initialEnabled }: Props) {
  const [isEnabled, setIsEnabled] = useState(initialEnabled);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    // Optimistic UI update
    const newState = !isEnabled;
    setIsEnabled(newState);

    startTransition(async () => {
      const result = await toggleAutomation(subdomain, isEnabled);
      if (!result.success) {
        // Revert on failure
        setIsEnabled(isEnabled);
        alert(result.error || 'Failed to update setting.');
      }
    });
  };

  return (
    <div className="flex items-center justify-between p-4 bg-slate-800/80 rounded-lg border border-slate-700">
      <div>
        <h4 className="text-sm font-semibold text-white">Phase 4: Automation & Execution Scaling</h4>
        <p className="text-xs text-slate-400">
          {isEnabled ? 'Automated telemetry scaling is ACTIVE' : 'Automated telemetry scaling is PAUSED'}
        </p>
      </div>

      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${
          isEnabled
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
            : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
        } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isPending ? 'Updating...' : isEnabled ? 'Enabled' : 'Disabled'}
      </button>
    </div>
  );
}