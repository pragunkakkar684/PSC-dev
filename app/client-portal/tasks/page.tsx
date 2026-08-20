import { AlertCircle, ArrowRight, Search } from 'lucide-react';
import PortalAssistanceCTA from '../../components/PortalAssistanceCTA';

const stats = [
  ['OPEN TASKS', '12'],
  ['DUE SOON', '3'],
  ['OVERDUE', '2', true],
  ['COMPLETED', '24'],
];

const tasks = [
  ['Submit Q3 Trial Balance', 'Q3 Tax Advisory & Compliance', 'Document Submission', '20 Aug 2026', 'UPCOMING', false],
  ['Review Draft Audit Plan', 'Annual Audit', 'Review', '18 Aug 2026', 'DUE SOON', false],
  ['Provide Director KYC Documents', 'Corporate Compliance', 'Document Submission', '15 Aug 2026', 'OVERDUE', true],
  ['Approve Due Diligence Checklist', 'M&A Due Diligence', 'Approval', '24 Aug 2026', 'UPCOMING', false],
];

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'DUE SOON': 'bg-sky-50 text-sky-700 border border-sky-200',
    OVERDUE: 'bg-red-50 text-red-600 border border-red-200',
    UPCOMING: 'bg-slate-100 text-slate-600',
  };
  return (
    <span className={`inline-block px-3 py-1 text-[10px] font-bold tracking-wide ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
}

export default function ClientPortalTasksPage() {
  return (
    <>
      <h1 className="font-serif text-5xl tracking-tight text-ink">Tasks</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        View and manage actions required across your active PSC Global engagements.
      </p>

      <div className="mt-10 grid gap-6 border-y border-slate-200 py-8 sm:grid-cols-4">
        {stats.map(([label, value, alert], i) => (
          <div className={`px-6 ${i > 0 ? 'border-l border-slate-200' : ''}`} key={label as string}>
            <p className={`flex items-center gap-2 text-[10px] font-bold tracking-wide ${alert ? 'text-red-600' : 'text-slate-500'}`}>
              {alert && <span className="h-1.5 w-1.5 rounded-full bg-red-600" />}
              {label}
            </p>
            <p className={`mt-3 font-serif text-4xl ${alert ? 'text-red-600' : 'text-ink'}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <div className="flex flex-1 items-center gap-2 border border-slate-200 bg-white px-4 py-3">
          <Search size={16} className="text-slate-400" />
          <input className="w-full text-sm outline-none" placeholder="Search tasks..." />
        </div>
        <select className="border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <option>All Engagements</option>
        </select>
        <select className="border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <option>All Status</option>
        </select>
      </div>

      <table className="mt-6 w-full border border-slate-200 bg-white text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-[10px] font-bold tracking-wide text-slate-500">
            <th className="px-6 py-4">TASK</th>
            <th className="px-6 py-4">ENGAGEMENT</th>
            <th className="px-6 py-4">CATEGORY</th>
            <th className="px-6 py-4">DUE DATE</th>
            <th className="px-6 py-4">STATUS</th>
            <th className="px-6 py-4">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(([name, engagement, category, date, status, overdue]) => (
            <tr className={`border-b border-slate-100 last:border-b-0 ${overdue ? 'bg-red-50/40' : ''}`} key={name as string}>
              <td className="px-6 py-6 font-semibold text-ink">
                <span className="flex items-center gap-2">
                  {overdue && <AlertCircle size={15} className="text-red-600" />}
                  <span className={overdue ? 'text-red-600' : 'text-ink'}>{name}</span>
                </span>
              </td>
              <td className="px-6 py-6 text-slate-600">{engagement}</td>
              <td className="px-6 py-6 text-slate-600">{category}</td>
              <td className={`px-6 py-6 ${overdue ? 'font-semibold text-red-600' : 'text-slate-600'}`}>{date}</td>
              <td className="px-6 py-6">
                <StatusPill status={status as string} />
              </td>
              <td className="px-6 py-6">
                <a className="flex items-center gap-1 text-xs font-bold tracking-wide text-ink" href="#">
                  VIEW TASK <ArrowRight size={13} />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PortalAssistanceCTA copy="Our team is available to help clarify any tasks or requirements." />
    </>
  );
}
