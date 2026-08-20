import { ArrowRight, FileText, Lock } from 'lucide-react';
import PortalAssistanceCTA from '../../components/PortalAssistanceCTA';

const reports = [
  ['Q2 Audit Summary', 'Annual Audit', 'Audit Report', '15 Jun 2026', 'Available'],
  ['Tax Strategy Review', 'Q3 Tax Advisory & Compliance', 'Advisory Report', '01 Jun 2026', 'Available'],
  ['Due Diligence Findings', 'M&A Due Diligence', 'Due Diligence Report', '28 May 2026', 'Available'],
  ['Compliance Review', 'Corporate Compliance', 'Compliance Report', '20 May 2026', 'Available'],
  ['Financial Review', 'Financial Advisory', 'Financial Report', '15 May 2026', 'Available'],
];

const access = [
  ['Q2 Audit Summary', 'Annual Audit', '15 Jun 2026'],
  ['Tax Strategy Review', 'Q3 Tax Advisory & Compliance', '01 Jun 2026'],
  ['Due Diligence Findings', 'M&A Due Diligence', '28 May 2026'],
  ['Compliance Review', 'Corporate Compliance', '20 May 2026'],
  ['Financial Review', 'Financial Advisory', '15 May 2026'],
];

export default function ClientPortalReportsPage() {
  return (
    <>
      <h1 className="font-serif text-5xl tracking-tight text-ink">Reports</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        Access reports and deliverables related to your PSC Global engagements.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <div className="flex flex-1 items-center gap-2 border border-slate-200 bg-white px-4 py-3">
          <input className="w-full text-sm outline-none" placeholder="Search reports..." />
        </div>
        <select className="border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <option>All Engagements</option>
        </select>
        <select className="border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <option>All Report Types</option>
        </select>
        <select className="border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <option>Sort By</option>
        </select>
      </div>

      <h2 className="mt-10 border-b border-ink pb-3 font-serif text-3xl text-ink" style={{ display: 'inline-block' }}>
        Available Reports
      </h2>
      <table className="mt-4 w-full border-t border-slate-200 bg-white text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-[10px] font-bold tracking-wide text-slate-500">
            <th className="px-6 py-4">REPORT</th>
            <th className="px-6 py-4">RELATED ENGAGEMENT</th>
            <th className="px-6 py-4">REPORT TYPE</th>
            <th className="px-6 py-4">DATE</th>
            <th className="px-6 py-4">STATUS</th>
            <th className="px-6 py-4">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(([name, engagement, type, date, status]) => (
            <tr className="border-b border-slate-100 last:border-b-0" key={name}>
              <td className="px-6 py-6">
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-slate-400" />
                  <span className="font-semibold text-ink">{name}</span>
                </div>
              </td>
              <td className="px-6 py-6 text-slate-600">{engagement}</td>
              <td className="px-6 py-6 text-slate-600">{type}</td>
              <td className="px-6 py-6 text-slate-600">{date}</td>
              <td className="px-6 py-6 text-slate-600">{status}</td>
              <td className="px-6 py-6">
                <a className="flex items-center gap-1 text-xs font-bold tracking-wide text-ink" href="#">
                  VIEW <ArrowRight size={13} />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-16 border-b border-ink pb-3 font-serif text-3xl text-ink" style={{ display: 'inline-block' }}>
        Report Access
      </h2>
      <table className="mt-4 w-full border-t border-slate-200 bg-white text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-[10px] font-bold tracking-wide text-slate-500">
            <th className="px-6 py-4">REPORT</th>
            <th className="px-6 py-4">ENGAGEMENT</th>
            <th className="px-6 py-4">ISSUED</th>
            <th className="px-6 py-4">ACCESS</th>
          </tr>
        </thead>
        <tbody>
          {access.map(([name, engagement, issued]) => (
            <tr className="border-b border-slate-100 last:border-b-0" key={name}>
              <td className="px-6 py-6">
                <div className="flex items-center gap-3">
                  <Lock size={14} className="text-slate-400" />
                  <span className="font-semibold text-ink">{name}</span>
                </div>
              </td>
              <td className="px-6 py-6 text-slate-600">{engagement}</td>
              <td className="px-6 py-6 text-slate-600">{issued}</td>
              <td className="px-6 py-6">
                <a className="text-xs font-bold tracking-wide text-ink" href="#">MANAGE</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PortalAssistanceCTA copy="Our team is available to help with reports and deliverables." />
    </>
  );
}