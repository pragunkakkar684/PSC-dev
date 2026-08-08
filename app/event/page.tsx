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

const agenda = [
  ['10:00 AM', 'OPENING REMARKS', 'Macroeconomic context setting and introduction.', true],
  ['10:15 AM', 'REGULATORY UPDATE', 'Analysis of upcoming compliance shifts in major markets.', false],
  ['10:45 AM', 'INDUSTRY PERSPECTIVES', 'Sector-specific implications of capital flow adjustments.', false],
  ['11:15 AM', 'PANEL DISCUSSION', 'Strategic responses to the 2025 outlook.', false],
  ['11:45 AM', 'Q&A', 'Audience questions and concluding thoughts.', false],
];

const speakers = [
  ['Eleanor Vance', 'MANAGING PARTNER, GLOBAL STRATEGY', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=85'],
  ['Marcus Chen', 'HEAD OF REGULATORY COMPLIANCE', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85'],
  ['David Sterling', 'SENIOR ECONOMIC ADVISOR', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85'],
  ['Sarah Jenkins', 'PARTNER, TAX STRATEGY', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=85'],
];

const upcomingEvents = [
  ['12', 'NOV', 'SEMINAR', 'Emerging Markets: The Southeast Asian Corridor', 'Strategic entry points and risk mitigation for expansion into rapid-growth ASEAN economies.', '09:00 AM', 'SINGAPORE', '2 HOURS', true],
  ['28', 'NOV', 'WEBINAR', 'Data Privacy & Global Compliance Architecture', 'Structuring multinational operations to adhere to fragmented data sovereignty laws.', '11:00 AM', 'VIRTUAL', '90 MINS', false],
  ['05', 'DEC', 'ROUNDTABLE', 'Cross-Border Tax Strategies for 2025', 'Navigating BEPS 2.0 implementation and optimization strategies for corporate treasuries.', '02:00 PM', 'LONDON', '3 HOURS', false],
];

const archive = [
  ['SEP 15, 2024', 'Global M&A Trends in Technology', 'Analyzing recent consolidation waves in the global tech sector and implications for\u2026', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=85'],
  ['AUG 28, 2024', 'Navigating ESG Compliance Mandates', 'Practical strategies for aligning corporate reporting with evolving European and US ESG\u2026', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=700&q=85'],
];

const continueReading = [
  ['INSIGHT • CAPITAL MARKETS', 'Navigating Currency Volatility in Cross-Border Transactions'],
  ['REPORT • REGULATORY', 'The 2024 Global Sanctions Compliance Review'],
  ['BRIEFING • ESG', 'Preparing for Scope 3 Emissions Disclosure Requirements'],
];

const relatedPractices = ['Corporate Strategy', 'Regulatory Compliance', 'International Tax', 'M&A Advisory'];

export default function EventsPage() {
  return (
    <main id="top">
      <SiteHeader />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10">
        <div>
          <h1 className="max-w-lg font-serif text-5xl leading-[1.02] tracking-[-.04em] text-ink sm:text-6xl">
            Conversations That Shape Better Business Decisions.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-slate-600">
            Join industry leaders, regulatory experts, and our strategic advisors for in-depth
            webinars, seminars, and roundtables designed to navigate complex global markets.
          </p>
          <a href="#featured" className="mt-8 inline-block text-xs font-bold tracking-wide text-ink">
            VIEW UPCOMING EVENTS
          </a>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute -right-3 -top-3 h-10 w-10 border-r border-t border-slate-400" />
          <img
            className="h-[340px] w-full object-cover"
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1100&q=85"
            alt="Boardroom meeting"
          />
          <div className="pointer-events-none absolute -bottom-3 -left-3 h-10 w-10 border-b border-l border-slate-400" />
        </div>
      </section>

      <section id="featured" className="border-t border-slate-200 px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="flex items-center gap-3 text-xs font-bold tracking-wide text-ink">
            <span className="h-px w-8 bg-slate-400" /> FEATURED EVENT
          </p>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <span className="inline-block bg-sky-100 px-3 py-1 text-[10px] font-bold tracking-wide text-sky-800">
                WEBINAR
              </span>
              <p className="mt-5 flex flex-wrap items-center gap-5 text-xs text-slate-600">
                <span className="flex items-center gap-2">
                  <Calendar size={14} /> OCT 24, 2024
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={14} /> 10:00 AM - 12:00 PM EST
                </span>
                <span className="flex items-center gap-2">
                  <Video size={14} /> MICROSOFT TEAMS
                </span>
              </p>
              <h2 className="mt-5 font-serif text-4xl leading-tight text-ink">
                The 2025 Global Capital Flows &amp; Regulatory Outlook
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600">
                An executive briefing on anticipated shifts in cross-border investment
                strategies, emerging regulatory frameworks in key jurisdictions, and
                strategies for capital preservation in a volatile macroeconomic environment.
              </p>
              <div className="mt-7 flex flex-wrap gap-8">
                <a className="flex items-center gap-2 text-xs font-bold tracking-wide text-ink" href="#contact">
                  REGISTER VIA MICROSOFT TEAMS <ArrowRight size={14} />
                </a>
                <a className="flex items-center gap-2 text-xs font-bold tracking-wide text-ink" href="#contact">
                  <Download size={14} /> DOWNLOAD AGENDA
                </a>
              </div>
            </div>

            <div className="bg-[#f3efee] p-8">
              <h3 className="font-serif text-2xl text-ink">Agenda Overview</h3>
              <div className="mt-5 space-y-6 border-t border-slate-300 pt-6">
                {agenda.map(([time, title, copy, active], i) => (
                  <div className="relative border-l border-slate-300 pl-6" key={title}>
                    <span
                      className={`absolute -left-[5px] top-1 h-2.5 w-2.5 border border-ink ${active ? 'bg-ink' : 'bg-[#f3efee]'}`}
                    />
                    <p className="text-xs text-slate-500">{time}</p>
                    <p className="mt-1 text-xs font-bold tracking-wide text-ink">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-100 px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="flex items-center gap-3 text-xs font-bold tracking-wide text-ink">
            <span className="h-px w-8 bg-slate-400" /> MEET THE SPEAKERS
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {speakers.map(([name, role, img]) => (
              <article className="bg-[#fdf9f8]" key={name}>
                <img className="h-72 w-full object-cover grayscale" src={img} alt={name} />
                <div className="p-5">
                  <h3 className="font-serif text-xl text-ink">{name}</h3>
                  <p className="mt-1 text-xs font-bold tracking-wide text-slate-500">{role}</p>
                  <a className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold tracking-wide text-ink" href="#contact">
                    VIEW PROFILE <ArrowRight size={12} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="flex items-center gap-3 text-xs font-bold tracking-wide text-ink">
            <span className="h-px w-8 bg-slate-400" /> MORE UPCOMING EVENTS
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {upcomingEvents.map(([day, month, tag, title, copy, time, location, duration, highlighted]) => (
              <article
                className={`bg-[#fdf9f8] p-8 ${highlighted ? 'border border-ink' : 'border border-slate-200'}`}
                key={title}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-serif text-4xl text-ink">{day}</p>
                    <p className="text-xs font-bold tracking-wide text-slate-500">{month}</p>
                  </div>
                  <span className="border border-slate-300 px-3 py-1 text-[10px] font-bold tracking-wide text-slate-600">
                    {tag}
                  </span>
                </div>
                <h3 className="mt-6 font-serif text-2xl leading-tight text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
                <p className="mt-6 flex items-center gap-2 border-t border-slate-200 pt-5 text-xs text-slate-500">
                  {time} <span>|</span> {location} <span>|</span> {duration}
                </p>
                <a className="mt-5 flex items-center justify-between border-t border-slate-200 pt-5 text-xs font-bold tracking-wide text-ink" href="#contact">
                  VIEW DETAILS <ArrowRight size={14} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-3 text-xs font-bold tracking-wide text-ink">
              <span className="h-px w-8 bg-slate-400" /> EVENT ARCHIVE
            </p>
            <a className="flex items-center gap-2 text-xs font-bold tracking-wide text-ink" href="#contact">
              VIEW ALL PAST EVENTS <ArrowRight size={14} />
            </a>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {archive.map(([date, title, copy, img]) => (
              <div className="flex gap-6" key={title}>
                <img className="h-40 w-48 shrink-0 object-cover grayscale" src={img} alt={title} />
                <div>
                  <p className="text-xs text-slate-500">{date}</p>
                  <h3 className="mt-2 font-serif text-2xl leading-tight text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
                  <a className="mt-3 inline-flex items-center gap-2 text-xs font-bold tracking-wide text-ink" href="#contact">
                    <PlayCircle size={16} /> WATCH RECORDING
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fdf9f8] px-6 py-16 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-ink">Continue Reading</h2>
            <div className="mt-6 divide-y divide-slate-200 border-t border-slate-200">
              {continueReading.map(([tag, title]) => (
                <a href="#insights" className="block py-5" key={title}>
                  <p className="text-[10px] font-bold tracking-wide text-slate-500">{tag}</p>
                  <p className="mt-2 font-serif text-xl text-ink">{title}</p>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-serif text-3xl text-ink">Related Practice Areas</h2>
            <div className="mt-6 grid gap-4 border-t border-slate-300 pt-6 sm:grid-cols-2">
              {relatedPractices.map((name) => (
                <a
                  href="#practice-areas"
                  className="flex items-center justify-between bg-white p-5 text-sm font-medium text-ink"
                  key={name}
                >
                  {name} <ArrowUpRight size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="px-6 py-24 text-center">
        <h2 className="font-serif text-5xl text-ink">Join The Conversation</h2>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-slate-600">
          Stay ahead of market shifts. Register for our upcoming events or schedule a private
          briefing with our strategic advisory team.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <a href="#featured" className="bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white">
            REGISTER FOR EVENTS
          </a>
          <a href="#top" className="border border-ink px-5 py-3 text-xs font-bold tracking-wide">
            BOOK A CONSULTATION
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}