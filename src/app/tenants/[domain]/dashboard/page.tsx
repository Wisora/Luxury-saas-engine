'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface MetricProps {
  label: string;
  value: string;
  change?: string;
  subtext: string;
}

const MetricCard = ({ label, value, change, subtext }: MetricProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="relative p-6 rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-amber-500/30 transition-all duration-300"
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
      {change && (
        <span className="text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          {change}
        </span>
      )}
    </div>
    <div className="font-serif text-3xl font-normal text-white mb-1">
      {value}
    </div>
    <p className="text-xs text-slate-500 font-light">{subtext}</p>
  </motion.div>
);

export default function CreatorDashboard({ params }: { params: { subdomain: string } }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'analytics'>('overview');

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-200">
      {/* Dashboard Header / Navigation */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <h1 className="font-serif text-2xl text-white font-normal tracking-wide">
                {params.subdomain.toUpperCase()} PIPELINE
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live Telemetry & Catalog Operations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/tenants/${params.subdomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-amber-400 border border-white/10 hover:border-amber-500/40 px-4 py-2 rounded-lg bg-slate-900/80 transition-all duration-300"
            >
              View Public Storefront ↗
            </a>
            <button className="text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-lg transition-colors duration-300">
              + Add New Item
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="max-w-7xl mx-auto px-6 flex gap-8 border-t border-white/5 text-xs font-medium uppercase tracking-widest text-slate-400">
          {(['overview', 'catalog', 'analytics'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 relative transition-colors ${
                activeTab === tab ? 'text-amber-400' : 'hover:text-slate-200'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400"
                />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Metrics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Outbound Clicks"
            value="1,428"
            change="+18.4%"
            subtext="Total affiliate link routing"
          />
          <MetricCard
            label="Unique Visitors"
            value="892"
            change="+12.1%"
            subtext="Unique audience sessions"
          />
          <MetricCard
            label="Active Items"
            value="12"
            subtext="Curated lookbook listings"
          />
          <MetricCard
            label="Est. Conversion Rate"
            value="4.8%"
            change="+0.9%"
            subtext="Click-through ratio"
          />
        </section>

        {/* Telemetry Log & Catalog Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Recommendations Table (2 Cols) */}
          <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-xl text-white font-normal">
                  Highest Engagement Recommendations
                </h2>
                <p className="text-xs text-slate-400">
                  Real-time outbound telemetry by item
                </p>
              </div>
              <button className="text-xs text-amber-400 hover:underline">
                Export Raw CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="pb-3 font-normal">Item</th>
                    <th className="pb-3 font-normal">Brand</th>
                    <th className="pb-3 font-normal">Price</th>
                    <th className="pb-3 font-normal text-right">Clicks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { title: 'Velvet Evening Blazer', brand: 'TOM FORD', price: 'R 24,500', clicks: 412 },
                    { title: 'Oyster Perpetual 36', brand: 'ROLEX', price: 'R 145,000', clicks: 328 },
                    { title: 'Le Chiquito Mini Bag', brand: 'JACQUEMUS', price: 'R 12,800', clicks: 289 },
                    { title: 'Cashmere Trench Coat', brand: 'BURBERRY', price: 'R 38,000', clicks: 194 },
                  ].map((item, index) => (
                    <tr key={index} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 font-serif text-white group-hover:text-amber-200 transition-colors">
                        {item.title}
                      </td>
                      <td className="py-3.5 text-xs tracking-widest text-amber-500/90 font-semibold uppercase">
                        {item.brand}
                      </td>
                      <td className="py-3.5 text-xs text-slate-300">{item.price}</td>
                      <td className="py-3.5 text-right font-mono text-sm text-slate-200">
                        {item.clicks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions / Link Integration Box (1 Col) */}
          <div className="space-y-6">
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h2 className="font-serif text-xl text-white font-normal mb-2">
                Storefront Bio Link
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Paste this link directly into your Instagram, TikTok, or YouTube bio.
              </p>

              <div className="p-3 bg-slate-950 rounded-lg border border-white/10 flex items-center justify-between text-xs font-mono text-slate-300 mb-4">
                <span className="truncate">
                  {`https://${params.subdomain}.luxury-saas-engine.vercel.app`}
                </span>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `https://${params.subdomain}.luxury-saas-engine.vercel.app`
                    )
                  }
                  className="ml-2 text-amber-400 hover:text-amber-300 font-sans font-semibold uppercase"
                >
                  Copy
                </button>
              </div>

              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 space-y-1">
                <span className="font-semibold block text-amber-400">💡 Performance Tip</span>
                <p>
                  Featuring 5 to 8 hyper-curated items yields 3x higher outbound click conversion than large, unfiltered lists.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}