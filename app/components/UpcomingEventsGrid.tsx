'use client';

import { useState } from 'react';
import { ArrowRight, Calendar as CalendarIcon, Mic, Users, Video } from 'lucide-react';
import Link from 'next/link';

const TYPE_META: Record<string, { icon: any; accent: string }> = {
  WEBINAR: { icon: Video, accent: 'bg-sky-500' },
  SEMINAR: { icon: Users, accent: 'bg-amber-500' },
  ROUNDTABLE: { icon: Mic, accent: 'bg-emerald-600' },
};

function formatDate(date?: string) {
  if (!date) return { day: '—', month: 'TBD' };
  const d = new Date(date);
  return {
    day: d.getDate(),
    month: d.toLocaleString('default', { month: 'short' }).toUpperCase(),
  };
}

export default function UpcomingEventsGrid({ events }: { events: any[] }) {
  const types = Array.from(new Set(events.map((e) => e.eventType).filter(Boolean)));
  const [active, setActive] = useState('ALL');
  const filtered = active === 'ALL' ? events : events.filter((e) => e.eventType === active);

  const filters = ['ALL', ...types];

  return (
    <div>
      {filters.length > 2 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`border px-4 py-1.5 text-[11px] font-bold tracking-wide uppercase transition-colors ${
                active === f
                  ? 'border-ink bg-ink text-white'
                  : 'border-slate-200 text-slate-500 hover:border-ink hover:text-ink'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {filtered.map((ev, i) => {
          const { day, month } = formatDate(ev.date);
          const meta = TYPE_META[ev.eventType] || { icon: CalendarIcon, accent: 'bg-slate-400' };
          const Icon = meta.icon;
          return (
            <div
              key={ev.id}
              className={`group relative flex flex-col justify-between overflow-hidden border bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-[0_16px_32px_-16px_rgba(15,23,42,0.2)] ${
                i === 0 && active === 'ALL' ? 'border-ink' : 'border-slate-200'
              }`}
            >
              <span
                className={`absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${meta.accent}`}
              />
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-serif text-3xl text-ink">{day}</p>
                    <p className="font-mono text-[11px] tracking-wide text-slate-500 uppercase">{month}</p>
                  </div>
                  <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 text-[10px] font-bold tracking-wide text-slate-700 uppercase">
                    <Icon size={11} /> {ev.eventType}
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-xl leading-snug text-ink">{ev.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{ev.description}</p>
              </div>
              <div>
                <p className="mt-6 text-xs text-slate-500">
                  {ev.timeStart} · {ev.location} {ev.duration ? `· ${ev.duration}` : ''}
                </p>
                <Link href={`/events/${ev.id}`} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-ink">
                  VIEW DETAILS
                  <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-sm text-slate-500">
          No {active.toLowerCase()} events on the calendar right now — check back soon.
        </p>
      )}
    </div>
  );
}