import { ArrowRight, Calendar, Clock } from 'lucide-react';
import AnimatedSection from '../../components/AnimatedSection';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import Link from 'next/link';
import {
  getPublicHeroSection,
  getPublicEventBySlug, 
} from '@/lib/queries/public';

type EventAgendaItem = {
  id: string;
  timeLabel: string;
  title: string;
  description: string;
};

type EventWhyAttendItem = {
  title: string;
  description: string;
};

type EventDetail = {
  slug: string;
  eventType: string;
  title: string;
  description: string;
  date: string;
  timeStart: string;
  timezone: string;
  format: string;
  location: string;
  registrationUrl: string;
  imageUrl: string;
  aboutIntro: string;
  aboutParagraphs: string[];
  whyAttend: EventWhyAttendItem[];
  agenda: EventAgendaItem[];
};

import { notFound } from 'next/navigation';

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail: any = await getPublicEventBySlug(slug);

  if (!detail) {
    notFound();
  }

  const formattedDate = detail.date
    ? new Date(detail.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'TBD';

  return (
    <main id="top">
      <SiteHeader />

      {/* HERO */}
      <AnimatedSection className="bg-[#fdf8f3] px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="flex items-center gap-2 font-mono text-xs tracking-[.14em] text-sky-700 uppercase">
            <Link href="/events" className="hover:text-ink">
              EVENTS
            </Link>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">{detail.eventType}</span>
          </p>

          <div className="mt-10 grid items-start gap-12 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <h1 className="max-w-xl font-serif text-6xl leading-[1.05] tracking-[-.03em] text-ink lg:text-7xl">
                {detail.title}
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 lg:text-lg">
                {detail.description}
              </p>

              <div className="mt-8 grid max-w-lg grid-cols-2 gap-x-8 gap-y-6 border-y border-slate-300 py-6 sm:grid-cols-4">
                <div>
                  <p className="font-mono text-[11px] tracking-[.1em] text-slate-500 uppercase">Date</p>
                  <p className="mt-1 text-sm font-bold text-ink">{formattedDate}</p>
                </div>
                <div>
                  <p className="font-mono text-[11px] tracking-[.1em] text-slate-500 uppercase">Time</p>
                  <p className="mt-1 text-sm font-bold text-ink">
                    {detail.timeStart} ({detail.timezone})
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[11px] tracking-[.1em] text-slate-500 uppercase">Format</p>
                  <p className="mt-1 text-sm font-bold text-ink">{detail.platform || detail.eventType || 'Virtual'}</p>
                </div>
                <div>
                  <p className="font-mono text-[11px] tracking-[.1em] text-slate-500 uppercase">Location</p>
                  <p className="mt-1 text-sm font-bold text-ink">{detail.location || 'Online'}</p>
                </div>
              </div>

              {detail.registrationUrl && (
                <a
                  href={detail.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-ink hover:text-sky-700"
                >
                  REGISTER FOR EVENT <ArrowRight size={14} />
                </a>
              )}
            </div>

            {detail.imageUrl && (
              <div className="overflow-hidden">
                <img
                  src={detail.imageUrl}
                  alt={detail.title}
                  className="h-[380px] w-full object-cover lg:h-[480px]"
                />
              </div>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* ABOUT THE EVENT */}
      <AnimatedSection className="bg-slate-100 px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-4xl text-ink lg:text-5xl">About the Event</h2>
              <p className="mt-6 max-w-md text-base leading-7 font-medium text-ink">{detail.aboutIntro || detail.description}</p>
            </div>
            <div className="space-y-6">
              {(detail.aboutParagraphs || []).map((p: any, i: number) => (
                <p key={i} className="text-base leading-7 text-slate-600">
                  {p}
                </p>
              ))}
            </div>
          </div>

          <p className="mt-16 font-mono text-xs tracking-[.14em] text-sky-700 uppercase">Why Attend</p>
          <div className="mt-6 grid gap-8 border-t border-slate-300 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {(detail.whyAttend || []).map((item: any) => (
              <div key={item.title}>
                <h3 className="font-serif text-2xl text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* AGENDA */}
      <AnimatedSection className="bg-[#fdf8f3] px-6 py-24 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.7fr_1.3fr]">
          <h2 className="font-serif text-5xl text-ink lg:text-6xl">Agenda</h2>

          <div>
            {(detail.agenda || []).map((item: any) => (
              <div
                key={item.id}
                className="grid gap-2 border-t border-slate-300 py-8 first:border-t-0 first:pt-0 sm:grid-cols-[110px_1fr] sm:gap-6"
              >
                <p className="flex items-start gap-1.5 pt-1 font-mono text-xs font-bold tracking-[.05em] text-sky-700">
                  <Clock size={12} className="mt-0.5 shrink-0" />
                  {item.timeLabel}
                </p>
                <div>
                  <h3 className="font-serif text-2xl text-ink lg:text-3xl">{item.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 lg:text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  );
}