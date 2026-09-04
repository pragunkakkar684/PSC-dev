import { auth } from '@/auth';
import { db } from '@/lib/db';
import { portalUsers, portalClients } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export interface PortalContext {
  userId: string;
  email: string;
  name: string;
  portalRole: 'PORTAL_ADMIN' | 'CLIENT';
  clientId: number | null;
  client?: {
    id: number;
    companyName: string;
    contactName: string;
    email: string;
  } | null;
}

export async function getPortalContext(): Promise<PortalContext | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = session.user.id;

  // Query portal_users record
  const [pUser] = await db
    .select({
      portalRole: portalUsers.portalRole,
      clientId: portalUsers.clientId,
    })
    .from(portalUsers)
    .where(eq(portalUsers.userId, userId))
    .limit(1);

  let portalRole: 'PORTAL_ADMIN' | 'CLIENT' = (pUser?.portalRole as 'PORTAL_ADMIN' | 'CLIENT') || 'CLIENT';
  let clientId: number | null = pUser?.clientId ?? null;

  const mainRole = (session.user as any).role;
  if (!pUser && (mainRole === 'admin' || mainRole === 'editor' || mainRole === 'superadmin')) {
    portalRole = 'PORTAL_ADMIN';
  }

  let clientData = null;
  if (clientId) {
    const [c] = await db
      .select({
        id: portalClients.id,
        companyName: portalClients.companyName,
        contactName: portalClients.contactName,
        email: portalClients.email,
      })
      .from(portalClients)
      .where(eq(portalClients.id, clientId))
      .limit(1);
    clientData = c || null;
  }

  return {
    userId,
    email: session.user.email || '',
    name: session.user.name || '',
    portalRole,
    clientId,
    client: clientData,
  };
}

export async function requirePortalClient(): Promise<PortalContext> {
  const ctx = await getPortalContext();
  if (!ctx) {
    throw new Error('UNAUTHORIZED: Authentication required.');
  }
  return ctx;
}

export async function requirePortalAdmin(): Promise<PortalContext> {
  const ctx = await getPortalContext();
  if (!ctx || ctx.portalRole !== 'PORTAL_ADMIN') {
    throw new Error('FORBIDDEN: Portal Admin privileges required.');
  }
  return ctx;
}
