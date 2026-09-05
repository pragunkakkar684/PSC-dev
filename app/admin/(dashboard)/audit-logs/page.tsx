import { db } from '@/lib/db';
import { cmsAuditLogs } from '@/lib/db/schema';
import { requireEditor } from '@/lib/auth/permissions';
import { desc } from 'drizzle-orm';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ShieldCheck, User, Calendar, Terminal } from 'lucide-react';

export const metadata = {
  title: 'CMS Audit Logs',
};

export default async function AuditLogsPage() {
  const user = await requireEditor();

  const logs = await db
    .select()
    .from(cmsAuditLogs)
    .orderBy(desc(cmsAuditLogs.createdAt))
    .limit(50);

  return (
    <div className="admin-content">
      <Breadcrumbs
        items={[
          { label: 'SYSTEM', href: '/admin/settings' },
          { label: 'AUDIT LOGS' },
        ]}
      />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck size={24} className="text-amber-400" />
            CMS Security & Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Read-only immutable activity log recording admin updates, releases, user actions, and system security events.
          </p>
        </div>
      </div>

      <div className="border border-slate-800 bg-[#12131a] rounded-xl overflow-hidden divide-y divide-slate-800">
        <div className="grid grid-cols-12 bg-[#181a24] px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-3">TIMESTAMP & USER</div>
          <div className="col-span-2">ACTION</div>
          <div className="col-span-3">RESOURCE</div>
          <div className="col-span-4">DETAILS</div>
        </div>

        {logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No audit records logged yet. System operations will appear here automatically.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="grid grid-cols-12 items-center px-6 py-3.5 text-xs font-medium text-slate-300 hover:bg-slate-800/40">
              <div className="col-span-3">
                <div className="flex items-center gap-1.5 font-bold text-slate-100">
                  <User size={13} className="text-amber-400 shrink-0" />
                  <span>{log.userName || log.userId}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                  <Calendar size={11} />
                  <span>{new Date(log.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="col-span-2">
                <span className="font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-400">
                  {log.action}
                </span>
              </div>

              <div className="col-span-3 text-slate-200 font-semibold">
                {log.resource} {log.resourceId && `#${log.resourceId}`}
              </div>

              <div className="col-span-4 font-mono text-[11px] text-slate-400 truncate">
                {log.details ? JSON.stringify(log.details) : 'No extra metadata'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
