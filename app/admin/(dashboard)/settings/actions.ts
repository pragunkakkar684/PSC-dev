'use server';

import { db } from '@/lib/db';
import { siteSettings } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth/permissions';
import { siteSettingsSchema } from '@/lib/validation/cms';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getSiteSettings() {
  await requireAdmin();

  const [settings] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);

  if (!settings) {
    // Seed default settings row if missing
    const [inserted] = await db
      .insert(siteSettings)
      .values({
        id: 1,
        siteName: 'PSC Global',
        tagline: 'Strategic Corporate Advisory & Global Compliance Excellence',
        footerDescription: 'PSC Global provides trusted cross-border advisory, tax policy, risk governance, and legal strategic counsel.',
        copyrightText: `© ${new Date().getFullYear()} PSC Global. All rights reserved.`,
        contactEmailGeneral: 'contact@pscglobal.com',
        updatedAt: new Date(),
      })
      .returning();
    return inserted;
  }

  return settings;
}

export async function updateSiteSettingsAction(data: any) {
  // STRICT SECURITY: Only admin role can modify site settings!
  await requireAdmin();

  const parsed = siteSettingsSchema.parse(data);

  const [existing] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);

  let updated;
  if (existing) {
    [updated] = await db
      .update(siteSettings)
      .set({
        ...parsed,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.id, 1))
      .returning();
  } else {
    [updated] = await db
      .insert(siteSettings)
      .values({
        id: 1,
        ...parsed,
        updatedAt: new Date(),
      })
      .returning();
  }

  revalidatePath('/admin/settings');
  return updated;
}
