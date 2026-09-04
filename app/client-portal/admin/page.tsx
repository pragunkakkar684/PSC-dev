import Link from 'next/link';
import { db } from '@/lib/db';
import {
  portalClients,
  portalEngagements,
  portalTasks,
  portalDocuments,
  portalInvoices,
  portalMeetings,
  portalSupportTickets,
} from '@/lib/db/schema';
import { count, eq } from 'drizzle-orm';
import {
  Users,
  Briefcase,
  CheckCircle2,
  FileText,
  Receipt,
  Calendar,
  LifeBuoy,
  Plus,
  ArrowRight,
} from 'lucide-react';

export default async function PortalAdminDashboardPage() {
  // Aggregate operational counts
  const [{ value: totalClients }] = await db.select({ value: count() }).from(portalClients);
  const [{ value: activeEngagements }] = await db
    .select({ value: count() })
    .from(portalEngagements)
    .where(eq(portalEngagements.status, 'ACTIVE'));
  const [{ value: pendingDocuments }] = await db
    .select({ value: count() })
    .from(portalDocuments)
    .where(eq(portalDocuments.status, 'PENDING_REVIEW'));
  const [{ value: unpaidInvoices }] = await db
    .select({ value: count() })
    .from(portalInvoices)
    .where(eq(portalInvoices.status, 'UNPAID'));
  const [{ value: openTickets }] = await db
    .select({ value: count() })
    .from(portalSupportTickets)
    .where(eq(portalSupportTickets.status, 'OPEN'));
  const [{ value: requestedMeetings }] = await db
    .select({ value: count() })
    .from(portalMeetings)
    .where(eq(portalMeetings.status, 'REQUESTED'));

  // Recent Client Accounts
  const recentClients = await db
    .select()
    .from(portalClients)
    .orderBy(portalClients.createdAt)
    .limit(5);

  // Open Support Tickets
  const recentTickets = await db
    .select()
    .from(portalSupportTickets)
    .orderBy(portalSupportTickets.createdAt)
    .limit(5);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl tracking-tight text-ink">Portal Administration</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage client accounts, engagements, operational tasks, compliance, and support.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/client-portal/admin/clients/new"
            className="flex items-center gap-2 bg-navy px-4 py-2.5 text-xs font-bold tracking-wider text-white transition hover:bg-slate-800"
          >
            <Plus size={14} /> CREATE CLIENT ACCOUNT
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-wide text-slate-500">TOTAL CLIENTS</p>
            <Users size={16} className="text-slate-400" />
          </div>
          <p className="mt-3 font-serif text-3xl text-ink">{totalClients}</p>
        </div>

        <div className="border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-wide text-slate-500">ACTIVE ENGAGEMENTS</p>
            <Briefcase size={16} className="text-slate-400" />
          </div>
          <p className="mt-3 font-serif text-3xl text-ink">{activeEngagements}</p>
        </div>

        <div className="border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-wide text-slate-500">PENDING DOCS</p>
            <FileText size={16} className="text-slate-400" />
          </div>
          <p className={`mt-3 font-serif text-3xl ${pendingDocuments > 0 ? 'text-amber-600' : 'text-ink'}`}>
            {pendingDocuments}
          </p>
        </div>

        <div className="border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-wide text-slate-500">UNPAID INVOICES</p>
            <Receipt size={16} className="text-slate-400" />
          </div>
          <p className={`mt-3 font-serif text-3xl ${unpaidInvoices > 0 ? 'text-red-600' : 'text-ink'}`}>
            {unpaidInvoices}
          </p>
        </div>

        <div className="border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-wide text-slate-500">REQUESTED MEETINGS</p>
            <Calendar size={16} className="text-slate-400" />
          </div>
          <p className="mt-3 font-serif text-3xl text-ink">{requestedMeetings}</p>
        </div>

        <div className="border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-wide text-slate-500">OPEN TICKETS</p>
            <LifeBuoy size={16} className="text-slate-400" />
          </div>
          <p className={`mt-3 font-serif text-3xl ${openTickets > 0 ? 'text-red-600' : 'text-ink'}`}>
            {openTickets}
          </p>
        </div>
      </div>

      {/* Main Grid Tables */}
      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        {/* Client Accounts Table */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-ink">Client Accounts</h2>
            <Link
              href="/client-portal/admin/clients"
              className="text-xs font-bold tracking-wide text-ink hover:underline"
            >
              VIEW ALL CLIENTS →
            </Link>
          </div>
          <div className="mt-4 border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wide text-slate-500">
                  <th className="px-5 py-3">COMPANY</th>
                  <th className="px-5 py-3">CONTACT</th>
                  <th className="px-5 py-3">STATUS</th>
                  <th className="px-5 py-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {recentClients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-xs text-slate-500">
                      No client accounts provisioned yet.
                    </td>
                  </tr>
                ) : (
                  recentClients.map((client) => (
                    <tr key={client.id} className="border-b border-slate-100 last:border-b-0">
                      <td className="px-5 py-4 font-semibold text-ink">{client.companyName}</td>
                      <td className="px-5 py-4 text-xs text-slate-600">
                        {client.contactName} ({client.email})
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[10px] font-bold ${
                            client.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {client.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/client-portal/admin/clients/${client.id}`}
                          className="text-xs font-bold text-ink hover:underline"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Support Inbox Table */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-ink">Recent Support Tickets</h2>
            <Link
              href="/client-portal/admin/support"
              className="text-xs font-bold tracking-wide text-ink hover:underline"
            >
              INBOX →
            </Link>
          </div>
          <div className="mt-4 border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wide text-slate-500">
                  <th className="px-5 py-3">REF</th>
                  <th className="px-5 py-3">SUBJECT</th>
                  <th className="px-5 py-3">PRIORITY</th>
                  <th className="px-5 py-3">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-xs text-slate-500">
                      No support tickets raised yet.
                    </td>
                  </tr>
                ) : (
                  recentTickets.map((t) => (
                    <tr key={t.id} className="border-b border-slate-100 last:border-b-0">
                      <td className="px-5 py-4 font-mono text-xs font-bold text-slate-600">
                        {t.ticketNumber}
                      </td>
                      <td className="px-5 py-4 font-semibold text-ink">{t.subject}</td>
                      <td className="px-5 py-4 text-xs font-medium text-slate-600">{t.priority}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[10px] font-bold ${
                            t.status === 'OPEN' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
