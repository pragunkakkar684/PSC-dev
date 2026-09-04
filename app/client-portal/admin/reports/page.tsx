import { db } from '@/lib/db';
import { portalReports, portalClients } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { BarChart3, Download } from 'lucide-react';

export default async function AdminReportsPage() {
  const reports = await db
    .select({
      id: portalReports.id,
      title: portalReports.title,
      period: portalReports.period,
      publicationDate: portalReports.publicationDate,
      fileUrl: portalReports.fileUrl,
      summary: portalReports.summary,
      companyName: portalClients.companyName,
    })
    .from(portalReports)
    .innerJoin(portalClients, eq(portalReports.clientId, portalClients.id))
    .orderBy(portalReports.createdAt);

  return (
    <>
      <h1 className="font-serif text-4xl tracking-tight text-ink">Reports & Deliverables</h1>
      <p className="mt-2 text-sm text-slate-600">
        Published advisory reports and deliverables for client review.
      </p>

      <div className="mt-8 border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500">
              <th className="px-6 py-4">CLIENT COMPANY</th>
              <th className="px-6 py-4">REPORT TITLE</th>
              <th className="px-6 py-4">PERIOD</th>
              <th className="px-6 py-4">PUBLISHED DATE</th>
              <th className="px-6 py-4 text-right">DOWNLOAD</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-500">
                  No reports published yet.
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-6 py-5 font-semibold text-ink">{r.companyName}</td>
                  <td className="px-6 py-5 font-medium text-slate-800 flex items-center gap-2">
                    <BarChart3 size={15} className="text-slate-400" />
                    {r.title}
                  </td>
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
                      <span className="text-xs text-slate-400">No file</span>
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
