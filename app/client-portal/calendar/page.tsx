import { db } from '@/lib/db';
import { portalComplianceItems, portalEngagements } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getPortalContext } from '@/lib/auth/portalAuth';

export default async function ClientComplianceCalendarPage() {
  const portalCtx = await getPortalContext();
  const clientId = portalCtx?.clientId;

  const items = clientId
    ? await db
        .select({
          id: portalComplianceItems.id,
          requirement: portalComplianceItems.requirement,
          dueDate: portalComplianceItems.dueDate,
          status: portalComplianceItems.status,
          notes: portalComplianceItems.notes,
          engagementTitle: portalEngagements.title,
        })
        .from(portalComplianceItems)
        .leftJoin(portalEngagements, eq(portalComplianceItems.engagementId, portalEngagements.id))
        .where(eq(portalComplianceItems.clientId, clientId))
        .orderBy(portalComplianceItems.dueDate)
    : [];

  return (
    <>
      <h1 className="font-serif text-5xl tracking-tight text-ink">Compliance Calendar</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        Regulatory filings, statutory deadlines, and tax compliance calendar.
      </p>

      <div className="mt-10 border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wide text-slate-500">
              <th className="px-6 py-4">DUE DATE</th>
              <th className="px-6 py-4">REQUIREMENT</th>
              <th className="px-6 py-4">RELATED ENGAGEMENT</th>
              <th className="px-6 py-4">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-xs text-slate-500">
                  No compliance deadlines scheduled.
                </td>
              </tr>
            ) : (
              items.map((i) => (
                <tr key={i.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-6 py-5 text-slate-600 font-medium">{i.dueDate || 'N/A'}</td>
                  <td className="px-6 py-5 font-semibold text-ink">{i.requirement}</td>
                  <td className="px-6 py-5 text-slate-600">{i.engagementTitle || 'General'}</td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-block px-3 py-1 text-[10px] font-bold ${
                        i.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {i.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
