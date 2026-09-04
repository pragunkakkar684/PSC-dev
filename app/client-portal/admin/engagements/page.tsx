import { db } from '@/lib/db';
import { portalEngagements, portalClients } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { approveEngagementAction } from '@/app/actions/portalAdminActions';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export default async function AdminEngagementsPage() {
  const engagements = await db
    .select({
      id: portalEngagements.id,
      title: portalEngagements.title,
      serviceCategory: portalEngagements.serviceCategory,
      description: portalEngagements.description,
      status: portalEngagements.status,
      startDate: portalEngagements.startDate,
      endDate: portalEngagements.endDate,
      companyName: portalClients.companyName,
    })
    .from(portalEngagements)
    .innerJoin(portalClients, eq(portalEngagements.clientId, portalClients.id))
    .orderBy(portalEngagements.createdAt);

  const pendingRequests = engagements.filter((e) => e.status === 'PENDING_APPROVAL');
  const activeEngagements = engagements.filter((e) => e.status !== 'PENDING_APPROVAL');

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-4xl tracking-tight text-ink">Client Engagements</h1>
        <p className="mt-2 text-sm text-slate-600">
          Review, approve, and manage advisory engagements across all client accounts.
        </p>
      </div>

      {/* Pending Client Engagement Requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="text-amber-600" size={20} />
            <h2 className="font-serif text-2xl text-ink">Pending Client Requests ({pendingRequests.length})</h2>
          </div>
          <div className="border border-amber-200 bg-amber-50/30">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-amber-200 bg-amber-100/50 text-[10px] font-bold text-amber-800">
                  <th className="px-6 py-4">CLIENT COMPANY</th>
                  <th className="px-6 py-4">REQUESTED ENGAGEMENT</th>
                  <th className="px-6 py-4">CATEGORY</th>
                  <th className="px-6 py-4">TARGET DATES</th>
                  <th className="px-6 py-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((e) => (
                  <tr key={e.id} className="border-b border-amber-100 last:border-b-0">
                    <td className="px-6 py-5 font-semibold text-ink">{e.companyName}</td>
                    <td className="px-6 py-5 font-medium text-slate-800">
                      <div>{e.title}</div>
                      {e.description && (
                        <p className="mt-1 text-xs text-slate-600 line-clamp-2">{e.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-5 text-slate-600">{e.serviceCategory || 'Advisory'}</td>
                    <td className="px-6 py-5 text-xs text-slate-600">
                      {e.startDate || 'TBD'} to {e.endDate || 'TBD'}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <form
                          action={async () => {
                            'use server';
                            await approveEngagementAction(e.id, 'ACTIVE');
                          }}
                        >
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                          >
                            <CheckCircle2 size={13} /> APPROVE
                          </button>
                        </form>
                        <form
                          action={async () => {
                            'use server';
                            await approveEngagementAction(e.id, 'REJECTED');
                          }}
                        >
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                          >
                            <XCircle size={13} /> REJECT
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Active & Approved Engagements */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl text-ink">Active & Completed Engagements ({activeEngagements.length})</h2>
        <div className="border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500">
                <th className="px-6 py-4">CLIENT COMPANY</th>
                <th className="px-6 py-4">ENGAGEMENT TITLE</th>
                <th className="px-6 py-4">CATEGORY</th>
                <th className="px-6 py-4">START DATE</th>
                <th className="px-6 py-4">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {activeEngagements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-500">
                    No active engagements found.
                  </td>
                </tr>
              ) : (
                activeEngagements.map((e) => (
                  <tr key={e.id} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-6 py-5 font-semibold text-ink">{e.companyName}</td>
                    <td className="px-6 py-5 font-medium text-slate-800">{e.title}</td>
                    <td className="px-6 py-5 text-slate-600">{e.serviceCategory || 'Advisory'}</td>
                    <td className="px-6 py-5 text-slate-600">{e.startDate || 'N/A'}</td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 text-[10px] font-bold ${
                          e.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
