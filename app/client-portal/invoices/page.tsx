import { db } from '@/lib/db';
import { portalInvoices, portalEngagements } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getPortalContext } from '@/lib/auth/portalAuth';

export default async function ClientInvoicesPage() {
  const portalCtx = await getPortalContext();
  const clientId = portalCtx?.clientId;

  const invoices = clientId
    ? await db
        .select({
          id: portalInvoices.id,
          invoiceNumber: portalInvoices.invoiceNumber,
          amount: portalInvoices.amount,
          issueDate: portalInvoices.issueDate,
          dueDate: portalInvoices.dueDate,
          status: portalInvoices.status,
          engagementTitle: portalEngagements.title,
        })
        .from(portalInvoices)
        .leftJoin(portalEngagements, eq(portalInvoices.engagementId, portalEngagements.id))
        .where(eq(portalInvoices.clientId, clientId))
        .orderBy(portalInvoices.createdAt)
    : [];

  return (
    <>
      <h1 className="font-serif text-5xl tracking-tight text-ink">Invoices</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        Review issued invoices, due dates, and settlement status.
      </p>

      <div className="mt-10 border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wide text-slate-500">
              <th className="px-6 py-4">INVOICE REF</th>
              <th className="px-6 py-4">ENGAGEMENT</th>
              <th className="px-6 py-4">ISSUE DATE</th>
              <th className="px-6 py-4">DUE DATE</th>
              <th className="px-6 py-4">AMOUNT</th>
              <th className="px-6 py-4">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-500">
                  No invoices issued for your account.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-6 py-5 font-mono text-xs font-semibold text-ink">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-6 py-5 text-slate-600">{inv.engagementTitle || 'General'}</td>
                  <td className="px-6 py-5 text-slate-600">{inv.issueDate || 'N/A'}</td>
                  <td className="px-6 py-5 text-slate-600">{inv.dueDate || 'N/A'}</td>
                  <td className="px-6 py-5 font-semibold text-slate-800">{inv.amount}</td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-block px-3 py-1 text-[10px] font-bold ${
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