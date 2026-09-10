'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleAutomation(subdomain: string, currentState: boolean) {
  try {
    const updatedTenant = await prisma.tenant.update({
      where: { subdomain },
      data: {
        // Toggle the automation status field
        isAutomationEnabled: !currentState,
      },
    });

    // Revalidate dashboard and onboarding routes so the UI reflects the change immediately
    revalidatePath(`/tenants/${subdomain}/dashboard`);
    revalidatePath('/onboarding');

    return { success: true, isEnabled: updatedTenant.isAutomationEnabled };
  } catch (error) {
    console.error('Failed to toggle automation state:', error);
    return { success: false, error: 'Could not update automation setting.' };
  }
}