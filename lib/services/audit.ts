/**
 * PSC Global — CMS Audit Logging Service
 * Records administrative events, user mutations, content releases, and system updates.
 */
import 'server-only';
import { db } from '@/lib/db';
import { cmsAuditLogs } from '@/lib/db/schema';
import { getCurrentUser } from '@/lib/auth/permissions';

export interface AuditLogParams {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'LOGIN' | 'LOGOUT' | 'SETTINGS_CHANGE';
  resource: string; // e.g. "Event", "PracticeArea", "InsightArticle", "HeroSection"
  resourceId?: string | number | null;
  details?: Record<string, any> | null;
  ipAddress?: string | null;
}

export async function recordAuditLog(params: AuditLogParams): Promise<void> {
  try {
    const user = await getCurrentUser();

    await db.insert(cmsAuditLogs).values({
      userId: user?.id || 'system',
      userName: user?.name || user?.email || 'Anonymous/System',
      userRole: user?.role || 'editor',
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId ? String(params.resourceId) : null,
      details: params.details || null,
      ipAddress: params.ipAddress || null,
    });
  } catch (err) {
    // Fail silently in production logging so content actions are not blocked
    console.error('Failed to record audit log:', err);
  }
}
