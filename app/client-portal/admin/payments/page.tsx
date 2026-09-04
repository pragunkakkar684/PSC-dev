import { db } from '@/lib/db';
import { portalPayments, portalClients } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function AdminPaymentsPage() {
  const payments = await db
    .select({
      id: portalPayments.id,
      paymentRef: portalPayments.paymentRef,
      amount: portalPayments.amount,
      paymentDate: portalPayments.paymentDate,
      paymentMethod: portalPayments.paymentMethod,
      status: portalPayments.status,
      companyName: portalClients.companyName,
    })
    .from(portalPayments)
    .innerJoin(portalClients, eq(portalPayments.clientId, portalClients.id))
    .orderBy(portalPayments.createdAt);

  return (
    <>
      <h1 className="font-serif text-4xl tracking-tight text-ink">Payment Records</h1>
      <p className="mt-2 text-sm text-slate-600">
        Record of payments received and settlement audit history.
      </p>

      <div className="mt-8 border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500">
              <th className="px-6 py-4">CLIENT COMPANY</th>
              <th className="px-6 py-4">PAYMENT REF</th>
              <th className="px-6 py-4">AMOUNT</th>
              <th className="px-6 py-4">METHOD</th>
              <th className="px-6 py-4">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-500">
                  No payment records registered yet.
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-6 py-5 font-semibold text-ink">{p.companyName}</td>
                  <td className="px-6 py-5 font-mono text-xs font-semibold text-slate-800">
                    {p.paymentRef}
                  </td>
                  <td className="px-6 py-5 text-slate-700 font-semibold">{p.amount}</td>
                  <td className="px-6 py-5 text-slate-600 text-xs">{p.paymentMethod}</td>
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
