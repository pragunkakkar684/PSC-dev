import { ChevronLeft, ChevronRight } from 'lucide-react';
import PortalAssistanceCTA from '../../components/PortalAssistanceCTA';

const stats = [
  ['UPCOMING', '8'],
  ['DUE SOON', '3'],
  ['OVERDUE', '1', true],
  ['COMPLETED', '24'],
];

const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const weeks: [number, boolean, { label: string; tone: 'red' | 'blue' | 'slate' } | undefined][][] = [
  [[25, false, undefined], [26, false, undefined], [27, false, undefined], [28, false, undefined], [29, false, undefined], [30, false, undefined], [31, false, undefined]],
  [[1, true, undefined], [2, true, undefined], [3, true, undefined], [4, true, undefined], [5, true, undefined], [6, true, undefined], [7, true, undefined]],
  [[8, true, undefined], [9, true, undefined], [10, true, undefined], [11, true, undefined], [12, true, undefined], [13, true, undefined], [14, true, undefined]],
  [
    [15, true, { label: 'GST Return', tone: 'red' }],
    [16, true, undefined],
    [17, true, undefined],
    [18, true, { label: 'TDS Filing', tone: 'blue' }],
    [19, true, undefined],
    [20, true, undefined],
    [21, true, undefined],
  ],
  [
    [22, true, undefined],
    [23, true, undefined],
    [24, true, { label: 'Corp Tax Review', tone: 'slate' }],
    [25, true, undefined],
    [26, true, undefined],
    [27, true, undefined],
    [28, true, undefined],
  ],
];

const toneStyles: Record<string, string> = {
  red: 'bg-red-100 text-red-700',
  blue: 'bg-sky-100 text-sky-700',
  slate: 'border-l-2 border-slate-400 pl-2 text-slate-600',
};

export default function ClientPortalCalendarPage() {
  return (
    <>
      <h1 className="font-serif text-5xl tracking-tight text-ink">Compliance Calendar</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        Monitor upcoming compliance deadlines and key requirements across your engagements with
        PSC Global.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-4">
        {stats.map(([label, value, alert]) => (
          <div className="border border-slate-200 bg-white p-6" key={label as string}>
            <p className={`text-[10px] font-bold tracking-wide ${alert ? 'text-red-600' : 'text-slate-500'}`}>{label}</p>
            <p className={`mt-3 font-serif text-4xl ${alert ? 'text-red-600' : 'text-ink'}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-8">
        <div className="flex items-center gap-3">
          <button className="border border-slate-200 p-2 text-slate-500">
            <ChevronLeft size={16} />
          </button>
          <h2 className="font-serif text-3xl text-ink">June 2026</h2>
          <button className="border border-slate-200 p-2 text-slate-500">
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex gap-3">
          <select className="border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <option>All Engagements</option>
          </select>
          <select className="border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <option>All Status</option>
          </select>
        </div>
      </div>

      <div className="mt-6 border border-slate-200 bg-white">
        <div className="grid grid-cols-7 border-b border-slate-200 text-[10px] font-bold tracking-wide text-slate-500">
          {weekdays.map((d) => (
            <div className="px-4 py-3" key={d}>{d}</div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div className="grid grid-cols-7 border-b border-slate-100 last:border-b-0" key={wi}>
            {week.map(([day, current, event], di) => (
              <div
                className={`min-h-[110px] border-r border-slate-100 p-3 last:border-r-0 ${current ? 'bg-white' : 'bg-slate-50'}`}
                key={di}
              >
                <p className={`text-sm ${event ? 'font-bold text-red-600' : current ? 'text-ink' : 'text-slate-400'}`}>
                  {day}
                </p>
                {event && (
                  <p className={`mt-2 px-2 py-1 text-[11px] font-medium ${toneStyles[event.tone]}`}>
                    {event.label}
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <PortalAssistanceCTA copy="Our team is available to help clarify any compliance requirements." />
    </>
  );
}
