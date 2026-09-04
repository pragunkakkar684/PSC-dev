import { db } from '@/lib/db';
import { portalEngagements } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getPortalContext } from '@/lib/auth/portalAuth';

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

  return (
    <>
      <h1 className="font-serif text-5xl tracking-tight text-ink">My Engagements</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        Overview of all active and completed advisory engagements between your organization and PSC Global.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {engagements.length === 0 ? (
          <div className="col-span-2 border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
            No active engagements found for your organization.
          </div>
        ) : (
          engagements.map((e) => (
            <div key={e.id} className="border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wide text-slate-400">
                  {e.serviceCategory || 'ADVISORY'}
                </span>
                <span className="bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600">
                  {e.status}
                </span>
              </div>
              <h2 className="mt-3 font-serif text-2xl text-ink">{e.title}</h2>
              {e.description && <p className="mt-2 text-xs leading-relaxed text-slate-600">{e.description}</p>}
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                <span>Start Date: {e.startDate || 'N/A'}</span>
                <span>End Date: {e.endDate || 'Ongoing'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
