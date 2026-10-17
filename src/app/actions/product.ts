'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath, updateTag } from 'next/cache';

export type ProductFormState = {
  error?: string;
  success?: boolean;
};

// Helper to sanitize incoming domain/subdomain strings
function sanitizeSubdomain(raw: string): string {
  if (!raw) return 'demo';
  const decoded = decodeURIComponent(raw);
  // Strips port numbers, localhost, and top-level domain suffixes (e.g. curator.localhost:3000 -> curator)
  return decoded.split('.')[0].split(':')[0].toLowerCase();
}

// Helper to handle immediate cache invalidation safely
function clearTenantCache(rawSubdomain: string) {
  const subdomain = sanitizeSubdomain(rawSubdomain);
  if (!subdomain) return;

  // 1. Revalidate path-based route caches
  revalidatePath(`/tenants/${subdomain}`);
  revalidatePath(`/tenants/${subdomain}/dashboard`);
  revalidatePath('/');

  // 2. Immediate tag expiration for Server Actions
  try {
    updateTag(`tenant-${subdomain}`);
  } catch {
    // Fallback if tag is not active
  }
}

// 1. Action used to create/seed new products (Onboarding & Dashboard Modal)
export async function createProduct(
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const rawSubdomain = (formData.get('subdomain') as string) || 'demo';
  const subdomain = sanitizeSubdomain(rawSubdomain);
  
  const title = formData.get('title') as string;
  const category = (formData.get('category') as string) || 'General';
  const rawPrice = formData.get('price') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const affiliateUrl = (formData.get('affiliateUrl') as string) || '#';

  // Clean price string (handles inputs like "R 15,500" or "$15500")
  const price = parseFloat(rawPrice?.replace(/[^\d.]/g, '') || '0');

  if (!title || isNaN(price) || price <= 0 || !imageUrl) {
    return { error: 'Please provide a valid title, price, and image.' };
  }

  try {
    // Find existing tenant by clean subdomain OR create fallback
    let tenant = await prisma.tenant.findFirst({
      where: {
        OR: [
          { subdomain: subdomain },
          { subdomain: rawSubdomain },
          { customDomain: rawSubdomain },
        ],
      },
    });

    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          subdomain: subdomain,
          name: `${subdomain.toUpperCase()} Storefront`,
        },
      });
    }

    // Insert Product into Supabase PostgreSQL
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

    // Clear Edge & Path Caches instantly
    clearTenantCache(subdomain);

    return { success: true };
  } catch (error: unknown) {
    console.error('Failed to create product:', error);
    const errorMessage = error instanceof Error ? error.message : 'Database error occurred while creating product.';
    return { error: errorMessage };
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
  } catch (error: unknown) {
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
  } catch (error: unknown) {
    console.error('Failed to delete product:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}
