import { db } from '@/lib/db';
import { portalReports, portalEngagements } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getPortalContext } from '@/lib/auth/portalAuth';
import { Download, BarChart3 } from 'lucide-react';

export default async function ClientReportsPage() {
  const portalCtx = await getPortalContext();
  const clientId = portalCtx?.clientId;

  const reports = clientId
    ? await db
        .select({
          id: portalReports.id,
          title: portalReports.title,
          period: portalReports.period,
          publicationDate: portalReports.publicationDate,
          fileUrl: portalReports.fileUrl,
          summary: portalReports.summary,
          engagementTitle: portalEngagements.title,
        })
        .from(portalReports)
        .leftJoin(portalEngagements, eq(portalReports.engagementId, portalEngagements.id))
        .where(eq(portalReports.clientId, clientId))
        .orderBy(portalReports.publicationDate)
    : [];

  return (
    <>
      <h1 className="font-serif text-5xl tracking-tight text-ink">Reports</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        Published audit summaries, valuation reports, and strategy reviews.
      </p>

      <div className="mt-10 border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wide text-slate-500">
              <th className="px-6 py-4">REPORT NAME</th>
              <th className="px-6 py-4">ENGAGEMENT</th>
              <th className="px-6 py-4">PERIOD</th>
              <th className="px-6 py-4">PUBLISHED DATE</th>
              <th className="px-6 py-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-500">
                  No published reports available for your organization.
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-6 py-5 font-semibold text-ink flex items-center gap-2">
                    <BarChart3 size={16} className="text-slate-400" />
                    {r.title}
                  </td>
                  <td className="px-6 py-5 text-slate-600">{r.engagementTitle || 'General'}</td>
                  <td className="px-6 py-5 text-slate-600">{r.period || 'N/A'}</td>
                  <td className="px-6 py-5 text-slate-600">{r.publicationDate || 'N/A'}</td>
                  <td className="px-6 py-5 text-right">
                    {r.fileUrl ? (
                      <a
                        href={r.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-ink hover:border-ink"
                      >
                        <Download size={13} /> DOWNLOAD
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">Available soon</span>
                    )}
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