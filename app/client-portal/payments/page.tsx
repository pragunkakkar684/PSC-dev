import { Search } from 'lucide-react';
import PortalAssistanceCTA from '../../components/PortalAssistanceCTA';

const paymentRecords = [
  ['PAY-2026-041', 'INV-2026-072', 'Annual Audit', '10 Jun 2026', '$2,100', 'Paid'],
  ['PAY-2026-035', 'INV-2026-061', 'M&A Due Diligence', '02 Jun 2026', '$7,500', 'Paid'],
  ['PAY-2026-028', 'INV-2026-048', 'Corporate Compliance', '15 May 2026', '$1,800', 'Paid'],
  ['PAY-2026-019', 'INV-2026-089', 'Q3 Tax Advisory & Compliance', '\u2014', '$4,500', 'Pending'],
];

const paymentSummary = [
  ['June 2026', '3 Payments', '$11,400', 'PROCESSED'],
  ['May 2026', '2 Payments', '$3,900', 'PROCESSED'],
  ['April 2026', '1 Payment', '$1,800', 'PROCESSED'],
];

function PaymentStatusLabel({ status }: { status: string }) {
  return (
    <span className={`text-sm ${status === 'Pending' ? 'text-slate-500' : 'text-ink'}`}>{status}</span>
  );
}

export default function ClientPortalPaymentsPage() {
  return (
    <>
      <h1 className="font-serif text-5xl tracking-tight text-ink">Payments</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        View payment records and payment status associated with your PSC Global engagements.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 border border-slate-200 bg-white px-4 py-3">
          <Search size={16} className="text-slate-400" />
          <input className="w-full text-sm outline-none" placeholder="Search payments..." />
        </div>
        <select className="border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <option>All Engagements</option>
        </select>
        <select className="border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <option>All Status</option>
        </select>
        <select className="border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <option>Sort By</option>
        </select>
      </div>

      <h2 className="mt-10 border-b border-ink pb-3 font-serif text-3xl text-ink" style={{ display: 'inline-block' }}>
        Payment Records
      </h2>
      <table className="mt-4 w-full border-t border-slate-200 bg-white text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-[10px] font-bold tracking-wide text-slate-500">
            <th className="px-6 py-4">REFERENCE</th>
            <th className="px-6 py-4">INVOICE</th>
            <th className="px-6 py-4">ENGAGEMENT</th>
            <th className="px-6 py-4">DATE</th>
            <th className="px-6 py-4">AMOUNT</th>
            <th className="px-6 py-4">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {paymentRecords.map(([ref, invoice, engagement, date, amount, status]) => (
            <tr className="border-b border-slate-100 last:border-b-0" key={ref}>
              <td className="px-6 py-6 font-semibold text-ink">{ref}</td>
              <td className="px-6 py-6 text-slate-600">{invoice}</td>
              <td className="px-6 py-6 text-slate-600">{engagement}</td>
              <td className="px-6 py-6 text-slate-600">{date}</td>
              <td className="px-6 py-6 font-semibold text-ink">{amount}</td>
              <td className="px-6 py-6">
                <PaymentStatusLabel status={status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-16 border-b border-ink pb-3 font-serif text-3xl text-ink" style={{ display: 'inline-block' }}>
        Payment Summary
      </h2>
      <table className="mt-4 w-full border-t border-slate-200 bg-white text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-[10px] font-bold tracking-wide text-slate-500">
            <th className="px-6 py-4">PERIOD</th>
            <th className="px-6 py-4 text-right">PAYMENTS</th>
            <th className="px-6 py-4 text-right">AMOUNT</th>
            <th className="px-6 py-4 text-right">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {paymentSummary.map(([period, payments, amount, status]) => (
            <tr className="border-b border-slate-100 last:border-b-0" key={period}>
              <td className="px-6 py-6 font-semibold text-ink">{period}</td>
              <td className="px-6 py-6 text-right text-slate-600">{payments}</td>
              <td className="px-6 py-6 text-right font-bold text-ink">{amount}</td>
              <td className="px-6 py-6 text-right text-xs font-bold tracking-wide text-slate-600">{status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <PortalAssistanceCTA copy="Our team is available to help with payment questions." />
    </>
  );
}