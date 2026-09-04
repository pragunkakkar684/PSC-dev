import { db } from '@/lib/db';
import { portalInvoices, portalClients } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function AdminInvoicesPage() {
  const invoices = await db
    .select({
      id: portalInvoices.id,
      invoiceNumber: portalInvoices.invoiceNumber,
      amount: portalInvoices.amount,
      issueDate: portalInvoices.issueDate,
      dueDate: portalInvoices.dueDate,
      status: portalInvoices.status,
      companyName: portalClients.companyName,
    })
    .from(portalInvoices)
    .innerJoin(portalClients, eq(portalInvoices.clientId, portalClients.id))
    .orderBy(portalInvoices.createdAt);

  return (
    <>
      <h1 className="font-serif text-4xl tracking-tight text-ink">Invoices</h1>
      <p className="mt-2 text-sm text-slate-600">
        Issued invoices and payment collection statuses across client accounts.
      </p>

      <div className="mt-8 border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500">
              <th className="px-6 py-4">CLIENT COMPANY</th>
              <th className="px-6 py-4">INVOICE REF</th>
              <th className="px-6 py-4">AMOUNT</th>
              <th className="px-6 py-4">DUE DATE</th>
              <th className="px-6 py-4">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-500">
                  No invoices issued yet.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-6 py-5 font-semibold text-ink">{inv.companyName}</td>
                  <td className="px-6 py-5 font-mono text-xs font-semibold text-slate-800">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-6 py-5 text-slate-700 font-semibold">{inv.amount}</td>
                  <td className="px-6 py-5 text-slate-600">{inv.dueDate || 'N/A'}</td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 text-[10px] font-bold ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {inv.status}
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
