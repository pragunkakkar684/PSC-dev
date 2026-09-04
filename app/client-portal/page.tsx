import Link from 'next/link';
import { db } from '@/lib/db';
import {
  portalEngagements,
  portalTasks,
  portalComplianceItems,
  portalDocuments,
  portalReports,
  portalInvoices,
} from '@/lib/db/schema';
import { count, eq, and, ne } from 'drizzle-orm';
import { getPortalContext } from '@/lib/auth/portalAuth';
import { ArrowRight, Briefcase, CheckCircle2, ClipboardList, FileText } from 'lucide-react';
import PortalAssistanceCTA from '../components/PortalAssistanceCTA';

function StatusPill({ status }: { status: string }) {
  const isDueSoon = status === 'DUE SOON';
  const isUnpaid = status === 'UNPAID';
  const isOverdue = status === 'OVERDUE';
  const isPending = status === 'PENDING';

  return (
    <span
      className={`inline-block px-3 py-1 text-[10px] font-bold tracking-wide ${
        isDueSoon || isUnpaid || isOverdue
          ? 'bg-red-50 text-red-600'
          : isPending
          ? 'bg-amber-50 text-amber-700'
          : 'bg-slate-100 text-slate-600'
      }`}
    >
      {status}
    </span>
  );
}

export default async function ClientPortalDashboardPage() {
  const portalCtx = await getPortalContext();
  const clientId = portalCtx?.clientId;

  // Aggregate stats scoped to client ID
  let activeEngagementsCount = 0;
  let upcomingTasksCount = 0;
  let complianceDeadlinesCount = 0;
  let pendingDocumentsCount = 0;

  let upcomingTasksList: any[] = [];
  let complianceCalendarList: any[] = [];
  let reportsList: any[] = [];
  let invoicesList: any[] = [];

  if (clientId) {
    const [{ value: activeEng }] = await db
      .select({ value: count() })
      .from(portalEngagements)
      .where(and(eq(portalEngagements.clientId, clientId), eq(portalEngagements.status, 'ACTIVE')));
    activeEngagementsCount = activeEng;

    const [{ value: upTasks }] = await db
      .select({ value: count() })
      .from(portalTasks)
      .where(and(eq(portalTasks.clientId, clientId), ne(portalTasks.status, 'COMPLETED')));
    upcomingTasksCount = upTasks;

    const [{ value: compDeadlines }] = await db
      .select({ value: count() })
      .from(portalComplianceItems)
      .where(and(eq(portalComplianceItems.clientId, clientId), eq(portalComplianceItems.status, 'PENDING')));
    complianceDeadlinesCount = compDeadlines;

    const [{ value: pendDocs }] = await db
      .select({ value: count() })
      .from(portalDocuments)
      .where(and(eq(portalDocuments.clientId, clientId), eq(portalDocuments.status, 'PENDING_REVIEW')));
    pendingDocumentsCount = pendDocs;

    // Upcoming Tasks List
    upcomingTasksList = await db
      .select({
        id: portalTasks.id,
        name: portalTasks.name,
        dueDate: portalTasks.dueDate,
        status: portalTasks.status,
        engagementTitle: portalEngagements.title,
      })
      .from(portalTasks)
      .leftJoin(portalEngagements, eq(portalTasks.engagementId, portalEngagements.id))
      .where(and(eq(portalTasks.clientId, clientId), ne(portalTasks.status, 'COMPLETED')))
      .orderBy(portalTasks.dueDate)
      .limit(5);

    // Compliance Calendar List
    complianceCalendarList = await db
      .select({
        id: portalComplianceItems.id,
        requirement: portalComplianceItems.requirement,
        dueDate: portalComplianceItems.dueDate,
        status: portalComplianceItems.status,
        engagementTitle: portalEngagements.title,
      })
      .from(portalComplianceItems)
      .leftJoin(portalEngagements, eq(portalComplianceItems.engagementId, portalEngagements.id))
      .where(eq(portalComplianceItems.clientId, clientId))
      .orderBy(portalComplianceItems.dueDate)
      .limit(5);

    // Reports List
    reportsList = await db
      .select({
        id: portalReports.id,
        title: portalReports.title,
        publicationDate: portalReports.publicationDate,
        engagementTitle: portalEngagements.title,
      })
      .from(portalReports)
      .leftJoin(portalEngagements, eq(portalReports.engagementId, portalEngagements.id))
      .where(eq(portalReports.clientId, clientId))
      .orderBy(portalReports.publicationDate)
      .limit(3);

    // Invoices List
    invoicesList = await db
      .select({
        id: portalInvoices.id,
        invoiceNumber: portalInvoices.invoiceNumber,
        issueDate: portalInvoices.issueDate,
        amount: portalInvoices.amount,
        status: portalInvoices.status,
      })
      .from(portalInvoices)
      .where(eq(portalInvoices.clientId, clientId))
      .orderBy(portalInvoices.createdAt)
      .limit(3);
  }

  const stats = [
    ['ACTIVE ENGAGEMENTS', Briefcase, activeEngagementsCount.toString()],
    ['UPCOMING TASKS', CheckCircle2, upcomingTasksCount.toString()],
    ['COMPLIANCE DEADLINES', ClipboardList, complianceDeadlinesCount.toString(), complianceDeadlinesCount > 0],
    ['PENDING DOCUMENTS', FileText, pendingDocumentsCount.toString()],
  ];

  return (
    <>
      <h1 className="font-serif text-5xl tracking-tight text-ink">Client Dashboard</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        An overview of your engagements, tasks, documents and upcoming compliance requirements.
      </p>

      {/* Stats Row */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, Icon, value, alert]: any) => (
          <div className="border border-slate-200 bg-white p-6" key={label}>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold tracking-wide text-slate-500">{label}</p>
              <Icon size={16} className="text-slate-400" strokeWidth={1.5} />
            </div>
            <p className={`mt-3 font-serif text-4xl ${alert ? 'text-red-600' : 'text-ink'}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Tasks Section */}
      <div className="mt-16 flex items-end justify-between">
        <h2 className="font-serif text-3xl text-ink">Upcoming Tasks</h2>
        <Link className="flex items-center gap-2 text-xs font-bold tracking-wide text-ink" href="/client-portal/tasks">
          VIEW ALL TASKS <ArrowRight size={14} />
        </Link>
      </div>
      <table className="mt-6 w-full border border-slate-200 bg-white text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wide text-slate-500">
            <th className="px-6 py-4">TASK NAME</th>
            <th className="px-6 py-4">ENGAGEMENT</th>
            <th className="px-6 py-4">DUE DATE</th>
            <th className="px-6 py-4">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {upcomingTasksList.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-xs text-slate-500">
                No upcoming tasks assigned.
              </td>
            </tr>
          ) : (
            upcomingTasksList.map((t) => (
              <tr className="border-b border-slate-100 last:border-b-0" key={t.id}>
                <td className="px-6 py-5 font-semibold text-ink">{t.name}</td>
                <td className="px-6 py-5 text-slate-600">{t.engagementTitle || 'General'}</td>
                <td className={`px-6 py-5 ${t.status === 'DUE SOON' ? 'text-red-600' : 'text-slate-600'}`}>
                  {t.dueDate || 'No due date'}
                </td>
                <td className="px-6 py-5">
                  <StatusPill status={t.status} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Compliance Calendar Section */}
      <div className="mt-16 flex items-end justify-between">
        <h2 className="font-serif text-3xl text-ink">Compliance Calendar</h2>
        <Link className="flex items-center gap-2 text-xs font-bold tracking-wide text-ink" href="/client-portal/calendar">
          VIEW COMPLIANCE CALENDAR <ArrowRight size={14} />
        </Link>
      </div>
      <table className="mt-6 w-full border border-slate-200 bg-white text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wide text-slate-500">
            <th className="px-6 py-4">DATE</th>
            <th className="px-6 py-4">REQUIREMENT</th>
            <th className="px-6 py-4">RELATED ENGAGEMENT</th>
            <th className="px-6 py-4">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {complianceCalendarList.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-xs text-slate-500">
                No compliance items scheduled.
              </td>
            </tr>
          ) : (
            complianceCalendarList.map((c) => (
              <tr className="border-b border-slate-100 last:border-b-0" key={c.id}>
                <td className="px-6 py-5 text-slate-600">{c.dueDate || 'N/A'}</td>
                <td className="px-6 py-5 font-semibold text-ink">{c.requirement}</td>
                <td className="px-6 py-5 text-slate-600">{c.engagementTitle || 'General'}</td>
                <td className="px-6 py-5">
                  <StatusPill status={c.status} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Bottom Grid: Reports & Invoices */}
      <div className="mt-16 grid gap-10 md:grid-cols-2">
        <div>
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-2xl text-ink">Recent Reports</h2>
            <Link className="text-xs font-bold tracking-wide text-ink" href="/client-portal/reports">
              VIEW ALL →
            </Link>
          </div>
          <table className="mt-5 w-full border border-slate-200 bg-white text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wide text-slate-500">
                <th className="px-5 py-3">REPORT NAME</th>
                <th className="px-5 py-3">ENGAGEMENT</th>
                <th className="px-5 py-3">DATE</th>
              </tr>
            </thead>
            <tbody>
              {reportsList.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-6 text-center text-xs text-slate-500">
                    No reports published yet.
                  </td>
                </tr>
              ) : (
                reportsList.map((r) => (
                  <tr className="border-b border-slate-100 last:border-b-0" key={r.id}>
                    <td className="px-5 py-4 font-semibold text-ink">{r.title}</td>
                    <td className="px-5 py-4 text-slate-600">{r.engagementTitle || 'Advisory'}</td>
                    <td className="px-5 py-4 text-slate-600">{r.publicationDate || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div>
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-2xl text-ink">Invoices &amp; Payments</h2>
            <Link className="text-xs font-bold tracking-wide text-ink" href="/client-portal/invoices">
              VIEW ALL →
            </Link>
          </div>
          <table className="mt-5 w-full border border-slate-200 bg-white text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wide text-slate-500">
                <th className="px-5 py-3">INVOICE/REF</th>
                <th className="px-5 py-3">DATE</th>
                <th className="px-5 py-3">AMOUNT</th>
                <th className="px-5 py-3">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {invoicesList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-xs text-slate-500">
                    No invoices issued.
                  </td>
                </tr>
              ) : (
                invoicesList.map((inv) => (
                  <tr className="border-b border-slate-100 last:border-b-0" key={inv.id}>
                    <td className="px-5 py-4 font-semibold text-ink">{inv.invoiceNumber}</td>
                    <td className="px-5 py-4 text-slate-600">{inv.issueDate || 'N/A'}</td>
                    <td className="px-5 py-4 text-slate-600">{inv.amount}</td>
                    <td className="px-5 py-4">
                      <StatusPill status={inv.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PortalAssistanceCTA copy="Your PSC Global team is available to help." />
    </>
  );
}
