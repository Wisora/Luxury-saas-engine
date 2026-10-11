'use client';

import React, { useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface PageProps {
  params: Promise<{ domain: string }>;
}

export default function CreatorDashboard({ params }: PageProps) {
  const resolvedParams = use(params);
  const domain = resolvedParams?.domain || 'TENANT';

  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'analytics'>('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [itemTitle, setItemTitle] = useState('');
  const [itemBrand, setItemBrand] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');

  // Sample items state
  const [items, setItems] = useState([
    { id: 1, title: 'Velvet Evening Blazer', brand: 'TOM FORD', price: 'R 24,500', clicks: 412 },
    { id: 2, title: 'Oyster Perpetual 36', brand: 'ROLEX', price: 'R 145,000', clicks: 328 },
    { id: 3, title: 'Le Chiquito Mini Bag', brand: 'JACQUEMUS', price: 'R 12,800', clicks: 289 },
    { id: 4, title: 'Cashmere Trench Coat', brand: 'BURBERRY', price: 'R 38,000', clicks: 194 },
  ]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = () => {
    const storefrontUrl = `https://${domain}.luxury-saas-engine.vercel.app`;
    navigator.clipboard.writeText(storefrontUrl);
    showNotification('Bio Link Copied to Clipboard!');
  };

  const handleExportCSV = () => {
    const headers = 'Item Title,Brand,Price,Outbound Clicks\n';
    const rows = items.map((i) => `"${i.title}","${i.brand}","${i.price}",${i.clicks}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${domain}-telemetry-export.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification('Raw CSV Exported Successfully!');
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle || !itemBrand || !itemPrice) return;

    const newItem = {
      id: Date.now(),
      title: itemTitle,
      brand: itemBrand.toUpperCase(),
      price: itemPrice.startsWith('R') ? itemPrice : `R ${itemPrice}`,
      clicks: 0,
    };

    setItems([newItem, ...items]);
    setItemTitle('');
    setItemBrand('');
    setItemPrice('');
    setAffiliateUrl('');
    setIsModalOpen(false);
    showNotification('New Item Added to Catalog!');
  };

  const handleDeleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
    showNotification('Item Removed from Lookbook.');
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-200 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-amber-400 text-slate-950 font-semibold text-xs px-4 py-3 rounded-lg shadow-xl border border-amber-300"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Header / Navigation */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <h1 className="font-serif text-2xl text-white font-normal tracking-wide">
                {domain.toUpperCase()} PIPELINE
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live Telemetry & Catalog Operations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/tenants/${domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-amber-400 border border-white/10 hover:border-amber-500/40 px-4 py-2 rounded-lg bg-slate-900/80 transition-all duration-300"
            >
              View Public Storefront ↗
            </a>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-lg transition-colors duration-300 cursor-pointer"
            >
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
              className={`py-3 relative transition-colors cursor-pointer ${
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
        {/* OVERVIEW TAB CONTENT */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                label="Outbound Clicks"
                value={items.reduce((acc, curr) => acc + curr.clicks, 0).toLocaleString()}
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
                value={items.length.toString()}
                subtext="Curated lookbook listings"
              />
              <MetricCard
                label="Est. Conversion Rate"
                value="4.8%"
                change="+0.9%"
                subtext="Click-through ratio"
              />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  <button
                    onClick={handleExportCSV}
                    className="text-xs text-amber-400 hover:underline cursor-pointer font-semibold uppercase tracking-wider"
                  >
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
                      {items.map((item) => (
                        <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
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
                      {`https://${domain}.luxury-saas-engine.vercel.app`}
                    </span>
                    <button
                      onClick={handleCopyLink}
                      className="ml-2 text-amber-400 hover:text-amber-300 font-sans font-semibold uppercase cursor-pointer"
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
          </div>
        )}

        {/* CATALOG TAB CONTENT */}
        {activeTab === 'catalog' && (
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl text-white font-normal">Lookbook Catalog Management</h2>
                <p className="text-xs text-slate-400">Manage active items displayed on your public storefront</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                + Add New Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="pb-3 font-normal">Item Title</th>
                    <th className="pb-3 font-normal">Brand</th>
                    <th className="pb-3 font-normal">Price</th>
                    <th className="pb-3 font-normal">Clicks</th>
                    <th className="pb-3 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.map((item) => (
                    <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 font-serif text-white">{item.title}</td>
                      <td className="py-4 text-xs tracking-widest text-amber-500 font-semibold uppercase">{item.brand}</td>
                      <td className="py-4 text-xs text-slate-300">{item.price}</td>
                      <td className="py-4 font-mono text-sm text-slate-200">{item.clicks}</td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 uppercase font-semibold cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB CONTENT */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif text-xl text-white font-normal mb-1">Audience & Traffic Telemetry</h2>
                  <p className="text-xs text-slate-400">Deep dive into user sessions and referral channels</p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Export Telemetry CSV
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-950 p-5 rounded-lg border border-white/5">
                  <span className="text-xs uppercase text-slate-400 tracking-wider">Top Traffic Source</span>
                  <div className="font-serif text-2xl text-white mt-2">Instagram Bio</div>
                  <p className="text-xs text-emerald-400 mt-1">64% of total visits</p>
                </div>
                <div className="bg-slate-950 p-5 rounded-lg border border-white/5">
                  <span className="text-xs uppercase text-slate-400 tracking-wider">Avg. Session Duration</span>
                  <div className="font-serif text-2xl text-white mt-2">2m 45s</div>
                  <p className="text-xs text-emerald-400 mt-1">+14s vs last week</p>
                </div>
                <div className="bg-slate-950 p-5 rounded-lg border border-white/5">
                  <span className="text-xs uppercase text-slate-400 tracking-wider">Bounce Rate</span>
                  <div className="font-serif text-2xl text-white mt-2">32.4%</div>
                  <p className="text-xs text-emerald-400 mt-1">-4.2% optimization</p>
                </div>
              </div>

              <div className="p-6 bg-slate-950/60 rounded-xl border border-white/5 text-center py-12">
                <p className="text-sm text-slate-400 font-light">
                  Real-time event stream tracking is active for <span className="text-amber-400 font-mono">{domain}</span>.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add New Item Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-xl text-white font-normal">Add Lookbook Item</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Item Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Silk Evening Gown"
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GUCCI"
                    value={itemBrand}
                    onChange={(e) => setItemBrand(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Price (ZAR)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15,500"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Affiliate Link URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={affiliateUrl}
                    onChange={(e) => setAffiliateUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold uppercase text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold uppercase text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                  >
                    Save Item
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}