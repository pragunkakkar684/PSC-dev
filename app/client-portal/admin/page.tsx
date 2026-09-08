import Link from 'next/link';
import { db } from '@/lib/db';
import {
  portalClients,
  portalEngagements,
  portalDocuments,
  portalInvoices,
  portalMeetings,
  portalSupportTickets,
  contactSubmissions,
} from '@/lib/db/schema';
import { count, eq, desc } from 'drizzle-orm';
import {
  Users,
  Briefcase,
  FileText,
  Receipt,
  Calendar,
  LifeBuoy,
  PhoneCall,
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
  const [{ value: newConsultations }] = await db
    .select({ value: count() })
    .from(contactSubmissions)
    .where(eq(contactSubmissions.status, 'new'));
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

  // Recent Consultation Submissions
  const recentConsultations = await db
    .select()
    .from(contactSubmissions)
    .orderBy(desc(contactSubmissions.createdAt))
    .limit(5);

  // Recent Client Accounts
  const recentClients = await db
    .select()
    .from(portalClients)
    .orderBy(desc(portalClients.createdAt))
    .limit(5);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl tracking-tight text-ink">Portal Administration</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage client accounts, consultations, engagements, compliance, and support tickets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/client-portal/admin/consultations"
            className="flex items-center gap-2 border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold tracking-wider text-slate-700 transition hover:bg-slate-50"
          >
            <PhoneCall size={14} /> VIEW CONSULTATIONS ({newConsultations})
          </Link>
          <Link
            href="/client-portal/admin/clients/new"
            className="flex items-center gap-2 bg-navy px-4 py-2.5 text-xs font-bold tracking-wider text-white transition hover:bg-slate-800"
          >
            <Plus size={14} /> CREATE CLIENT ACCOUNT
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-wide text-slate-500">NEW INQUIRIES</p>
            <PhoneCall size={16} className="text-sky-600" />
          </div>
          <p className={`mt-3 font-serif text-3xl ${newConsultations > 0 ? 'text-sky-700 font-bold' : 'text-ink'}`}>
            {newConsultations}
          </p>
        </div>

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
            <p className="text-[10px] font-bold tracking-wide text-slate-500">OPEN TICKETS</p>
            <LifeBuoy size={16} className="text-slate-400" />
          </div>
          <p className={`mt-3 font-serif text-3xl ${openTickets > 0 ? 'text-red-600' : 'text-ink'}`}>
            {openTickets}
          </p>
        </div>
      </div>

      {/* Main Grid Tables */}
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Recent Consultation Bookings */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-ink">Recent Consultation Bookings</h2>
            <Link
              href="/client-portal/admin/consultations"
              className="text-xs font-bold tracking-wide text-ink hover:underline"
            >
              INBOX →
            </Link>
          </div>
          <div className="mt-4 border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wide text-slate-500">
                  <th className="px-5 py-3">NAME & COMPANY</th>
                  <th className="px-5 py-3">PRACTICE AREA</th>
                  <th className="px-5 py-3">STATUS</th>
                  <th className="px-5 py-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {recentConsultations.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-xs text-slate-500">
                      No consultation bookings submitted yet.
                    </td>
                  </tr>
                ) : (
                  recentConsultations.map((sub) => (
                    <tr key={sub.id} className="border-b border-slate-100 last:border-b-0">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-ink">{sub.fullName}</div>
                        <div className="text-xs text-slate-500">{sub.company || sub.email}</div>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-700">
                        {sub.practiceArea || 'General Inquiry'}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[10px] font-bold ${
                            sub.status === 'new'
                              ? 'bg-sky-100 text-sky-800'
                              : sub.status === 'responded'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {sub.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href="/client-portal/admin/consultations"
                          className="text-xs font-bold text-ink hover:underline"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

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
      </div>
    </div>
  );
}
