import { ArrowLeft, Calendar, Clock, Download, MapPin } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import CountdownTimer from '../../components/CountdownTimer';
import RegistrationModal from './RegistrationModal';
import { getPublicEventBySlug, getPublicEvents, buildPageMetadata } from '@/lib/queries/public';

export async function generateStaticParams() {
  const events = await getPublicEvents();
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);

  if (!event) return {};

  return buildPageMetadata('event', slug, {
    title: `${event.title} | PSC Global Events`,
    description: event.description || event.title,
  });
}

function formatDate(date: string | Date | null) {
  if (!date) return 'Date to be announced';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);

  if (!event) notFound();

  return (
    <main id="top">
      <SiteHeader />
      <article>
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
          <Link href="/events" className="inline-flex items-center gap-2 text-xs font-bold tracking-wide text-slate-500 hover:text-ink">
            <ArrowLeft size={14} /> BACK TO EVENTS
          </Link>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-start">
            <div>
              <p className="font-mono text-xs tracking-[.18em] text-slate-500 uppercase">{event.eventType || 'EVENT'}</p>
              <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[1.05] text-ink lg:text-7xl">{event.title}</h1>
              {event.description && <p className="mt-8 max-w-2xl text-base leading-8 text-slate-600 lg:text-lg">{event.description}</p>}

              <div className="mt-10 grid gap-5 border-y border-slate-200 py-6 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="mt-0.5 text-ink" />
                  <div>
                    <p className="font-mono text-[11px] tracking-wide text-slate-500 uppercase">Date</p>
                    <p className="mt-1 text-sm font-bold text-ink">{formatDate(event.date)}</p>
                  </div>
                </div>
                {(event.timeStart || event.timeEnd) && (
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="mt-0.5 text-ink" />
                    <div>
                      <p className="font-mono text-[11px] tracking-wide text-slate-500 uppercase">Time</p>
                      <p className="mt-1 text-sm font-bold text-ink">{event.timeStart}{event.timeEnd ? ` - ${event.timeEnd}` : ''} {event.timezone || ''}</p>
                    </div>
                  </div>
                )}
                {(event.location || event.platform) && (
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="mt-0.5 text-ink" />
                    <div>
                      <p className="font-mono text-[11px] tracking-wide text-slate-500 uppercase">Location</p>
                      <p className="mt-1 text-sm font-bold text-ink">{event.location || event.platform}</p>
                    </div>
                  </div>
                )}
                {event.durationLabel && (
                  <div>
                    <p className="font-mono text-[11px] tracking-wide text-slate-500 uppercase">Duration</p>
                    <p className="mt-1 text-sm font-bold text-ink">{event.durationLabel}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {event.registrationUrl && (
                  <RegistrationModal eventTitle={event.title} />
                )}
                {event.agendaFileUrl && (
                  <a href={event.agendaFileUrl} className="inline-flex items-center gap-2 border border-ink px-5 py-3 text-xs font-bold tracking-wide text-ink hover:bg-slate-100">
                    <Download size={14} /> DOWNLOAD AGENDA
                  </a>
                )}
              </div>
            </div>

            <div>
              {event.imageUrl ? (
                <img src={event.imageUrl} alt={event.title} className="h-[420px] w-full object-cover lg:h-[560px]" />
              ) : (
                <div className="flex h-[420px] items-center justify-center bg-slate-100 lg:h-[560px]">
                  <span className="font-serif text-4xl text-slate-300">PSC GLOBAL</span>
                </div>
              )}
              {event.date && event.status === 'upcoming' && (
                <div className="mt-5 border border-slate-200 bg-slate-50 p-5">
                  <CountdownTimer targetDate={event.date} targetTime={event.timeStart ?? undefined} timezone={event.timezone ?? undefined} />
                </div>
              )}
            </div>
          </div>
        </div>

        {event.agenda.length > 0 && (
          <section className="border-t border-slate-200 bg-slate-50 px-6 py-20 lg:px-10">
            <div className="mx-auto max-w-7xl">
              <h2 className="font-serif text-4xl text-ink">Event Agenda</h2>
              <div className="mt-8 max-w-3xl space-y-5">
                {event.agenda.map((item) => (
                  <div key={item.id} className="grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-[120px_1fr]">
                    <p className="font-mono text-xs tracking-wide text-slate-500">{item.timeLabel || 'SESSION'}</p>
                    <div>
                      <h3 className="text-sm font-bold text-ink">{item.title}</h3>
                      {item.description && <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {event.speakers.length > 0 && (
          <section className="border-t border-slate-200 px-6 py-20 lg:px-10">
            <div className="mx-auto max-w-7xl">
              <h2 className="font-serif text-4xl text-ink">Speakers</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {event.speakers.map((speaker) => (
                  <div key={speaker.id}>
                    {speaker.externalSpeakerImageUrl ? (
                      <img src={speaker.externalSpeakerImageUrl} alt={speaker.externalSpeakerName || 'Event speaker'} className="h-64 w-full object-cover" />
                    ) : (
                      <div className="flex h-64 items-center justify-center bg-slate-100 font-serif text-2xl text-slate-300">PSC GLOBAL</div>
                    )}
                    <h3 className="mt-4 font-serif text-xl text-ink">{speaker.externalSpeakerName || 'PSC Global Speaker'}</h3>
                    {speaker.externalSpeakerRole && <p className="mt-1 text-xs tracking-wide text-slate-500 uppercase">{speaker.externalSpeakerRole}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
      <Footer />
    </main>
  );
}
