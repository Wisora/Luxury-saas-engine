'use client';

import { useActionState } from 'react';
import { createOrUpdateTenant, type FormState } from '@/app/actions/tenant';
import { createProduct, type ProductFormState } from '@/app/actions/product';

const initialTenantState: FormState = {};
const initialProductState: ProductFormState = {};

export default function OnboardingPage() {
  const [tenantState, tenantAction, tenantPending] = useActionState(
    createOrUpdateTenant,
    initialTenantState
  );

  const [productState, productAction, productPending] = useActionState(
    createProduct,
    initialProductState
  );

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-10">
      {/* SECTION 1: TENANT BRANDING */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Aura Luxury Pipeline Onboarding</h1>
        <p className="text-slate-600 mb-6">
          Configure tenant branding, palette, and network integration.
        </p>

        {tenantState.error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {tenantState.error}
          </div>
        )}
        {tenantState.success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
            Tenant configuration saved successfully!
          </div>
        )}

        <form action={tenantAction} className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-slate-700">Brand Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Aura Velvet Boutique"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Subdomain Slug</label>
            <div className="flex items-center mt-1">
              <input
                type="text"
                name="subdomain"
                required
                placeholder="auravelvet"
                className="block w-full rounded-l-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="inline-flex items-center rounded-r-md border border-l-0 border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                .wisora.com
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Primary Color</label>
              <input
                type="color"
                name="primaryColor"
                defaultValue="#000000"
                className="mt-1 block w-full h-10 rounded-md border border-slate-300 p-1 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Accent Color</label>
              <input
                type="color"
                name="accentColor"
                defaultValue="#D4AF37"
                className="mt-1 block w-full h-10 rounded-md border border-slate-300 p-1 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Logo URL</label>
            <input
              type="url"
              name="logoUrl"
              placeholder="https://images.unsplash.com/photo-..."
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={tenantPending}
            className="w-full bg-slate-900 text-white font-medium py-3 rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            {tenantPending ? 'Saving Configuration...' : 'Save Tenant Pipeline'}
          </button>
        </form>
      </div>

      {/* SECTION 2: ADD PRODUCT TO STORE */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Add Product to Storefront</h2>
        <p className="text-slate-600 mb-6">
          Seed luxury products directly into an existing tenant domain.
        </p>

        {productState.error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {productState.error}
          </div>
        )}
        {productState.success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
            Product published! Check your storefront to see it live.
          </div>
        )}

        <form action={productAction} className="space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-slate-700">Target Tenant Subdomain</label>
            <input
              type="text"
              name="subdomain"
              required
              placeholder="auravelvet"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Product Title</label>
              <input
                type="text"
                name="title"
                required
                placeholder="Velvet Travel Duffel"
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <input
                type="text"
                name="category"
                placeholder="Luggage & Travel"
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Price ($ USD)</label>
            <input
              type="number"
              step="0.01"
              name="price"
              required
              placeholder="350.00"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              required
              placeholder="https://images.unsplash.com/photo-1553062407-98eeb64c6a62"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Affiliate Target URL</label>
            <input
              type="url"
              name="affiliateUrl"
              required
              placeholder="https://merchant.com/affiliate-link"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={productPending}
            className="w-full bg-amber-600 text-white font-medium py-3 rounded-md hover:bg-amber-700 disabled:opacity-50 transition-colors"
          >
            {productPending ? 'Publishing Product...' : 'Publish Product to Store'}
          </button>
        </form>
      </div>
    </div>
  );
}