'use client';

import { use, useState, useEffect } from 'react';
import { useRouter, redirect } from 'next/navigation';
import Image from 'next/image';

// Correct relative path to LanguageSelector
import LanguageSelector, { translations, Language } from '../LanguageSelector';

type Product = {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
  category: string | null;
  affiliateUrl: string | null;
};

type TenantData = {
  id: string;
  name: string;
  accentColor: string | null;
  products: Product[];
};

type Props = {
  params: Promise<{ domain: string }>;
};

export default function TenantPublicPage({ params }: Props) {
  const { domain } = use(params);
  const router = useRouter();

  // Normalize incoming domain string
  const normalizedDomain = (domain || '').toLowerCase().trim();

  // 🔴 PLATFORM GUARD: Check if the request host is the main engine domain
  const isMainEngineDomain =
    normalizedDomain === 'luxuryengine' ||
    normalizedDomain === 'luxuryengine.wisorainnovations.com' ||
    normalizedDomain === 'wisorainnovations.com' ||
    normalizedDomain === 'www';

  // INSTANT SERVER/RENDER REDIRECT: Stop execution immediately if main domain
  if (isMainEngineDomain) {
    redirect('/');
  }

  const [lang, setLang] = useState<Language>('en');
  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch tenant storefront data only if it is a genuine subtenant domain
  useEffect(() => {
    async function fetchStorefront() {
      try {
        const res = await fetch(`/api/storefront?domain=${encodeURIComponent(domain)}`);
        if (res.ok) {
          const data = await res.json();
          setTenant(data);
        }
      } catch (err) {
        console.error('Failed to fetch storefront data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStorefront();
  }, [domain]);

  const t = translations[lang];
  const accentColor = tenant?.accentColor || '#D4AF37';

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 py-12 px-4 sm:px-8 selection:bg-amber-400 selection:text-slate-950">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Navigation with Brand Title & Multilingual Selector */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div className="text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-amber-400 text-[10px] font-semibold tracking-[0.25em] uppercase">
              <span>{t.badge}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-white uppercase">
              {tenant?.name || domain.toUpperCase()}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm font-light tracking-wide leading-relaxed max-w-xl">
              {t.subtitle}
            </p>
          </div>

          {/* Multilingual Selector */}
          <LanguageSelector currentLang={lang} onLanguageChange={setLang} />
        </header>

        <div 
          className="w-16 h-[1px] mx-auto opacity-80" 
          style={{ backgroundColor: accentColor }} 
        />

        {/* Content Section */}
        {loading ? (
          <div className="text-center py-24 space-y-3">
            <div className="inline-block w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 uppercase tracking-widest">Loading Curator Lookbook...</p>
          </div>
        ) : !tenant || tenant.products.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 border border-white/5 rounded-2xl max-w-lg mx-auto backdrop-blur-sm">
            <p className="text-slate-300 font-serif text-lg">{t.emptyTitle}</p>
            <p className="text-xs text-slate-500 mt-1">{t.emptySubtitle}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tenant.products.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-amber-500/40 transition-all duration-500 shadow-2xl hover:-translate-y-1"
              >
                {/* Product Image Box */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
                  <Image
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                  
                  {product.category && (
                    <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-white/10 text-amber-400 text-[10px] font-medium tracking-widest uppercase px-3 py-1 rounded-full shadow-lg">
                      {product.category}
                    </span>
                  )}
                </div>

                {/* Product Info & Action */}
                <div className="flex flex-col flex-1 p-6 justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-normal text-white group-hover:text-amber-200 transition-colors duration-300 line-clamp-1">
                      {product.title}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-amber-400 font-mono text-sm font-semibold">
                      ${Number(product.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>

                    <a
                      href={`/api/click?productId=${product.id}&tenantId=${tenant.id}&url=${encodeURIComponent(product.affiliateUrl || '#')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-amber-400 hover:text-amber-300 uppercase transition-all duration-300 group/btn"
                    >
                      <span>{t.shopBtn}</span>
                      <span className="transform group-hover/btn:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center pt-12 border-t border-white/5 text-[11px] text-slate-500 font-light tracking-widest uppercase">
          {t.powered}
        </footer>
      </div>
    </div>
  );
}