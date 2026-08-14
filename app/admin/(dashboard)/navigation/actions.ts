'use server';

import { db } from '@/lib/db';
import { navItems } from '@/lib/db/schema';
import { requireEditor } from '@/lib/auth/permissions';
import { navItemSchema } from '@/lib/validation/cms';
import { eq, and, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getNavItems(menuKey?: string) {
  await requireEditor();

  const conditions = [];

  if (menuKey && menuKey !== 'all') {
    conditions.push(eq(navItems.menuKey, menuKey));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(navItems)
    .where(whereClause)
    .orderBy(asc(navItems.sortOrder), asc(navItems.id));
}

export async function getNavItemById(id: number) {
  await requireEditor();

  const [item] = await db.select().from(navItems).where(eq(navItems.id, id)).limit(1);
  return item || null;
}

export async function createNavItemAction(data: any) {
  await requireEditor();

  const parsed = navItemSchema.parse(data);

  const [created] = await db
    .insert(navItems)
    .values(parsed)
    .returning();

  revalidatePath('/admin/navigation');
  return created;
}

export async function updateNavItemAction(id: number, data: any) {
  await requireEditor();

  const parsed = navItemSchema.parse(data);

  const [updated] = await db
    .update(navItems)
    .set(parsed)
    .where(eq(navItems.id, id))
    .returning();

  revalidatePath('/admin/navigation');
  return updated;
}

export async function deleteNavItemAction(id: number) {
  await requireEditor();

  await db.delete(navItems).where(eq(navItems.id, id));
  revalidatePath('/admin/navigation');
  return { success: true };
}

export async function toggleNavItemActiveAction(id: number, isActive: boolean) {
  await requireEditor();

  await db
    .update(navItems)
    .set({ isActive })
    .where(eq(navItems.id, id));

  revalidatePath('/admin/navigation');
  return { success: true };
}
