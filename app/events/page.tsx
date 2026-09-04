import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  PlayCircle,
  Video,
} from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import CountdownTimer from '../components/CountdownTimer';
import UpcomingEventsGrid from '../components/UpcomingEventsGrid';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublicHeroSection, getPublicEvents, buildPageMetadata } from '@/lib/queries/public';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('page', 'events', {
    title: 'Events Overview | PSC Global',
    description:
      'Join industry leaders and regulatory experts for in-depth webinars, executive briefings, and strategic roundtables.',
  });
}

const defaultEvents = [
  {
    id: 'ev1',
    slug: 'navigating-indias-changing-regulatory-landscape',
    title: 'The 2025 Global Capital Flows & Regulatory Outlook',
    description: 'An executive briefing on anticipated shifts in cross-border investment strategies, emerging regulatory frameworks in key jurisdictions, and strategies for capital preservation in a volatile macroeconomic environment.',
    eventType: 'WEBINAR',
    status: 'upcoming',
    isFeatured: true,
    date: '2024-10-24',
    timeStart: '10:00 AM',
    timeEnd: '12:00 PM',
    timezone: 'EST',
    location: 'Microsoft Teams',
    registrationUrl: '/contact',
    agendaUrl: null,
    agenda: [
      { id: 'a1', timeLabel: '10:00 AM', title: 'Opening Remarks', description: 'Macroeconomic context setting and introduction.' },
      { id: 'a2', timeLabel: '10:15 AM', title: 'Regulatory Update', description: 'Analysis of upcoming compliance shifts in major markets.' },
      { id: 'a3', timeLabel: '10:45 AM', title: 'Industry Perspectives', description: 'Sector-specific implications of capital flow adjustments.' },
      { id: 'a4', timeLabel: '11:15 AM', title: 'Panel Discussion', description: 'Strategic responses to the 2025 outlook.' },
      { id: 'a5', timeLabel: '11:45 AM', title: 'Q&A', description: 'Audience questions and concluding thoughts.' },
    ],
  },
  {
    id: 'ev2',
    slug: 'emerging-markets-southeast-asian-corridor',
    title: 'Emerging Markets: The Southeast Asian Corridor',
    description: 'Strategic entry points and risk mitigation for expansion into rapid-growth ASEAN economies.',
    eventType: 'SEMINAR',
    status: 'upcoming',
    isFeatured: false,
    date: '2024-11-12',
    timeStart: '09:00 AM',
    timeEnd: '11:00 AM',
    duration: '2 HOURS',
    timezone: 'SGT',
    location: 'Singapore',
    registrationUrl: '/contact',
    agenda: [],
  },
  {
    id: 'ev3',
    slug: 'data-privacy-global-compliance-architecture',
    title: 'Data Privacy & Global Compliance Architecture',
    description: 'Structuring multinational operations to adhere to fragmented data sovereignty laws.',
    eventType: 'WEBINAR',
    status: 'upcoming',
    isFeatured: false,
    date: '2024-11-28',
    timeStart: '11:00 AM',
    timeEnd: '12:30 PM',
    duration: '90 MINS',
    timezone: 'GMT',
    location: 'Virtual',
    registrationUrl: '/contact',
    agenda: [],
  },
  {
    id: 'ev4',
    slug: 'cross-border-tax-strategies-2025',
    title: 'Cross-Border Tax Strategies for 2025',
    description: 'Navigating BEPS 2.0 implementation and optimization strategies for corporate treasuries.',
    eventType: 'ROUNDTABLE',
    status: 'upcoming',
    isFeatured: false,
    date: '2024-12-05',
    timeStart: '02:00 PM',
    timeEnd: '05:00 PM',
    duration: '3 HOURS',
    timezone: 'GMT',
    location: 'London',
    registrationUrl: '/contact',
    agenda: [],
  },
];

