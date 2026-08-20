import { ArrowRight, Eye, Search } from 'lucide-react';
import PortalAssistanceCTA from '../../components/PortalAssistanceCTA';

const stats = [
  ['ACTIVE', '3'],
  ['IN PROGRESS', '1'],
  ['PENDING', '1'],
  ['COMPLETED', '4'],
];

const engagements = [
  ['Q3 Tax Advisory & Compliance', 'Tax', 'Priya Sharma', 'ACTIVE'],
  ['Annual Audit', 'Audit & Assurance', 'Marcus Sterling', 'ACTIVE'],
  ['M&A Due Diligence', 'Business Advisory', 'Elena Moretti', 'IN PROGRESS'],
  ['Corporate Compliance', 'Corporate Law', 'David Chen', 'PENDING'],
];

const activity = [
  ['12 JUN 2026', 'Compliance document uploaded'],
  ['10 JUN 2026', 'Audit review completed'],
  ['08 JUN 2026', 'Engagement milestone updated'],
];

function StatusPill({ status }: { status: string }) {
  return (
    <span className="inline-block bg-slate-100 px-3 py-1 text-[10px] font-bold tracking-wide text-slate-600">
      {status}
    </span>
  );
}

export default function ClientPortalEngagementsPage() {
  return (
    <>
      <h1 className="font-serif text-5xl tracking-tight text-ink">My Engagements</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        Track the status, progress and latest activity across your engagements with PSC Global.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value]) => (
          <div className="border border-slate-200 bg-white p-6" key={label}>
            <p className="text-[10px] font-bold tracking-wide text-slate-500">{label}</p>
            <p className="mt-3 font-serif text-4xl text-ink">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-1 items-center gap-2 border border-slate-200 bg-white px-4 py-3">
              <Search size={16} className="text-slate-400" />
              <input className="w-full text-sm outline-none" placeholder="Search engagements..." />
            </div>
            <select className="border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              <option>All Status</option>
            </select>
            <select className="border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              <option>All Practice Areas</option>
            </select>
          </div>

          <table className="mt-6 w-full border border-slate-200 bg-white text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-bold tracking-wide text-slate-500">
                <th className="px-6 py-4">ENGAGEMENT</th>
                <th className="px-6 py-4">PRACTICE AREA</th>
                <th className="px-6 py-4">ENGAGEMENT LEAD</th>
                <th className="px-6 py-4">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {engagements.map(([name, area, lead, status]) => (
                <tr className="border-b border-slate-100 last:border-b-0" key={name}>
                  <td className="px-6 py-6 font-semibold text-ink">{name}</td>
                  <td className="px-6 py-6 text-slate-600">{area}</td>
                  <td className="px-6 py-6 text-slate-600">{lead}</td>
                  <td className="px-6 py-6">
                    <StatusPill status={status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-8">
          <div className="bg-navy p-6 text-white">
            <p className="flex items-center gap-2 text-[10px] font-bold tracking-wide text-slate-300">
              ENGAGEMENT SPOTLIGHT <Eye size={13} />
            </p>
            <h3 className="mt-4 font-serif text-2xl leading-tight">Q3 Tax Advisory &amp; Compliance</h3>

            <div className="mt-6 space-y-4 border-t border-slate-700 pt-5">
              <div>
                <p className="text-[10px] font-bold tracking-wide text-slate-400">PRACTICE AREA</p>
                <p className="mt-1 text-sm">Tax Advisory</p>
              </div>
              <div className="border-t border-slate-700 pt-4">
                <p className="text-[10px] font-bold tracking-wide text-slate-400">STATUS</p>
                <p className="mt-1 text-sm">Active</p>
              </div>
              <div className="border-t border-slate-700 pt-4">
                <p className="text-[10px] font-bold tracking-wide text-slate-400">ENGAGEMENT LEAD</p>
                <p className="mt-1 text-sm">Priya Sharma</p>
              </div>
              <div className="border-t border-slate-700 pt-4">
                <p className="text-[10px] font-bold tracking-wide text-slate-400">LAST UPDATED</p>
                <p className="mt-1 text-sm">12 Jun 2026</p>
              </div>
              <div className="border-t border-slate-700 pt-4">
                <p className="text-[10px] font-bold tracking-wide text-slate-400">NEXT MILESTONE</p>
                <p className="mt-1 text-sm">Quarterly compliance review</p>
              </div>
            </div>

            <a href="#" className="mt-6 flex items-center justify-center gap-2 bg-white px-5 py-3 text-xs font-bold tracking-wide text-navy">
              VIEW ENGAGEMENT DETAILS <ArrowRight size={14} />
            </a>
          </div>

          <div className="border border-slate-200 bg-white p-6">
            <h3 className="font-serif text-2xl text-ink">Recent Activity</h3>
            <div className="mt-5 space-y-5 border-t border-slate-200 pt-5">
              {activity.map(([date, copy]) => (
                <div className="flex gap-3" key={copy}>
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-ink" />
                  <div>
                    <p className="text-[10px] font-bold tracking-wide text-slate-400">{date}</p>
                    <p className="mt-1 text-sm text-ink">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <PortalAssistanceCTA
        title="Need help with an engagement?"
        copy="Connect with your engagement lead or technical support."
      />
    </>
  );
}
