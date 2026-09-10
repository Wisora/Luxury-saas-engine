'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type AutomationFormState = {
  error?: string;
  success?: boolean;
  isEnabled?: boolean;
};

export async function toggleAutomation(
  prevState: AutomationFormState,
  formData: FormData
): Promise<AutomationFormState> {
  const subdomain = formData.get('subdomain') as string;
  const currentStateStr = formData.get('currentState') as string;

  if (!subdomain) {
    return { error: 'Subdomain is required.' };
  }

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { subdomain },
      select: { id: true, isAutomationEnabled: true },
    });

    if (!tenant) {
      return { error: `Tenant "${subdomain}" not found.` };
    }

    // Determine target boolean value
    const targetState = currentStateStr !== null ? currentStateStr !== 'true' : !tenant.isAutomationEnabled;

    const updated = await prisma.tenant.update({
      where: { id: tenant.id },
      data: { isAutomationEnabled: targetState },
    });

    // Invalidate caches
    revalidatePath('/', 'layout');

    return {
      success: true,
      isEnabled: updated.isAutomationEnabled,
    };
  } catch (err: unknown) {
    console.error('Automation toggle error:', err);
    return { error: 'Failed to update automation state.' };
  }
}