const defaultSpeakers = [
  { name: 'Eleanor Vance', role: 'Managing Partner, Global Strategy', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=85' },
  { name: 'Marcus Chen', role: 'Head of Regulatory Compliance', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=85' },
  { name: 'David Sterling', role: 'Senior Economic Advisor', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=85' },
  { name: 'Sarah Jenkins', role: 'Partner, Tax Strategy', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=85' },
];

const defaultArchive = [
  {
    id: 'pa1',
    date: 'Sep 15, 2024',
    title: 'Global M&A Trends in Technology',
    description: 'Analyzing recent consolidation waves in the global tech sector and implications for deal structuring.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=85',
    recordingUrl: '/contact',
  },
  {
    id: 'pa2',
    date: 'Aug 28, 2024',
    title: 'Navigating ESG Compliance Mandates',
    description: 'Practical strategies for aligning corporate reporting with evolving European and US ESG frameworks.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=85',
    recordingUrl: '/contact',
  },
];

const continueReading = [
  { tag: 'INSIGHT · CAPITAL MARKETS', title: 'Navigating Currency Volatility in Cross-Border Transactions', href: '/insights' },
  { tag: 'REPORT · REGULATORY', title: 'The 2024 Global Sanctions Compliance Review', href: '/insights' },
  { tag: 'BRIEFING · ESG', title: 'Preparing for Scope 3 Emissions Disclosure Requirements', href: '/insights' },
];

const relatedPracticeAreas = [
  ['Tax Advisory', '/practice-areas'],
  ['Risk & Assurance', '/practice-areas'],
  ['Corporate Law', '/practice-areas'],
  ['Business Advisory', '/practice-areas'],
] as const;

export default async function EventsPage() {
  const [hero, dbEvents] = await Promise.all([
    getPublicHeroSection('events'),
    getPublicEvents(),
  ]);

  const events = dbEvents;
  const featured = events.find((e: any) => e.isFeatured) || events[0];
  const upcomingList = events.filter((e: any) => e.status === 'upcoming' && e.id !== featured?.id);
  const pastList = events.filter((e: any) => e.status === 'past');
  const archive = pastList.length > 0 ? pastList : defaultArchive;

  return (
    <main id="top">
      <SiteHeader />

      {/* HERO */}
      <AnimatedSection className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="font-mono text-xs tracking-[.18em] text-slate-500 uppercase">{hero.eyebrow || 'EXECUTIVE ROUNDTABLES & WEBINARS'}</p>
          <h1 className="mt-4 max-w-lg font-serif text-6xl leading-[1.02] tracking-[-.045em] text-ink sm:text-7xl">
            {hero.heading || 'Conversations That Shape Better Business Decisions.'}
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-600 lg:text-lg">
            {hero.subheading || 'Join industry leaders, regulatory experts, and our strategic advisors for in-depth webinars, seminars, and roundtables designed to navigate complex global markets.'}
          </p>
          <a href="#upcoming" className="mt-8 inline-block border-b border-ink pb-0.5 text-xs font-bold tracking-wide text-ink">
            VIEW UPCOMING EVENTS
          </a>
        </div>
        <div className="relative">
          <img
            className="h-[380px] w-full object-cover lg:h-[480px]"
            src={hero.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=85'}
            alt="Conference hall"
          />
          <div className="absolute -top-5 -right-5 h-16 w-16 border-t border-r border-slate-300" />
          <div className="absolute -bottom-5 -left-5 h-16 w-16 border-b border-l border-slate-300" />
        </div>
      </AnimatedSection>

      {/* FEATURED EVENT */}
      {featured && (
        <AnimatedSection className="border-t border-slate-200 px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between gap-6">
              <p className="flex items-center gap-3 font-mono text-xs tracking-[.18em] text-slate-500 uppercase">
                <span className="h-px w-6 bg-slate-400" /> Featured Event
              </p>
              {featured.date && (
                <div className="hidden sm:block">
                  <CountdownTimer targetDate={featured.date} targetTime={featured.timeStart ?? undefined} timezone={featured.timezone ?? undefined} />
                </div>
              )}
            </div>

            <div className="mt-8 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
              <div>
                <div className="flex flex-wrap items-center gap-5 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {featured.date
                      ? new Date(featured.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
                      : 'TBD'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {featured.timeStart} {featured.timeEnd ? `- ${featured.timeEnd}` : ''} {featured.timezone}
                  </span>
                  {featured.location && (
                    <span className="flex items-center gap-1.5">
                      <Video size={14} />
                      {featured.location}
                    </span>
                  )}
                  <span className="bg-sky-100 px-2.5 py-1 text-[10px] font-bold tracking-wide text-sky-900 uppercase">
                    {featured.eventType}
                  </span>
                </div>

                <Link href={`/events/${featured.slug ?? featured.id}`} className="group mt-6 block max-w-xl">
                  <h2 className="font-serif text-4xl leading-[1.08] text-ink transition-colors group-hover:text-sky-700 lg:text-5xl">
                    {featured.title}
                  </h2>
                </Link>

                <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600 lg:text-base">
                  {featured.description}
                </p>

                {featured.date && (
                  <div className="mt-6 sm:hidden">
                    <CountdownTimer targetDate={featured.date} targetTime={featured.timeStart ?? undefined} timezone={featured.timezone ?? undefined} />
                  </div>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <Link
                    href={`/events/${featured.slug ?? featured.id}`}
                    className="group flex items-center gap-1.5 border-b border-ink pb-0.5 text-xs font-bold tracking-wide text-ink transition-colors hover:border-sky-600 hover:text-sky-700"
                  >
                    VIEW EVENT DETAILS
                    <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                  {featured.registrationUrl && (
                    <Link
                      href={featured.registrationUrl.startsWith('/') ? featured.registrationUrl : '/contact'}
                      className="group flex items-center gap-1.5 text-xs font-bold tracking-wide text-slate-600 hover:text-ink"
                    >
                      REGISTER FOR EVENT
                      <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  )}
                  {(featured as any).agendaUrl && (
                    <a href={(featured as any).agendaUrl} className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-slate-600 hover:text-ink">
                      <Download size={14} /> DOWNLOAD AGENDA
                    </a>
                  )}
                </div>
              </div>

              {featured.agenda && featured.agenda.length > 0 && (
                <div className="bg-slate-50 p-8">
                  <h3 className="font-serif text-2xl text-ink">Agenda Overview</h3>
                  <div className="mt-6 space-y-5">
                    {featured.agenda.map((item: any, i: number) => (
                      <div key={item.id} className="group flex gap-3 border-t border-slate-200 pt-4 first:border-t-0 first:pt-0">
                        <span
                          className={`mt-1 h-2.5 w-2.5 shrink-0 border border-ink transition-colors ${
                            i === 0 ? 'bg-ink' : 'bg-transparent group-hover:bg-ink/30'
                          }`}
                        />
                        <div>
                          <p className="font-mono text-[11px] tracking-wide text-slate-500">{item.timeLabel}</p>
                          <p className="mt-1 text-sm font-bold text-ink uppercase">{item.title}</p>
                          {item.description && <p className="mt-1 text-xs leading-5 text-slate-600">{item.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* SPEAKERS */}
      <AnimatedSection className="bg-slate-50 px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="flex items-center gap-3 font-mono text-xs tracking-[.18em] text-slate-500 uppercase">
            <span className="h-px w-6 bg-slate-400" /> Meet the Speakers
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {defaultSpeakers.map((speaker) => (
              <div key={speaker.name} className="group">
                <div className="relative overflow-hidden">
                  <img
                    className="h-64 w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                    src={speaker.image}
                    alt={speaker.name}
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <ExternalLink size={14} /> CONNECT
                    </span>
                  </div>
                </div>
                <h3 className="mt-4 font-serif text-xl text-ink">{speaker.name}</h3>
                <p className="mt-1 text-xs tracking-wide text-slate-500 uppercase">{speaker.role}</p>
                <Link href="/team" className="mt-2 flex items-center gap-1 text-xs font-bold text-ink">
                  VIEW PROFILE
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* MORE UPCOMING EVENTS */}
      <AnimatedSection id="upcoming" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <p className="flex items-center gap-3 font-mono text-xs tracking-[.18em] text-slate-500 uppercase">
          <span className="h-px w-6 bg-slate-400" /> More Upcoming Events
        </p>
        <div className="mt-10">
          <UpcomingEventsGrid events={upcomingList} />
        </div>
      </AnimatedSection>

      {/* EVENT ARCHIVE */}
      <AnimatedSection className="border-t border-slate-200 px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-3 font-mono text-xs tracking-[.18em] text-slate-500 uppercase">
              <span className="h-px w-6 bg-slate-400" /> Event Archive
            </p>
            <Link href="/events" className="flex items-center gap-1 text-xs font-bold text-ink hover:text-sky-700">
              VIEW ALL EVENTS <ArrowRight size={12} />
            </Link>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {archive.map((ev: any) => (
              <div key={ev.id} className="group flex gap-5">
                <div className="relative h-28 w-40 shrink-0 overflow-hidden">
                  <img
                    className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-110 group-hover:grayscale-0"
                    src={ev.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=85'}
                    alt={ev.title}
                  />
                  {ev.recordingUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-300 group-hover:bg-ink/40">
                      <PlayCircle
                        size={28}
                        className="scale-75 text-white opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-mono text-[11px] tracking-wide text-slate-500 uppercase">{ev.date}</p>
                  <h3 className="mt-1 font-serif text-lg leading-snug text-ink">{ev.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{ev.description}</p>
                  {ev.recordingUrl && (
                    <Link href="/contact" className="mt-2 flex items-center gap-1.5 text-xs font-bold text-ink hover:text-sky-700">
                      <PlayCircle size={14} /> REQUEST RECORDING
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CONTINUE READING / RELATED PRACTICE AREAS */}
      <AnimatedSection className="border-t border-slate-200 bg-slate-50 px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <h3 className="font-serif text-2xl text-ink">Continue Reading</h3>
            <div className="mt-6 space-y-5">
              {continueReading.map((item) => (
                <Link href={item.href} key={item.title} className="group block border-t border-slate-200 pt-4 first:border-t-0 first:pt-0">
                  <p className="font-mono text-[10px] tracking-wide text-slate-500 uppercase">{item.tag}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-ink">
                    {item.title}
                    <ArrowRight size={12} className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </p>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-serif text-2xl text-ink">Related Practice Areas</h3>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {relatedPracticeAreas.map(([label, href]) => (
                <Link
                  href={href}
                  key={label}
                  className="flex items-center justify-between border border-slate-200 bg-white px-4 py-3.5 text-sm font-bold text-ink transition hover:border-ink"
                >
                  {label} <ArrowUpRight size={14} className="text-slate-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="flex flex-col items-center justify-center border-t border-slate-200 px-6 py-24 text-center">
        <h2 className="mx-auto max-w-2xl font-serif text-5xl leading-tight text-ink lg:text-6xl">Join The Conversation</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-600 lg:text-base">
          Stay ahead of market shifts. Register for our upcoming events or schedule a private briefing with our strategic advisory team.
        </p>
        <div className="mt-9 flex justify-center gap-3">
          <a href="#upcoming" className="bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white transition hover:bg-slate-800">
            REGISTER FOR EVENTS
          </a>
          <Link href="/book-consultation" className="border border-ink px-5 py-3 text-xs font-bold tracking-wide text-ink transition hover:bg-slate-100">
            BOOK A CONSULTATION
          </Link>
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  );
}