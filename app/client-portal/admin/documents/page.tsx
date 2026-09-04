import { db } from '@/lib/db';
import { portalDocuments, portalClients } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { FileText, Download } from 'lucide-react';

export default async function AdminDocumentsPage() {
  const documents = await db
    .select({
      id: portalDocuments.id,
      title: portalDocuments.title,
      fileUrl: portalDocuments.fileUrl,
      fileType: portalDocuments.fileType,
      category: portalDocuments.category,
      status: portalDocuments.status,
      createdAt: portalDocuments.createdAt,
      companyName: portalClients.companyName,
    })
    .from(portalDocuments)
    .innerJoin(portalClients, eq(portalDocuments.clientId, portalClients.id))
    .orderBy(portalDocuments.createdAt);

  return (
    <>
      <h1 className="font-serif text-4xl tracking-tight text-ink">Client Documents</h1>
      <p className="mt-2 text-sm text-slate-600">
        Review client uploaded files and admin published document records.
      </p>

      <div className="mt-8 border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500">
              <th className="px-6 py-4">CLIENT COMPANY</th>
              <th className="px-6 py-4">DOCUMENT TITLE</th>
              <th className="px-6 py-4">CATEGORY</th>
              <th className="px-6 py-4">STATUS</th>
              <th className="px-6 py-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-500">
                  No documents uploaded yet.
                </td>
              </tr>
            ) : (
              documents.map((d) => (
                <tr key={d.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-6 py-5 font-semibold text-ink">{d.companyName}</td>
                  <td className="px-6 py-5 font-medium text-slate-800 flex items-center gap-2">
                    <FileText size={15} className="text-slate-400" />
                    {d.title}
                  </td>
                  <td className="px-6 py-5 text-slate-600">{d.category || 'General'}</td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 text-[10px] font-bold ${
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
