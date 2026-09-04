import { db } from '@/lib/db';
import { portalEngagements, portalClients } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function AdminEngagementsPage() {
  const engagements = await db
    .select({
      id: portalEngagements.id,
      title: portalEngagements.title,
      serviceCategory: portalEngagements.serviceCategory,
      status: portalEngagements.status,
      startDate: portalEngagements.startDate,
      companyName: portalClients.companyName,
    })
    .from(portalEngagements)
    .innerJoin(portalClients, eq(portalEngagements.clientId, portalClients.id))
    .orderBy(portalEngagements.createdAt);

  return (
    <>
      <h1 className="font-serif text-4xl tracking-tight text-ink">Client Engagements</h1>
      <p className="mt-2 text-sm text-slate-600">
        All active and completed engagements across client accounts.
      </p>

      <div className="mt-8 border border-slate-200 bg-white">
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
            {engagements.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-500">
                  No engagements created yet. Create an engagement from a Client Profile.
                </td>
              </tr>
            ) : (
              engagements.map((e) => (
                <tr key={e.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-6 py-5 font-semibold text-ink">{e.companyName}</td>
                  <td className="px-6 py-5 font-medium text-slate-800">{e.title}</td>
                  <td className="px-6 py-5 text-slate-600">{e.serviceCategory || 'Advisory'}</td>
                  <td className="px-6 py-5 text-slate-600">{e.startDate || 'N/A'}</td>
                  <td className="px-6 py-5">
                    <span className="bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600">
                      {e.status}
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
