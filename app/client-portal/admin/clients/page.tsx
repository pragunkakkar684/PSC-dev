import Link from 'next/link';
import { db } from '@/lib/db';
import { portalClients } from '@/lib/db/schema';
import { Plus, Users, Search, ArrowRight } from 'lucide-react';
import { updateClientStatusAction } from '@/app/actions/portalAdminActions';

export default async function AdminClientsListPage() {
  const clients = await db
    .select()
    .from(portalClients)
    .orderBy(portalClients.createdAt);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl tracking-tight text-ink">Client Accounts</h1>
          <p className="mt-2 text-sm text-slate-600">
            Provision, manage, and inspect client organization accounts.
          </p>
        </div>
        <Link
          href="/client-portal/admin/clients/new"
          className="flex items-center gap-2 bg-navy px-5 py-2.5 text-xs font-bold tracking-wider text-white transition hover:bg-slate-800"
        >
          <Plus size={15} /> ADD CLIENT ACCOUNT
        </Link>
      </div>

      <div className="mt-8 border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <p className="text-xs font-bold tracking-wider text-slate-500">
            TOTAL CLIENT ACCOUNTS ({clients.length})
          </p>
        </div>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wide text-slate-500">
              <th className="px-6 py-4">COMPANY NAME</th>
              <th className="px-6 py-4">PRIMARY CONTACT</th>
              <th className="px-6 py-4">EMAIL</th>
              <th className="px-6 py-4">PHONE</th>
              <th className="px-6 py-4">STATUS</th>
              <th className="px-6 py-4 text-right">MANAGEMENT</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-500">
                  No client accounts provisioned. Click "ADD CLIENT ACCOUNT" to create the first client.
                </td>
              </tr>
            ) : (
              clients.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50">
                  <td className="px-6 py-5 font-semibold text-ink">{c.companyName}</td>
                  <td className="px-6 py-5 text-slate-700">{c.contactName}</td>
                  <td className="px-6 py-5 text-slate-600 font-mono text-xs">{c.email}</td>
                  <td className="px-6 py-5 text-slate-600">{c.phone || '—'}</td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-block px-3 py-1 text-[10px] font-bold tracking-wide ${
                        c.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link
                      href={`/client-portal/admin/clients/${c.id}`}
                      className="inline-flex items-center gap-1.5 border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-ink hover:border-ink"
                    >
                      VIEW PROFILE <ArrowRight size={12} />
                    </Link>
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
