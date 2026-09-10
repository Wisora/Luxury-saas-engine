'use client';

import { useActionState } from 'react';
import { toggleAutomation, type AutomationFormState } from '@/app/actions/automation';

type Props = {
  subdomain: string;
  initialEnabled?: boolean;
};

const initialState: AutomationFormState = {};

export default function AutomationToggle({ subdomain, initialEnabled = true }: Props) {
  const [state, formAction, isPending] = useActionState(toggleAutomation, initialState);

  // Determine current active state (falls back to initial prop if form hasn't submitted yet)
  const isEnabled = state.isEnabled !== undefined ? state.isEnabled : initialEnabled;

  return (
    <div className="p-4 bg-slate-800/80 rounded-lg border border-slate-700 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-white">Phase 4: Automation & Execution Scaling</h4>
          <p className="text-xs text-slate-400">
            {isEnabled ? 'Automated telemetry scaling is ACTIVE' : 'Automated telemetry scaling is PAUSED'}
          </p>
        </div>

        <form action={formAction}>
          <input type="hidden" name="subdomain" value={subdomain} />
          <button
            type="submit"
            disabled={isPending}
            className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${
              isEnabled
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isPending ? 'Updating...' : isEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </form>
      </div>

      {state.error && (
        <p className="text-xs text-red-400 font-medium">{state.error}</p>
      )}
      {state.success && (
        <p className="text-xs text-emerald-400 font-medium">State updated successfully!</p>
      )}
    </div>
  );
}