'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type ProductFormState = {
  error?: string;
  success?: boolean;
};

// 1. Action used by /onboarding to create/seed new products
export async function createProduct(
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const subdomain = formData.get('subdomain') as string;
  const title = formData.get('title') as string;
  const category = (formData.get('category') as string) || 'General';
  const price = parseFloat(formData.get('price') as string);
  const imageUrl = formData.get('imageUrl') as string;
  const affiliateUrl = formData.get('affiliateUrl') as string;

  if (!subdomain || !title || isNaN(price) || !imageUrl || !affiliateUrl) {
    return { error: 'Please fill out all required product fields.' };
  }

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { subdomain },
    });

    if (!tenant) {
      return { error: `Tenant with subdomain "${subdomain}" not found.` };
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

    revalidatePath(`/tenants/${subdomain}`);
    revalidatePath(`/tenants/${subdomain}/dashboard`);

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
  const price = parseFloat(formData.get('price') as string);
  const category = formData.get('category') as string;
  const affiliateUrl = formData.get('affiliateUrl') as string;
  const tenantSubdomain = formData.get('tenantSubdomain') as string;

  if (!id || !title || isNaN(price)) {
    return { success: false, error: 'Missing required fields' };
  }

  try {
    await prisma.product.update({
      where: { id },
      data: {
        title,
        price,
        category,
        affiliateUrl,
      },
    });

    revalidatePath(`/tenants/${tenantSubdomain}/dashboard`);
    revalidatePath(`/tenants/${tenantSubdomain}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to update product:', error);
    return { success: false, error: 'Failed to update product' };
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
    await prisma.click.deleteMany({
      where: { productId: id },
    });

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath(`/tenants/${tenantSubdomain}/dashboard`);
    revalidatePath(`/tenants/${tenantSubdomain}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to delete product:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}