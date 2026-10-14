'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath, updateTag } from 'next/cache';

export type ProductFormState = {
  error?: string;
  success?: boolean;
};

// Helper to handle Next.js 15 cache invalidation across tags and paths
function clearTenantCache(subdomain: string) {
  if (!subdomain) return;

  // 1. Revalidate path-based route caches
  revalidatePath(`/tenants/${subdomain}`);
  revalidatePath(`/tenants/${subdomain}/dashboard`);

  // 2. Immediate read-your-own-writes cache tag invalidation (Next.js 15)
  try {
    updateTag(`tenant-${subdomain}`);
  } catch {
    // Graceful fallback for non-tagged data caches
  }
}

// 1. Action used to create/seed new products (Onboarding & Dashboard Modal)
export async function createProduct(
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const subdomain = (formData.get('subdomain') as string) || 'demo';
  const title = formData.get('title') as string;
  const category = (formData.get('category') as string) || 'General';
  const rawPrice = formData.get('price') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const affiliateUrl = (formData.get('affiliateUrl') as string) || '#';

  // Clean price string (handles inputs like "R 15,500" or "15500")
  const price = parseFloat(rawPrice?.replace(/[^\d.]/g, '') || '0');

  if (!subdomain || !title || isNaN(price) || price <= 0 || !imageUrl) {
    return { error: 'Please provide a valid title, price, image URL, and subdomain.' };
  }

  try {
    // Find existing tenant or auto-create tenant record in Supabase
    let tenant = await prisma.tenant.findUnique({
      where: { subdomain },
    });

    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          subdomain,
          name: `${subdomain.toUpperCase()} Storefront`,
        },
      });
    }

    await prisma.product.create({
      data: {
        tenantId: tenant.id,
        title,
        category,
        price,
        imageUrl,
        affiliateUrl,
      },
    });

    // Clear Edge & Path Caches
    clearTenantCache(subdomain);

    return { success: true };
  } catch (error) {
    console.error('Failed to create product:', error);
    return { error: 'Database error occurred while creating the product.' };
  }
}

// 2. Action used by dashboard modal to update existing products
export async function updateProduct(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const rawPrice = formData.get('price') as string;
  const category = formData.get('category') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const affiliateUrl = formData.get('affiliateUrl') as string;
  const tenantSubdomain = formData.get('tenantSubdomain') as string;

  const price = parseFloat(rawPrice?.replace(/[^\d.]/g, '') || '0');

  if (!id || !title || isNaN(price)) {
    return { success: false, error: 'Missing required fields or invalid price.' };
  }

  try {
    await prisma.product.update({
      where: { id },
      data: {
        title,
        price,
        category,
        ...(imageUrl && { imageUrl }),
        affiliateUrl,
      },
    });

    clearTenantCache(tenantSubdomain);

    return { success: true };
  } catch (error) {
    console.error('Failed to update product:', error);
    return { success: false, error: 'Failed to update product in database.' };
  }
}

// 3. Action used by dashboard to delete products
export async function deleteProduct(formData: FormData) {
  const id = formData.get('id') as string;
  const tenantSubdomain = formData.get('tenantSubdomain') as string;

  if (!id) {
    return { success: false, error: 'Product ID is required' };
  }

  try {
    // Delete associated clicks telemetry first to prevent foreign key constraints
    await prisma.click.deleteMany({
      where: { productId: id },
    });

    await prisma.product.delete({
      where: { id },
    });

    clearTenantCache(tenantSubdomain);

    return { success: true };
  } catch (error) {
    console.error('Failed to delete product:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}