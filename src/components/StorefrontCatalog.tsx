'use client';

import { useEffect, useState } from 'react';
import AddItemModal from '@/components/AddItemModal';

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  imageUrl: string;
  affiliateUrl: string;
}

interface TenantData {
  id: string;
  name: string;
  subdomain: string;
  products: Product[];
}

interface StorefrontCatalogProps {
  subdomain: string;
  isOwner?: boolean; // Set to true if viewed from dashboard/owner view
}

export default function StorefrontCatalog({ subdomain, isOwner = false }: StorefrontCatalogProps) {
  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchStorefront = async () => {
    try {
      const res = await fetch(`/api/storefront?domain=${subdomain}`);
      if (!res.ok) throw new Error('Failed to load storefront');
      const data = await res.json();
      setTenant(data);
    } catch (err) {
      console.error('Error fetching storefront catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subdomain) {
      fetchStorefront();
    }
  }, [subdomain]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-amber-400 text-sm">
        <span className="animate-pulse">Loading luxury collection...</span>
      </div>
    );
  }

  const products = tenant?.products || [];

  return (
    <div className="space-y-8">
      {/* Catalog Header & Owner Actions */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h2 className="font-serif text-2xl text-white">
            {tenant?.name || `${subdomain.toUpperCase()} Collection`}
          </h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
            Curated Luxury Portfolio ({products.length} Pieces)
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-lg"
          >
            + Add Piece
          </button>
        )}
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl bg-slate-950/40">
          <p className="text-slate-300 text-sm mb-2">No luxury pieces in this lookbook yet.</p>
          <p className="text-xs text-slate-500 mb-6">Start by adding your first curated item.</p>
          {isOwner && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-lg"
            >
              Add First Piece
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-xl hover:border-amber-400/40 transition-all duration-300 flex flex-col"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/3] w-full bg-slate-950 overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30';
                  }}
                />
                <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-amber-400 text-[10px] uppercase font-semibold px-2.5 py-1 rounded-full border border-white/10">
                  {product.category || 'Luxury'}
                </span>
              </div>

              {/* Product Details */}
              <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-lg text-white group-hover:text-amber-400 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-amber-400/90 font-mono text-sm mt-1">
                    R {Number(product.price).toLocaleString()}
                  </p>
                </div>

                {/* Affiliate / Outbound Action */}
                <a
                  href={`/api/click?productId=${product.id}&tenantId=${tenant?.id}&url=${encodeURIComponent(product.affiliateUrl || '#')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-white/5 hover:bg-amber-400 hover:text-slate-950 text-white border border-white/10 font-semibold text-xs uppercase tracking-wider rounded-lg transition-all text-center block"
                >
                  Acquire Piece →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      <AddItemModal 
        subdomain={subdomain}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchStorefront}
      />
    </div>
  );
}