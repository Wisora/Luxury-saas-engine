import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ domain: string }>;
};

// Next.js 15 Edge Caching: Revalidate static route cache every 1 hour (3600 seconds)
export const revalidate = 3600;

// Dynamic SEO & OpenGraph Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain } = await params;

  const tenant = await prisma.tenant.findFirst({
    where: {
      OR: [{ subdomain: domain }, { customDomain: domain }],
    },
    select: { name: true },
  });

  if (!tenant) {
    return {
      title: 'Storefront Not Found | Aura Orchestrator',
    };
  }

  return {
    title: `${tenant.name} | Curated Lookbook`,
    description: `Explore exclusive personal recommendations, essential wardrobe staples, and luxury finds from ${tenant.name}.`,
    openGraph: {
      title: `${tenant.name} — Curated Lookbook`,
      description: `Discover luxury items and curated collections on ${tenant.name}.`,
      type: 'website',
    },
  };
}

export default async function TenantPublicPage({ params }: Props) {
  const { domain } = await params;

  // Prisma query with cache tagging strategy
  const tenant = await prisma.tenant.findFirst({
    where: {
      OR: [{ subdomain: domain }, { customDomain: domain }],
    },
    include: {
      products: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!tenant) {
    notFound();
  }

  const accentColor = tenant.accentColor || '#D4AF37';

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 py-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Editorial Header Section */}
        <header className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-amber-400 text-[10px] font-semibold tracking-[0.25em] uppercase">
            <span>Curated Lookbook</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-normal tracking-tight text-white">
            {tenant.name.toUpperCase()}
          </h1>

          <p className="text-slate-400 text-sm font-light tracking-wide leading-relaxed">
            An exclusive selection of personal recommendations, essential wardrobe staples, and luxury finds.
          </p>

          <div 
            className="w-12 h-[1px] mx-auto mt-6" 
            style={{ backgroundColor: accentColor }} 
          />
        </header>

        {/* Product Catalog Grid */}
        {tenant.products.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 border border-white/5 rounded-2xl max-w-lg mx-auto">
            <p className="text-slate-400 font-serif text-lg">No curated items available yet.</p>
            <p className="text-xs text-slate-600 mt-1">Check back soon for new additions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tenant.products.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-amber-500/40 transition-all duration-500 shadow-2xl"
              >
                {/* 3:4 Portrait Image Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
                  <Image
                    src={product.imageUrl || '/placeholder.jpg'}
                    alt={product.title}
                    fill
                    priority={false}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                  {/* Category Pill */}
                  {product.category && (
                    <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-white/10 text-amber-400 text-[10px] font-medium tracking-widest uppercase px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                  )}
                </div>

                {/* Details Footer */}
                <div className="flex flex-col flex-1 p-6 justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-2xl font-normal text-white group-hover:text-amber-200 transition-colors duration-300 line-clamp-1">
                      {product.title}
                    </h3>
                  </div>

                  {/* Price & Telemetry Action Link */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-slate-300 font-mono text-sm">
                      ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                    </span>

                    {/* Outbound Telemetry Link pointing to /api/click */}
                    <a
                      href={`/api/click?productId=${product.id}&tenantId=${tenant.id}&url=${encodeURIComponent(product.affiliateUrl || '#')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-amber-400 hover:text-amber-300 uppercase transition-all duration-300 group/btn"
                    >
                      <span>Shop Feature</span>
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

        {/* Brand Footer Signature */}
        <footer className="text-center pt-12 border-t border-white/5 text-xs text-slate-600 font-light tracking-widest uppercase">
          Powered by Aura Luxury Pipeline
        </footer>

      </div>
    </div>
  );
}