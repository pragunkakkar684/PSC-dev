/**
 * PSC Global CMS — Permission Helpers
 *
 * Centralised authorization functions for use in:
 *   - Server Components (async functions)
 *   - Server Actions
 *   - Route Handlers
 *
 * NEVER import this into Client Components.
 */
import 'server-only';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export type CmsRole = 'admin' | 'editor';

export interface CmsUser {
  id: string;
  name: string | null | undefined;
  email: string | null | undefined;
  role: CmsRole;
}

/**
 * Returns the current session user, or null if not authenticated.
 * Does NOT throw or redirect.
 */
export async function getCurrentUser(): Promise<CmsUser | null> {
  const session = await auth();
  if (!session?.user) return null;
  const user = session.user as { id?: string; name?: string; email?: string; role?: string };
  if (!user.id || !user.email) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: (user.role as CmsRole) ?? 'editor',
  };
}

/**
 * Requires the user to be authenticated.
 * Redirects to /admin/login if not.
 */
export async function requireAuth(): Promise<CmsUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  return user;
}

/**
 * Requires the user to be an admin.
 * Redirects unauthenticated users to login, unauthorized to dashboard.
 */
export async function requireAdmin(): Promise<CmsUser> {
  const user = await requireAuth();
  if (user.role !== 'admin') {
    redirect('/admin?error=unauthorized');
  }
  return user;
}

/**
 * Requires the user to be an admin or editor.
 * (Currently all authenticated users are at least editors.)
 */
export async function requireEditor(): Promise<CmsUser> {
  return requireAuth();
}

/**
 * Checks if the current user has admin role.
 * Returns boolean — useful for conditional UI rendering on the server.
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin';
}

/**
 * Validates a role string against allowed roles.
 */
export function isValidRole(role: unknown): role is CmsRole {
  return role === 'admin' || role === 'editor';
}
