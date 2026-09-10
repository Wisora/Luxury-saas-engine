'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type FormState = {
  success?: boolean;
  error?: string;
};

export async function createOrUpdateTenant(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const subdomain = formData.get('subdomain') as string;
  const name = formData.get('name') as string;
  const primaryColor = formData.get('primaryColor') as string;
  const accentColor = formData.get('accentColor') as string;
  const logoUrl = formData.get('logoUrl') as string;
  const cjPublisherId = formData.get('cjPublisherId') as string;
  const rakutenSiteId = formData.get('rakutenSiteId') as string;

  if (!subdomain || !name) {
    return { error: 'Subdomain and Brand Name are required.' };
  }

  try {
    await prisma.tenant.upsert({
      where: { subdomain },
      update: {
        name,
        primaryColor,
        accentColor,
        logoUrl,
        cjPublisherId,
        rakutenSiteId,
      },
      create: {
        name,
        subdomain,
        primaryColor,
        accentColor,
        logoUrl,
        cjPublisherId,
        rakutenSiteId,
      },
    });

    revalidatePath(`/tenants/${subdomain}`);
    return { success: true };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to save tenant configuration.';
    return { error: errorMessage };
  }
}