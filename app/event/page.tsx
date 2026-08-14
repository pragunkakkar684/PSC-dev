import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clock,
  Download,
  PlayCircle,
  Video,
} from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import Link from 'next/link';
import { getPublicHeroSection, getPublicEvents } from '@/lib/queries/public';

export default async function EventsPage() {
  const [hero, dbEvents] = await Promise.all([
    getPublicHeroSection('events'),
    getPublicEvents(),
  ]);

  const featured = dbEvents.find((e) => e.isFeatured) || dbEvents[0];
  const upcomingList = dbEvents.filter((e) => e.status === 'upcoming');
  const pastList = dbEvents.filter((e) => e.status === 'past');

  return (
    <main id="top">
      <SiteHeader />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="font-mono text-[10px] tracking-[.18em] text-slate-500 uppercase">{hero.eyebrow || 'EXECUTIVE ROUNDTABLES & WEBINARS'}</p>
          <h1 className="mt-4 max-w-lg font-serif text-5xl leading-[1.02] tracking-[-.04em] text-ink sm:text-6xl">
            {hero.heading || 'Conversations That Shape Better Business Decisions.'}
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-slate-600">
            {hero.subheading || 'Join industry leaders, regulatory experts, and our strategic advisors for in-depth webinars, seminars, and roundtables designed to navigate complex global markets.'}
          </p>
        </div>
        <img
          className="h-[380px] w-full object-cover"
          src={hero.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=85'}
          alt="Conference hall"
        />
      </section>

      {/* Featured Main Event */}
      {featured && (
        <section className="bg-navy px-6 py-20 text-white lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] tracking-[.18em] text-sky-300 uppercase">
                {featured.eventType} · {featured.status.toUpperCase()}
              </span>
            </div>

            <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight">
              {featured.title}
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              {featured.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-6 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-sky-400" />
                <span>{featured.date ? new Date(featured.date).toLocaleDateString() : 'TBD'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-sky-400" />
                <span>{featured.timeStart} {featured.timeEnd ? `- ${featured.timeEnd}` : ''} ({featured.timezone || 'UTC'})</span>
              </div>
              {featured.location && (
                <div className="flex items-center gap-2">
                  <Video size={16} className="text-sky-400" />
                  <span>{featured.location}</span>
                </div>
              )}
            </div>

            {featured.registrationUrl && (
              <a
                href={featured.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 bg-white px-6 py-3.5 text-xs font-bold text-ink transition hover:bg-slate-100"
              >
                REGISTER FOR EVENT <ArrowUpRight size={16} />
              </a>
            )}

            {/* Agenda Items */}
            {featured.agenda && featured.agenda.length > 0 && (
              <div className="mt-12 border-t border-slate-700/80 pt-8">
                <h3 className="font-serif text-2xl mb-6">Event Agenda</h3>
                <div className="space-y-4">
                  {featured.agenda.map((item) => (
                    <div key={item.id} className="flex gap-4 items-start border-b border-slate-800 pb-3">
                      <span className="font-mono text-xs text-sky-300 w-24 shrink-0">{item.timeLabel}</span>
                      <div>
                        <div className="text-sm font-bold">{item.title}</div>
                        {item.description && <div className="text-xs text-slate-400 mt-0.5">{item.description}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Upcoming Events List */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <h2 className="font-serif text-4xl text-ink">Upcoming Global Events</h2>
        <div className="mt-10 space-y-6">
          {upcomingList.map((ev) => (
            <div key={ev.id} className="border border-slate-200 bg-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition">
              <div className="flex gap-6 items-start">
                <div className="flex flex-col items-center justify-center bg-slate-100 p-4 min-w-[70px] text-center rounded">
                  <span className="font-serif text-2xl font-bold text-ink">{ev.date ? new Date(ev.date).getDate() : '—'}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{ev.date ? new Date(ev.date).toLocaleString('default', { month: 'short' }) : 'TBD'}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold tracking-widest px-2 py-0.5 bg-sky-100 text-sky-900 rounded uppercase">
                      {ev.eventType}
                    </span>
                    <span className="text-xs text-slate-500">{ev.location || 'Virtual Platform'}</span>
                  </div>
                  <h3 className="mt-2 font-serif text-2xl text-ink">{ev.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-slate-600 max-w-2xl">{ev.description}</p>
                </div>
              </div>

              {ev.registrationUrl && (
                <a
                  href={ev.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-ink text-white px-5 py-3 text-xs font-bold shrink-0 self-start md:self-center hover:bg-slate-800 transition"
                >
                  REGISTER NOW →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}