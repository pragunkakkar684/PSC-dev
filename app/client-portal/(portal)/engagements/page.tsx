import { db } from '@/lib/db';
import { portalEngagements } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getPortalContext } from '@/lib/auth/portalAuth';
import { Handshake, Plus, Clock, CheckCircle2 } from 'lucide-react';
import { clientRequestEngagementAction } from '@/app/actions/clientPortalActions';

export default async function ClientEngagementsPage() {
  const portalCtx = await getPortalContext();
  const clientId = portalCtx?.clientId;

  const engagements = clientId
    ? await db
        .select()
        .from(portalEngagements)
        .where(eq(portalEngagements.clientId, clientId))
        .orderBy(portalEngagements.createdAt)
    : [];

  const pendingEngagements = engagements.filter((e) => e.status === 'PENDING_APPROVAL');
  const activeEngagements = engagements.filter((e) => e.status !== 'PENDING_APPROVAL');

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-5xl tracking-tight text-ink">My Engagements</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
          Overview of all active, pending, and completed advisory engagements between your organization and PSC Global.
        </p>
      </div>

      {/* Request New Engagement Form */}
      <div className="border border-slate-200 bg-white p-8">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center bg-navy text-white">
            <Handshake size={20} />
          </div>
          <div>
            <h2 className="font-serif text-2xl text-ink">Request New Advisory Engagement</h2>
            <p className="text-xs text-slate-500">
              Submit details for a new consulting, tax, or audit engagement for admin approval.
            </p>
          </div>
        </div>

        <form action={clientRequestEngagementAction} className="mt-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-600">
                ENGAGEMENT TITLE *
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Q4 International Tax Structuring & Audit"
                className="mt-2 w-full border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-ink outline-none focus:border-ink focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-600">
                SERVICE CATEGORY *
              </label>
              <select
                name="serviceCategory"
                required
                className="mt-2 w-full border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-ink outline-none focus:border-ink focus:bg-white"
              >
                <option value="Tax & Fiscal Advisory">Tax & Fiscal Advisory</option>
                <option value="Risk & Assurance Audit">Risk & Assurance Audit</option>
                <option value="Corporate Law & Legal">Corporate Law & Legal</option>
                <option value="ESG & Regulatory Compliance">ESG & Regulatory Compliance</option>
                <option value="Global Expansion & GCC">Global Expansion & CC Capital</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-wider text-slate-600">
              SCOPE & OBJECTIVES
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Describe the scope, objectives, and specific deliverables required..."
              className="mt-2 w-full border border-slate-200 bg-slate-50/50 p-4 text-sm text-ink outline-none focus:border-ink focus:bg-white"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-600">
                DESIRED START DATE
              </label>
              <input
                type="date"
                name="startDate"
                className="mt-2 w-full border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-ink outline-none focus:border-ink focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-600">
                TARGET COMPLETION DATE
              </label>
              <input
                type="date"
                name="endDate"
                className="mt-2 w-full border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-ink outline-none focus:border-ink focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-navy px-8 py-3 text-xs font-bold tracking-wider text-white transition hover:bg-slate-800"
          >
            <Plus size={16} /> SUBMIT ENGAGEMENT REQUEST
          </button>
        </form>
      </div>

      {/* Pending Engagements Requests */}
      {pendingEngagements.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="text-amber-600" size={18} />
            <h2 className="font-serif text-2xl text-ink">Pending Admin Approval ({pendingEngagements.length})</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {pendingEngagements.map((e) => (
              <div key={e.id} className="border border-amber-200 bg-amber-50/40 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wide text-amber-700">
                    {e.serviceCategory || 'ADVISORY'}
                  </span>
                  <span className="bg-amber-100 px-3 py-1 text-[10px] font-bold text-amber-800">
                    PENDING APPROVAL
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-xl text-ink">{e.title}</h3>
                {e.description && <p className="mt-2 text-xs leading-relaxed text-slate-600">{e.description}</p>}
                <div className="mt-4 flex items-center justify-between border-t border-amber-100 pt-3 text-xs text-slate-500">
                  <span>Requested Start: {e.startDate || 'N/A'}</span>
                  <span>Target: {e.endDate || 'TBD'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active & Approved Engagements */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl text-ink">Active & Completed Engagements ({activeEngagements.length})</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {activeEngagements.length === 0 ? (
            <div className="col-span-2 border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
              No active engagements currently active for your organization.
            </div>
          ) : (
            activeEngagements.map((e) => (
              <div key={e.id} className="border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wide text-slate-400">
                    {e.serviceCategory || 'ADVISORY'}
                  </span>
                  <span className="bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700">
                    {e.status}
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-2xl text-ink">{e.title}</h3>
                {e.description && <p className="mt-2 text-xs leading-relaxed text-slate-600">{e.description}</p>}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <span>Start Date: {e.startDate || 'N/A'}</span>
                  <span>End Date: {e.endDate || 'Ongoing'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
