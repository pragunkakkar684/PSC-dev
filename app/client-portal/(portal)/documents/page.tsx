import { db } from '@/lib/db';
import { portalDocuments, portalEngagements } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getPortalContext } from '@/lib/auth/portalAuth';
import { Download, FileText, Upload } from 'lucide-react';
import { clientUploadDocumentAction } from '@/app/actions/clientPortalActions';

export default async function ClientDocumentsPage() {
  const portalCtx = await getPortalContext();
  const clientId = portalCtx?.clientId;

  const documents = clientId
    ? await db
        .select({
          id: portalDocuments.id,
          title: portalDocuments.title,
          fileUrl: portalDocuments.fileUrl,
          fileType: portalDocuments.fileType,
          category: portalDocuments.category,
          status: portalDocuments.status,
          createdAt: portalDocuments.createdAt,
          engagementTitle: portalEngagements.title,
        })
        .from(portalDocuments)
        .leftJoin(portalEngagements, eq(portalDocuments.engagementId, portalEngagements.id))
        .where(eq(portalDocuments.clientId, clientId))
        .orderBy(portalDocuments.createdAt)
    : [];

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-5xl tracking-tight text-ink">Documents</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            Secure document vault for corporate records, tax filings, and advisory deliverables.
          </p>
        </div>
      </div>

      {/* Upload Form */}
      <div className="mt-8 border border-slate-200 bg-white p-6">
        <h2 className="font-serif text-xl text-ink">Upload Document for Review</h2>
        <form action={clientUploadDocumentAction} className="mt-4 flex flex-wrap items-center gap-4">
          <input
            type="text"
            name="title"
            required
            placeholder="Document Title (e.g. Q3 Trial Balance)"
            className="flex-1 min-w-[220px] border border-slate-200 px-4 py-2.5 text-xs text-ink outline-none"
          />
          <input
            type="url"
            name="fileUrl"
            required
            placeholder="File Cloud / Upload URL"
            className="flex-1 min-w-[220px] border border-slate-200 px-4 py-2.5 text-xs text-ink outline-none"
          />
          <button
            type="submit"
            className="flex items-center gap-2 bg-navy px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
          >
            <Upload size={14} /> UPLOAD FILE
          </button>
        </form>
      </div>

      {/* Documents Table */}
      <div className="mt-8 border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wide text-slate-500">
              <th className="px-6 py-4">DOCUMENT TITLE</th>
              <th className="px-6 py-4">RELATED ENGAGEMENT</th>
              <th className="px-6 py-4">CATEGORY</th>
              <th className="px-6 py-4">STATUS</th>
              <th className="px-6 py-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-500">
                  No documents found in your vault.
                </td>
              </tr>
            ) : (
              documents.map((d) => (
                <tr key={d.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-6 py-5 font-semibold text-ink flex items-center gap-2">
                    <FileText size={16} className="text-slate-400" />
                    {d.title}
                  </td>
                  <td className="px-6 py-5 text-slate-600">{d.engagementTitle || 'General'}</td>
                  <td className="px-6 py-5 text-slate-600">{d.category || 'General'}</td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-block px-3 py-1 text-[10px] font-bold ${
                        d.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <a
                      href={d.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-ink hover:border-ink"
                    >
                      <Download size={13} /> DOWNLOAD
                    </a>
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
