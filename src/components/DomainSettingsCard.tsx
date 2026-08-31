'use client';

import React, { useState } from 'react';
import { Globe, CheckCircle2, Copy, AlertCircle, RefreshCw, Lock } from 'lucide-react';

interface DomainSettingsCardProps {
  tenantId: string;
  initialCustomDomain?: string;
  subdomain: string;
}

export function DomainSettingsCard({
  tenantId,
  initialCustomDomain = '',
  subdomain,
}: DomainSettingsCardProps) {
  const [customDomain, setCustomDomain] = useState(initialCustomDomain);
  const [inputDomain, setInputDomain] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleCopyCNAME = () => {
    navigator.clipboard.writeText('app.wisora.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputDomain.trim()) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          customDomain: inputDomain.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update domain');
      }

      setCustomDomain(data.tenant.customDomain);
      setInputDomain('');
      setStatusMessage({
        type: 'success',
        text: 'Custom domain updated! Configure your DNS CNAME record below.',
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
      setStatusMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0f141d] border border-gray-800/80 rounded-xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-serif font-medium text-white">Custom Domain Management</h3>
            <p className="text-xs font-mono text-gray-400">Configure your brand hostname and SSL certificates</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex items-center gap-1.5">
          <Lock className="w-3 h-3" /> SSL Auto-Provisioned
        </span>
      </div>

      {/* Active Subdomain & Custom Domain Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="p-3.5 bg-gray-900/40 border border-gray-800 rounded-lg space-y-1">
          <span className="text-gray-500 uppercase text-[10px]">Default Platform URL</span>
          <div className="text-white font-semibold">{subdomain}.wisora.com</div>
        </div>
        <div className="p-3.5 bg-gray-900/40 border border-gray-800 rounded-lg space-y-1">
          <span className="text-gray-500 uppercase text-[10px]">Custom Domain Status</span>
          <div className="flex items-center gap-2">
            {customDomain ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-amber-300 font-semibold">{customDomain}</span>
              </>
            ) : (
              <span className="text-gray-500 italic">No custom domain configured</span>
            )}
          </div>
        </div>
      </div>

      {/* Form & Add Domain Action */}
      <form onSubmit={handleSaveDomain} className="space-y-3">
        <label className="block text-xs font-mono text-gray-300 uppercase">
          Attach Custom Domain
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. aurawatchco.com"
            value={inputDomain}
            onChange={(e) => setInputDomain(e.target.value)}
            className="flex-1 bg-black/50 border border-gray-800 rounded-lg px-3.5 py-2 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            disabled={isSubmitting || !inputDomain.trim()}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-mono text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            Save Domain
          </button>
        </div>
      </form>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          className={`p-3 rounded-lg border text-xs font-mono flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
              : 'bg-red-950/40 border-red-800 text-red-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* DNS Configuration Instructions */}
      <div className="p-4 bg-black/60 border border-gray-800 rounded-lg space-y-3">
        <div className="text-xs font-mono font-medium text-amber-400 uppercase tracking-wider">
          DNS Setup Instructions
        </div>
        <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
          Log in to your domain registrar (e.g., Cloudflare, GoDaddy, Namecheap) and create a CNAME record pointing your custom domain to our edge routing node:
        </p>

        <div className="flex items-center justify-between p-2.5 bg-gray-900 border border-gray-800 rounded font-mono text-xs">
          <div className="space-x-4">
            <span className="text-gray-500">TYPE: <strong className="text-white">CNAME</strong></span>
            <span className="text-gray-500">VALUE: <strong className="text-amber-300">app.wisora.com</strong></span>
          </div>
          <button
            onClick={handleCopyCNAME}
            className="flex items-center gap-1.5 text-[10px] text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <Copy className="w-3 h-3" />
            {copied ? 'COPIED' : 'COPY'}
          </button>
        </div>
      </div>
    </div>
  );
}