'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type ProductFormState = {
  success?: boolean;
  error?: string;
};

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const subdomain = formData.get('subdomain') as string;
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const priceRaw = formData.get('price') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const affiliateUrl = formData.get('affiliateUrl') as string;

  if (!subdomain || !title || !priceRaw || !imageUrl || !affiliateUrl) {
    return { error: 'All fields are required.' };
  }

  const price = parseFloat(priceRaw);
  if (isNaN(price) || price <= 0) {
    return { error: 'Please enter a valid price.' };
  }

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { subdomain },
      select: { id: true },
    });

    if (!tenant) {
      return { error: `Tenant with subdomain "${subdomain}" not found.` };
    }

    await prisma.product.create({
      data: {
        tenantId: tenant.id,
        title,
        category: category || 'Luxury',
        price,
        imageUrl,
        affiliateUrl,
      },
    });

    revalidatePath(`/tenants/${subdomain}`);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create product.';
    return { error: message };
  }
}