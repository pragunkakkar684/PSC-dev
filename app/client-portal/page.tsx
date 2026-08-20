import { ArrowRight, Briefcase, CheckCircle2, ClipboardList, FileText } from 'lucide-react';
import PortalAssistanceCTA from '../components/PortalAssistanceCTA';

const stats = [
  ['ACTIVE ENGAGEMENTS', Briefcase, '3'],
  ['UPCOMING TASKS', CheckCircle2, '12'],
  ['COMPLIANCE DEADLINES', ClipboardList, '2', true],
  ['PENDING DOCUMENTS', FileText, '5'],
];

const upcomingTasks = [
  ['Submit Q3 Trial Balance', 'Q3 Tax Advisory & Compliance', 'Oct 20, 2023', 'UPCOMING'],
  ['Review Draft Audit Plan', 'Annual Audit 2023', 'Oct 15, 2023', 'DUE SOON'],
];

const complianceCalendar = [
  ['Oct 31, 2023', 'Corporate Tax Return Filing', 'Q3 Tax Advisory & Compliance', 'PENDING'],
  ['Nov 15, 2023', 'VAT Return Q3', 'Tax', 'PENDING'],
];

const reports = [
  ['Q2 Audit Summary', 'Annual Audit 2023', 'Jul 15, 2023'],
  ['Tax Strategy Review', 'Q3 Tax Advisory & Compliance', 'Aug 01, 2023'],
];

const invoices = [
  ['INV-2023-089', 'Oct 01, 2023', '$4,500.00', 'UNPAID'],
  ['INV-2023-072', 'Sep 15, 2023', '$2,100.00', 'PAID'],
];

function StatusPill({ status }: { status: string }) {
  const isDueSoon = status === 'DUE SOON';
  const isUnpaid = status === 'UNPAID';
  return (
    <span
      className={`inline-block px-3 py-1 text-[10px] font-bold tracking-wide ${
        isDueSoon || isUnpaid ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
      }`}
    >
      {status}
    </span>
  );
}

export default function ClientPortalDashboardPage() {
  return (
    <>
      <h1 className="font-serif text-5xl tracking-tight text-ink">Client Dashboard</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        An overview of your engagements, tasks, documents and upcoming compliance requirements.
      </p>

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

      <div className="mt-16 flex items-end justify-between">
        <h2 className="font-serif text-3xl text-ink">Upcoming Tasks</h2>
        <a className="flex items-center gap-2 text-xs font-bold tracking-wide text-ink" href="/client-portal/tasks">
          VIEW ALL TASKS <ArrowRight size={14} />
        </a>
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
          {upcomingTasks.map(([name, engagement, date, status]) => (
            <tr className="border-b border-slate-100 last:border-b-0" key={name}>
              <td className="px-6 py-5 font-semibold text-ink">{name}</td>
              <td className="px-6 py-5 text-slate-600">{engagement}</td>
              <td className={`px-6 py-5 ${status === 'DUE SOON' ? 'text-red-600' : 'text-slate-600'}`}>{date}</td>
              <td className="px-6 py-5">
                <StatusPill status={status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-16 flex items-end justify-between">
        <h2 className="font-serif text-3xl text-ink">Compliance Calendar</h2>
        <a className="flex items-center gap-2 text-xs font-bold tracking-wide text-ink" href="/client-portal/calendar">
          VIEW COMPLIANCE CALENDAR <ArrowRight size={14} />
        </a>
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
          {complianceCalendar.map(([date, req, engagement, status]) => (
            <tr className="border-b border-slate-100 last:border-b-0" key={req}>
              <td className="px-6 py-5 text-slate-600">{date}</td>
              <td className="px-6 py-5 font-semibold text-ink">{req}</td>
              <td className="px-6 py-5 text-slate-600">{engagement}</td>
              <td className="px-6 py-5">
                <StatusPill status={status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-16 grid gap-10 md:grid-cols-2">
        <div>
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-2xl text-ink">Recent Reports</h2>
            <a className="text-xs font-bold tracking-wide text-ink" href="/client-portal/reports">VIEW ALL →</a>
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
              {reports.map(([name, engagement, date]) => (
                <tr className="border-b border-slate-100 last:border-b-0" key={name}>
                  <td className="px-5 py-4 font-semibold text-ink">{name}</td>
                  <td className="px-5 py-4 text-slate-600">{engagement}</td>
                  <td className="px-5 py-4 text-slate-600">{date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-2xl text-ink">Invoices &amp; Payments</h2>
            <a className="text-xs font-bold tracking-wide text-ink" href="/client-portal/invoices">VIEW ALL →</a>
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
              {invoices.map(([ref, date, amount, status]) => (
                <tr className="border-b border-slate-100 last:border-b-0" key={ref}>
                  <td className="px-5 py-4 font-semibold text-ink">{ref}</td>
                  <td className="px-5 py-4 text-slate-600">{date}</td>
                  <td className="px-5 py-4 text-slate-600">{amount}</td>
                  <td className="px-5 py-4">
                    <StatusPill status={status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PortalAssistanceCTA copy="Your PSC Global team is available to help." />
    </>
  );
}
