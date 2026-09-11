'use client';

import { useState } from 'react';
import { updateProduct } from '@/app/actions/product';

interface ProductProps {
  id: string;
  title: string;
  price: number;
  category: string;
  affiliateUrl: string;
  tenantSubdomain: string;
}

export default function EditProductModal({ product }: { product: ProductProps }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    const result = await updateProduct(formData);

    setIsSubmitting(false);
    if (result.success) {
      setIsOpen(false);
    } else {
      alert(result.error);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1 text-sm bg-slate-800 text-white rounded hover:bg-slate-700 transition"
      >
        Edit Product
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg max-w-md w-full border border-slate-700">
            <h2 className="text-xl font-bold mb-4 text-white">Edit Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="id" value={product.id} />
              <input type="hidden" name="tenantSubdomain" value={product.tenantSubdomain} />

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400">Product Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={product.title}
                  className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700 mt-1"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  defaultValue={product.price}
                  className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700 mt-1"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400">Category</label>
                <input
                  type="text"
                  name="category"
                  defaultValue={product.category}
                  className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700 mt-1"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400">Affiliate Link</label>
                <input
                  type="url"
                  name="affiliateUrl"
                  defaultValue={product.affiliateUrl}
                  className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700 mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}