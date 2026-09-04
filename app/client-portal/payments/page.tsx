import { db } from '@/lib/db';
import { portalPayments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getPortalContext } from '@/lib/auth/portalAuth';

export default async function ClientPaymentsPage() {
  const portalCtx = await getPortalContext();
  const clientId = portalCtx?.clientId;

  const payments = clientId
    ? await db
        .select()
        .from(portalPayments)
        .where(eq(portalPayments.clientId, clientId))
        .orderBy(portalPayments.createdAt)
    : [];

  return (
    <>
      <h1 className="font-serif text-5xl tracking-tight text-ink">Payments</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        History of recorded payments and financial transaction receipts.
      </p>

      <div className="mt-10 border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wide text-slate-500">
              <th className="px-6 py-4">PAYMENT REF</th>
              <th className="px-6 py-4">DATE</th>
              <th className="px-6 py-4">PAYMENT METHOD</th>
              <th className="px-6 py-4">AMOUNT</th>
              <th className="px-6 py-4">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-500">
                  No payment records found for your account.
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-6 py-5 font-mono text-xs font-semibold text-ink">
                    {p.paymentRef}
                  </td>
                  <td className="px-6 py-5 text-slate-600">{p.paymentDate || 'N/A'}</td>
                  <td className="px-6 py-5 text-slate-600 text-xs">{p.paymentMethod}</td>
                  <td className="px-6 py-5 font-semibold text-slate-800">{p.amount}</td>
                  <td className="px-6 py-5">
                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1 text-[10px] font-bold">
                      {p.status}
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