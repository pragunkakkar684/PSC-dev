import { ArrowRight, Calendar, Search } from 'lucide-react';
import PortalAssistanceCTA from '../../components/PortalAssistanceCTA';

const invoices = [
  ['INV-2026-089', 'Q3 Tax Advisory', 'Oct 15, 2026', 'Nov 14, 2026', '$12,500.00', 'PENDING'],
  ['INV-2026-072', 'M&A Due Diligence - Project Alpha', 'Sep 01, 2026', 'Oct 01, 2026', '$45,000.00', 'OVERDUE'],
  ['INV-2026-045', 'Annual Statutory Audit 2025', 'Jul 10, 2026', 'Aug 09, 2026', '$28,750.00', 'UNPAID'],
  ['INV-2026-012', 'Q1 Tax Advisory', 'Apr 15, 2026', 'May 15, 2026', '$12,500.00', 'PAID'],
  ['INV-2025-288', 'Transfer Pricing Documentation', 'Nov 20, 2025', 'Dec 20, 2025', '$18,200.00', 'PAID'],
];

const paymentStatus = [
  ['INV-2026-089', 'Q3 Tax Advisory', '$12,500.00', 'PROCESSING', 'Oct 16, 2026'],
  ['INV-2026-072', 'M&A Due Diligence - Project Alpha', '$45,000.00', 'ACTION REQUIRED', 'Oct 02, 2026'],
  ['INV-2026-012', 'Q1 Tax Advisory', '$12,500.00', 'CLEARED', 'May 10, 2026'],
];

function InvoiceStatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    OVERDUE: 'text-red-600',
    'ACTION REQUIRED': 'text-red-600',
    UNPAID: 'text-sky-700',
    PENDING: 'text-slate-600',
    PROCESSING: 'text-slate-600',
    PAID: 'text-slate-400',
    CLEARED: 'text-slate-400',
  };
  return <span className={`text-xs font-bold tracking-wide ${styles[status] || 'text-slate-600'}`}>{status}</span>;
}

export default function ClientPortalInvoicesPage() {
  return (
    <>
      <h1 className="font-serif text-5xl tracking-tight text-ink">Invoices</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        View and access invoices related to your PSC Global engagements.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <div className="flex flex-1 items-center gap-2 border border-slate-200 bg-white px-4 py-3">
          <Search size={16} className="text-slate-400" />
          <input className="w-full text-sm outline-none" placeholder="Search invoices..." />
        </div>
        <select className="border border-slate-200 bg-white px-4 py-3 text-xs font-bold tracking-wide text-slate-600">
          <option>ALL ENGAGEMENTS</option>
        </select>
        <select className="border border-slate-200 bg-white px-4 py-3 text-xs font-bold tracking-wide text-slate-600">
          <option>ALL STATUS</option>
        </select>
        <button className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-3 text-xs font-bold tracking-wide text-slate-600">
          <Calendar size={14} /> DATE
        </button>
      </div>

      <div className="mt-10 flex items-end justify-between">
        <h2 className="font-serif text-3xl text-ink">Invoices</h2>
        <div className="flex items-center gap-6">
          <span className="text-xs font-bold tracking-wide text-slate-500">SORT BY: NEWEST</span>
          <a className="flex items-center gap-2 text-xs font-bold tracking-wide text-ink" href="#">
            VIEW ALL <ArrowRight size={14} />
          </a>
        </div>
      </div>
      <table className="mt-4 w-full border border-slate-200 bg-white text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-[10px] font-bold tracking-wide text-slate-500">
            <th className="px-6 py-4">INVOICE</th>
            <th className="px-6 py-4">RELATED ENGAGEMENT</th>
            <th className="px-6 py-4">ISSUE DATE</th>
            <th className="px-6 py-4">DUE DATE</th>
            <th className="px-6 py-4">AMOUNT</th>
            <th className="px-6 py-4">STATUS</th>
            <th className="px-6 py-4">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(([id, engagement, issue, due, amount, status]) => (
            <tr className="border-b border-slate-100 last:border-b-0" key={id}>
              <td className="px-6 py-6 font-semibold text-ink">{id}</td>
              <td className="px-6 py-6 text-slate-600">{engagement}</td>
              <td className="px-6 py-6 text-slate-600">{issue}</td>
              <td className="px-6 py-6 text-slate-600">{due}</td>
              <td className="px-6 py-6 font-semibold text-ink">{amount}</td>
              <td className="px-6 py-6">
                <InvoiceStatusPill status={status} />
              </td>
              <td className="px-6 py-6">
                <a className="text-xs font-bold tracking-wide text-ink" href="#">VIEW →</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-16 font-serif text-3xl text-ink">Payment Status</h2>
      <table className="mt-4 w-full border border-slate-200 bg-white text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-[10px] font-bold tracking-wide text-slate-500">
            <th className="px-6 py-4">INVOICE</th>
            <th className="px-6 py-4">RELATED ENGAGEMENT</th>
            <th className="px-6 py-4">AMOUNT</th>
            <th className="px-6 py-4">STATUS</th>
            <th className="px-6 py-4">LAST UPDATED</th>
          </tr>
        </thead>
        <tbody>
          {paymentStatus.map(([id, engagement, amount, status, updated]) => (
            <tr className="border-b border-slate-100 last:border-b-0" key={id}>
              <td className="px-6 py-6 font-semibold text-ink">{id}</td>
              <td className="px-6 py-6 text-slate-600">{engagement}</td>
              <td className="px-6 py-6 font-semibold text-ink">{amount}</td>
              <td className="px-6 py-6">
                <InvoiceStatusPill status={status} />
              </td>
              <td className="px-6 py-6 text-slate-600">{updated}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <PortalAssistanceCTA copy="Our team is available to help with billing questions." />
    </>
  );
}