'use client';

import React, { useState, useEffect, use, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createProduct, deleteProduct } from '@/app/actions/product';
import AnalyticsChart from '@/components/AnalyticsChart';

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
    className="relative p-6 rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-amber-500/40 transition-all duration-300 group overflow-hidden"
  >
    <div className="absolute -inset-px bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl" />
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
      {change && (
        <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-2 py-0.5 rounded-full">
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

interface ProductCardProps {
  id: string;
  title: string;
  category: string;
  price: number;
  imageUrl: string;
  affiliateUrl: string;
  clicks?: number;
}

const Luxury3DProductCard = ({ title, category, price, imageUrl, affiliateUrl, clicks = 0 }: ProductCardProps) => (
  <motion.div
    whileHover={{ scale: 1.02, rotateX: 3, rotateY: -3 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className="group relative rounded-2xl bg-slate-900/70 border border-white/10 p-4 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col justify-between"
  >
    <div className="absolute -inset-px bg-gradient-to-r from-amber-500/0 via-amber-500/20 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

    <div>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-950 mb-4 border border-white/5">
        {imageUrl ? (
          <motion.img
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-slate-600 uppercase tracking-widest font-mono">
            No Image Provided
          </div>
        )}

        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest text-amber-400">
          {category}
        </div>

        <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-md text-[10px] font-mono text-slate-300">
          {clicks} Clicks
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-serif text-lg text-white group-hover:text-amber-200 transition-colors truncate">
          {title}
        </h3>
        <p className="font-mono text-sm font-medium text-amber-400">
          R {price.toLocaleString()}
        </p>
      </div>
    </div>

    <a
      href={affiliateUrl || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-full mt-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs uppercase tracking-wider transition-colors shadow-lg"
    >
      Acquire Piece ↗
    </a>
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
  const [isPending, startTransition] = useTransition();

  // Dynamic products state fetched directly from PostgreSQL via /api/storefront
  const [items, setItems] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to fetch live database products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/storefront?domain=${encodeURIComponent(domain)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.products) {
          setItems(
            data.products.map((p: any) => ({
              id: p.id,
              title: p.title,
              category: p.category || 'LUXURY',
              price: p.price,
              imageUrl: p.imageUrl,
              affiliateUrl: p.affiliateUrl,
              clicks: p._count?.clicks || 0,
            }))
          );
        }
      }
    } catch (err) {
      console.error('Failed to load items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [domain]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = () => {
    const storefrontUrl = `https://${domain}.luxury-saas-engine.vercel.app`;
    navigator.clipboard.writeText(storefrontUrl);
    showNotification('Bio Link Copied to Clipboard! 📋');
  };

  const handleExportCSV = () => {
    const headers = 'Item Title,Category,Price,Image URL,Affiliate URL,Outbound Clicks\n';
    const rows = items
      .map((i) => `"${i.title}","${i.category}",${i.price},"${i.imageUrl}","${i.affiliateUrl}",${i.clicks || 0}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${domain}-telemetry-export.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification('Raw CSV Exported Successfully!');
  };

  // Fixed deletion logic connected directly to Database Server Action
  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this piece from your database?')) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('tenantSubdomain', domain);

      const res = await deleteProduct(formData);
      if (res.success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        showNotification('Item Removed from Database & Lookbook.');
      } else {
        showNotification(res.error || 'Failed to delete product');
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-200 relative selection:bg-amber-400 selection:text-slate-950">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-amber-400 text-slate-950 font-semibold text-xs px-4 py-3 rounded-lg shadow-2xl border border-amber-300"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_#f59e0b]" />
              <h1 className="font-serif text-2xl text-white font-normal tracking-wide">
                {domain.toUpperCase()} PIPELINE
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-light">
              Autonomous Luxury SaaS & Telemetry Operations
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-3">
            <button
              onClick={handleCopyLink}
              className="text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-amber-400 border border-white/10 hover:border-amber-500/40 px-4 py-2 rounded-lg bg-slate-900/80 transition-all duration-300 cursor-pointer"
            >
              Copy Bio Link 📋
            </button>
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
              className="text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-lg transition-colors duration-300 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            >
              + Add New Item
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex gap-8 border-t border-white/5 text-xs font-medium uppercase tracking-widest text-slate-400">
          {(['overview', 'catalog', 'analytics'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3.5 relative transition-colors cursor-pointer ${
                activeTab === tab ? 'text-amber-400 font-semibold' : 'hover:text-slate-200'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400 shadow-[0_0_8px_#f59e0b]"
                />
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                label="Outbound Clicks"
                value={items.reduce((acc, curr) => acc + (curr.clicks || 0), 0).toLocaleString()}
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

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-xl text-white font-normal">3D Curated Showcase Preview</h2>
                  <p className="text-xs text-slate-400 font-light">Interactive client perspective rendering</p>
                </div>
              </div>

              {loading ? (
                <p className="text-xs text-slate-500">Loading catalog from database...</p>
              ) : items.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-slate-900/40 border border-white/10 rounded-2xl">
                  No items found in your catalog. Click &quot;+ Add New Item&quot; to list your first piece!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {items.map((item) => (
                    <Luxury3DProductCard key={item.id} {...item} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl text-white font-normal">Lookbook Catalog Management</h2>
                <p className="text-xs text-slate-400">Manage live items displayed on your public storefront</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              >
                + Add New Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="pb-3 font-normal">Piece</th>
                    <th className="pb-3 font-normal">Brand</th>
                    <th className="pb-3 font-normal">Price</th>
                    <th className="pb-3 font-normal">Clicks</th>
                    <th className="pb-3 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.map((item) => (
                    <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 font-serif text-white flex items-center gap-3">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-cover border border-white/10"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-950 border border-white/10 flex items-center justify-center text-[9px] text-slate-600 font-mono">
                            No Img
                          </div>
                        )}
                        {item.title}
                      </td>
                      <td className="py-4 text-xs tracking-widest text-amber-500 font-semibold uppercase">{item.category}</td>
                      <td className="py-4 text-xs font-mono text-slate-300">R {item.price.toLocaleString()}</td>
                      <td className="py-4 font-mono text-sm text-slate-200">{item.clicks || 0}</td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={isPending}
                          className="text-xs text-rose-400 hover:text-rose-300 uppercase font-semibold cursor-pointer disabled:opacity-50"
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

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-serif text-xl text-white font-normal mb-1">
                    Audience & Outbound Click Telemetry
                  </h2>
                  <p className="text-xs text-slate-400">
                    Real-time affiliate routing tracking & engagement trends
                  </p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="text-xs font-semibold uppercase tracking-wider text-amber-400 border border-amber-500/30 hover:bg-amber-400/10 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Export Raw CSV ↗
                </button>
              </div>

              <AnalyticsChart />
            </div>
          </div>
        )}
      </main>

      {/* Supabase-Connected Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-xl text-white font-normal">Add Curated Piece</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form
                action={async (formData) => {
                  startTransition(async () => {
                    const result = await createProduct({ error: undefined }, formData);
                    if (result.error) {
                      showNotification(result.error);
                    } else {
                      setIsModalOpen(false);
                      await fetchProducts(); // Refresh catalog table instantly from DB
                      showNotification('New High-Class Piece Saved to Database!');
                    }
                  });
                }}
                className="space-y-4"
              >
                <input type="hidden" name="subdomain" value={domain} />

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Item Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="e.g. Silk Evening Gown"
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    name="category"
                    required
                    placeholder="e.g. GUCCI"
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Price (ZAR)
                  </label>
                  <input
                    type="text"
                    name="price"
                    required
                    placeholder="e.g. 15500"
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    required
                    placeholder="Paste high-res image link..."
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Affiliate Destination Link
                  </label>
                  <input
                    type="url"
                    name="affiliateUrl"
                    placeholder="https://www.gucci.com"
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
                    disabled={isPending}
                    className="px-4 py-2 text-xs font-semibold uppercase text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isPending ? 'Saving...' : 'Save to Database'}
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