'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { deleteProduct } from '@/app/actions/product';

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
  category: string | null;
}

interface AdminCatalogGridProps {
  products: Product[];
  subdomain: string;
}

export default function AdminCatalogGrid({ products, subdomain }: AdminCatalogGridProps) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this piece from your catalog?')) return;

    setDeletingId(id);
    const formData = new FormData();
    formData.append('id', id);
    formData.append('tenantSubdomain', subdomain);

    startTransition(async () => {
      const res = await deleteProduct(formData);
      if (res.success) {
        // Page revalidation from the server action will automatically refresh the list
      } else {
        alert(res.error || 'Failed to delete product');
      }
      setDeletingId(null);
    });
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-900 border border-white/10 rounded-2xl">
        <p className="text-slate-400 text-sm">No items in your catalog yet. Click &quot;Add Piece&quot; above to list your first item.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((item) => (
        <div key={item.id} className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between">
          <div>
            <div className="relative h-48 w-full bg-slate-950">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-600 text-xs">No Image</div>
              )}
            </div>
            
            <div className="p-4">
              <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest">{item.category || 'Luxury'}</span>
              <h3 className="text-base font-serif text-white mt-1">{item.title}</h3>
              <p className="text-white font-bold mt-1">R {item.price.toLocaleString()}</p>
            </div>
          </div>

          <div className="p-4 pt-0">
            <button
              onClick={() => handleDelete(item.id)}
              disabled={isPending && deletingId === item.id}
              className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors disabled:opacity-50"
            >
              {deletingId === item.id ? 'Deleting...' : 'Delete Piece'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}