import { FileSpreadsheet, FileText, Search } from 'lucide-react';
import PortalAssistanceCTA from '../../components/PortalAssistanceCTA';

const stats = [
  ['RECENT DOCUMENTS', '12'],
  ['REPORTS', '5'],
  ['SPREADSHEETS', '4'],
  ['OTHER DOCUMENTS', '3'],
];

const documents = [
  ['Q3 Financial Statements', 'Report', 'Annual Audit', '14 Jun 2026', FileText],
  ['Due Diligence Checklist', 'Spreadsheet', 'M&A Due Diligence', '12 Jun 2026', FileSpreadsheet],
  ['Tax Compliance Review', 'Report', 'Q3 Tax Advisory & Compliance', '10 Jun 2026', FileText],
  ['Engagement Documentation', 'Document', 'Corporate Compliance', '08 Jun 2026', FileText],
];

export default function ClientPortalDocumentsPage() {
  return (
    <>
      <h1 className="font-serif text-5xl tracking-tight text-ink">Documents</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        Securely access and manage documents related to your PSC Global engagements.
      </p>

      <div className="mt-10 grid gap-6 border-t border-slate-200 pt-8 sm:grid-cols-4">
        {stats.map(([label, value], i) => (
          <div className={`${i > 0 ? 'border-l border-slate-200 pl-6' : ''}`} key={label}>
            <p className="text-[10px] font-bold tracking-wide text-slate-500">{label}</p>
            <p className="mt-2 font-serif text-4xl text-ink">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <div className="flex flex-1 items-center gap-2 border border-slate-200 bg-white px-4 py-3">
          <Search size={16} className="text-slate-400" />
          <input className="w-full text-sm outline-none" placeholder="Search documents..." />
        </div>
        <select className="border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <option>All Engagements</option>
        </select>
        <select className="border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <option>All Types</option>
        </select>
        <select className="border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <option>Sort by: Date (Desc)</option>
        </select>
      </div>

      <table className="mt-6 w-full border border-slate-200 bg-white text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-[10px] font-bold tracking-wide text-slate-500">
            <th className="px-6 py-4">DOCUMENT</th>
            <th className="px-6 py-4">TYPE</th>
            <th className="px-6 py-4">RELATED ENGAGEMENT</th>
            <th className="px-6 py-4">DATE</th>
            <th className="px-6 py-4">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {documents.map(([name, type, engagement, date, Icon]: any) => (
            <tr className="border-b border-slate-100 last:border-b-0" key={name}>
              <td className="px-6 py-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center border border-slate-200">
                    <Icon size={16} className="text-slate-500" />
                  </div>
                  <span className="font-serif text-lg text-ink">{name}</span>
                </div>
              </td>
              <td className="px-6 py-6 text-slate-600">{type}</td>
              <td className="px-6 py-6 text-slate-600">{engagement}</td>
              <td className="px-6 py-6 text-slate-600">{date}</td>
              <td className="px-6 py-6">
                <a className="text-xs font-bold tracking-wide text-ink" href="#">
                  VIEW →
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PortalAssistanceCTA copy="Our team is available to help with document queries." />
    </>
  );
}
