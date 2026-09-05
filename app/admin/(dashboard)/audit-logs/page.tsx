import { db } from '@/lib/db';
import { cmsAuditLogs } from '@/lib/db/schema';
import { requireEditor } from '@/lib/auth/permissions';
import { desc } from 'drizzle-orm';
import { AdminHeader } from '../components/AdminHeader';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { PageHeader } from '../components/PageHeader';
import { User, Calendar } from 'lucide-react';

export const metadata = {
  title: 'CMS Audit Logs',
};

export default async function AuditLogsPage() {
  await requireEditor();

  const logs = await db
    .select()
    .from(cmsAuditLogs)
    .orderBy(desc(cmsAuditLogs.createdAt))
    .limit(50);

  return (
    <>
      <AdminHeader title="Audit Logs" />
      <div className="admin-content">
        <Breadcrumbs items={[{ label: 'SYSTEM', href: '/admin/settings' }, { label: 'AUDIT LOGS' }]} />
        <PageHeader
          title="CMS Security & Audit Trail"
          description="Read-only immutable activity log recording admin updates, releases, user actions, and system security events."
        />
        <div className="audit-log-table">
        <div className="audit-log-head">
          <div className="col-span-3">TIMESTAMP & USER</div>
          <div className="col-span-2">ACTION</div>
          <div className="col-span-3">RESOURCE</div>
          <div className="col-span-4">DETAILS</div>
        </div>

        {logs.length === 0 ? (
          <div className="audit-log-empty">
            No audit records logged yet. System operations will appear here automatically.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="audit-log-row">
              <div className="col-span-3">
                <div className="audit-log-user">
                  <User size={13} />
                  <span>{log.userName || log.userId}</span>
                </div>
                <div className="audit-log-time">
                  <Calendar size={11} />
                  <span>{new Date(log.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="col-span-2">
                <span className="audit-log-action">
                  {log.action}
                </span>
              </div>

              <div className="col-span-3 audit-log-resource">
                {log.resource} {log.resourceId && `#${log.resourceId}`}
              </div>

              <div className="col-span-4 audit-log-details">
                {log.details ? JSON.stringify(log.details) : 'No extra metadata'}
              </div>
            </div>
          ))
        )}
      </div>
      </div>
    </>
  );
}
