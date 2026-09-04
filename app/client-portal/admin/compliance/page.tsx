import { db } from '@/lib/db';
import { portalComplianceItems, portalClients } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function AdminCompliancePage() {
  const items = await db
    .select({
      id: portalComplianceItems.id,
      requirement: portalComplianceItems.requirement,
      dueDate: portalComplianceItems.dueDate,
      status: portalComplianceItems.status,
      notes: portalComplianceItems.notes,
      companyName: portalClients.companyName,
    })
    .from(portalComplianceItems)
    .innerJoin(portalClients, eq(portalComplianceItems.clientId, portalClients.id))
    .orderBy(portalComplianceItems.createdAt);

  return (
    <>
      <h1 className="font-serif text-4xl tracking-tight text-ink">Compliance Calendar Items</h1>
      <p className="mt-2 text-sm text-slate-600">
        Regulatory and compliance deadlines set for client organizations.
      </p>

      <div className="mt-8 border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500">
              <th className="px-6 py-4">CLIENT COMPANY</th>
              <th className="px-6 py-4">REQUIREMENT</th>
              <th className="px-6 py-4">DUE DATE</th>
              <th className="px-6 py-4">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-xs text-slate-500">
                  No compliance requirements configured.
                </td>
              </tr>
            ) : (
              items.map((i) => (
                <tr key={i.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-6 py-5 font-semibold text-ink">{i.companyName}</td>
                  <td className="px-6 py-5 font-medium text-slate-800">{i.requirement}</td>
                  <td className="px-6 py-5 text-slate-600">{i.dueDate || 'N/A'}</td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 text-[10px] font-bold ${
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
