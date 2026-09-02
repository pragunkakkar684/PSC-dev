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

const defaultEventDetails: Record<string, EventDetail> = {
  'navigating-indias-changing-regulatory-landscape': {
    slug: 'navigating-indias-changing-regulatory-landscape',
    eventType: 'WEBINAR',
    title: "Navigating India's Changing Regulatory Landscape",
    description:
      'A critical briefing for senior executives on adapting to new compliance mandates, mitigating operational risks, and ensuring long-term business resilience in dynamic markets.',
    date: '2026-10-24',
    timeStart: '04:00 PM',
    timezone: 'IST',
    format: 'Online',
    location: 'Microsoft Teams',
    registrationUrl: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1000&q=85',
    aboutIntro:
      'The regulatory environment in India is undergoing significant transformation. Understanding these shifts is paramount for maintaining compliance and securing competitive advantage.',
    aboutParagraphs: [
      'This exclusive webinar brings together our leading regulatory experts to dissect the latest legislative updates and their practical implications for multinational corporations operating within the Indian subcontinent.',
      'We will delve into recent amendments in corporate law, taxation shifts, and new mandates for ESG reporting. The discussion is designed to move beyond theoretical analysis, offering actionable strategies for risk mitigation.',
      'Attendees will gain a comprehensive understanding of how to align their internal compliance frameworks with the evolving external landscape, ensuring seamless operations and strategic growth.',
    ],
    whyAttend: [
      {
        title: 'Insight',
        description: 'Gain immediate clarity on complex regulatory shifts and their timeline for implementation.',
      },
      {
        title: 'Expertise',
        description: 'Hear directly from senior partners who shape compliance strategies for Fortune 500 companies.',
      },
      {
        title: 'Perspective',
        description: 'Acquire practical frameworks for translating legal requirements into operational protocols.',
      },
      {
        title: 'Connection',
        description: 'Engage in a high-level Q&A session alongside peers facing similar regulatory challenges.',
      },
    ],
    agenda: [
      {
        id: 'a1',
        timeLabel: '04:00 PM',
        title: 'Welcome & Introduction',
        description: 'Setting the stage for the discussion and outlining key objectives.',
      },
      {
        id: 'a2',
        timeLabel: '04:10 PM',
        title: 'The Evolving Regulatory Landscape',
        description: 'A deep dive into recent legislative changes affecting corporate governance and compliance.',
      },
      {
        id: 'a3',
        timeLabel: '04:40 PM',
        title: 'Strategic Adaptation & Risk Mitigation',
        description: 'Practical methodologies for aligning internal operations with new external mandates.',
      },
      {
        id: 'a4',
        timeLabel: '05:10 PM',
        title: 'Q&A and Closing Remarks',
        description: 'Open floor for executive questions followed by final conclusions.',
      },
    ],
  },

  'emerging-markets-southeast-asian-corridor': {
    slug: 'emerging-markets-southeast-asian-corridor',
    eventType: 'SEMINAR',
    title: 'Emerging Markets: The Southeast Asian Corridor',
    description:
      'Strategic entry points and risk mitigation for expansion into rapid-growth ASEAN economies.',
    date: '2026-11-12',
    timeStart: '09:00 AM',
    timezone: 'SGT',
    format: 'In-Person',
    location: 'Singapore',
    registrationUrl: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=85',
    aboutIntro:
      'ASEAN economies are entering a new phase of growth, and market entry strategy is more nuanced than ever.',
    aboutParagraphs: [
      'This seminar walks through the practical realities of entering Southeast Asian markets — from regulatory entry points to local partnership structures.',
      'We cover country-specific case studies across Vietnam, Indonesia, and Thailand, highlighting where recent growth has outpaced existing risk frameworks.',
      'Attendees leave with a working framework for evaluating expansion opportunities against operational and political risk.',
    ],
    whyAttend: [
      {
        title: 'Access',
        description: 'Direct insight from advisors who structure market-entry deals across ASEAN.',
      },
      {
        title: 'Timing',
        description: 'Understand which corridors are open now versus still maturing.',
      },
      {
        title: 'Risk',
        description: 'Frameworks for balancing growth opportunity against political and currency risk.',
      },
      {
        title: 'Network',
        description: 'Connect with peers evaluating similar expansion timelines.',
      },
    ],
    agenda: [
      {
        id: 'a1',
        timeLabel: '09:00 AM',
        title: 'Welcome & Regional Overview',
        description: 'Framing the current ASEAN growth cycle.',
      },
      {
        id: 'a2',
        timeLabel: '09:20 AM',
        title: 'Country Deep Dives',
        description: 'Vietnam, Indonesia, and Thailand entry considerations.',
      },
      {
        id: 'a3',
        timeLabel: '10:00 AM',
        title: 'Structuring Local Partnerships',
        description: 'Joint venture and ownership structures that work in practice.',
      },
      {
        id: 'a4',
        timeLabel: '10:40 AM',
        title: 'Q&A',
        description: 'Open discussion and closing remarks.',
      },
    ],
  },

  'data-privacy-global-compliance-architecture': {
    slug: 'data-privacy-global-compliance-architecture',
    eventType: 'WEBINAR',
    title: 'Data Privacy & Global Compliance Architecture',
    description:
      'Structuring multinational operations to adhere to fragmented data sovereignty laws.',
    date: '2026-11-28',
    timeStart: '11:00 AM',
    timezone: 'GMT',
    format: 'Online',
    location: 'Virtual',
    registrationUrl: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=85',
    aboutIntro:
      'Data sovereignty laws are diverging fast across jurisdictions, creating real architectural constraints for global operators.',
    aboutParagraphs: [
      'This webinar breaks down how leading multinationals are restructuring data flows to satisfy conflicting regional privacy regimes.',
      "We examine GDPR, India's DPDP Act, and emerging US state-level frameworks, and where they create direct conflicts for cross-border data transfer.",
      'Attendees will walk away with a practical checklist for auditing current data architecture against upcoming compliance deadlines.',
    ],
    whyAttend: [
      {
        title: 'Clarity',
        description: 'Cut through fragmented, sometimes conflicting international privacy rules.',
      },
      {
        title: 'Architecture',
        description: 'Practical patterns for structuring compliant cross-border data flows.',
      },
      {
        title: 'Timelines',
        description: 'Know which deadlines matter most in the next 12 months.',
      },
      {
        title: 'Q&A',
        description: 'Bring your specific architecture questions to our compliance leads.',
      },
    ],
    agenda: [
      {
        id: 'a1',
        timeLabel: '11:00 AM',
        title: 'Welcome & Landscape Overview',
        description: 'Where global privacy law stands today.',
      },
      {
        id: 'a2',
        timeLabel: '11:15 AM',
        title: 'Regional Deep Dive',
        description: 'GDPR, DPDP Act, and US state frameworks compared.',
      },
      {
        id: 'a3',
        timeLabel: '11:50 AM',
        title: 'Architecture Patterns',
        description: 'Data residency and transfer mechanisms that hold up under scrutiny.',
      },
      {
        id: 'a4',
        timeLabel: '12:15 PM',
        title: 'Q&A and Closing',
        description: 'Audience questions and wrap-up.',
      },
    ],
  },

  'cross-border-tax-strategies-2025': {
    slug: 'cross-border-tax-strategies-2025',
    eventType: 'ROUNDTABLE',
    title: 'Cross-Border Tax Strategies for 2025',
    description:
      'Navigating BEPS 2.0 implementation and optimization strategies for corporate treasuries.',
    date: '2026-12-05',
    timeStart: '02:00 PM',
    timezone: 'GMT',
    format: 'In-Person',
    location: 'London',
    registrationUrl: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=85',
    aboutIntro:
      'BEPS 2.0 implementation is reshaping how corporate treasuries plan for cross-border tax exposure.',
    aboutParagraphs: [
      'This roundtable brings together tax strategy partners to unpack the practical mechanics of Pillar One and Pillar Two implementation.',
      'We focus on treasury-level decisions: where to hold IP, how to structure intercompany financing, and how top-up tax exposure changes planning.',
      'Discussion is closed-door and peer-driven, designed for treasury and tax leads actively modeling 2025 exposure.',
    ],
    whyAttend: [
      {
        title: 'Depth',
        description: 'Go beyond headline BEPS coverage into treasury-level implementation detail.',
      },
      {
        title: 'Peers',
        description: 'Compare notes with tax leads facing the same Pillar Two exposure questions.',
      },
      {
        title: 'Modeling',
        description: 'Practical approaches to modeling top-up tax under different structures.',
      },
      {
        title: 'Privacy',
        description: 'A closed-door format for candid, specific discussion.',
      },
    ],
    agenda: [
      {
        id: 'a1',
        timeLabel: '02:00 PM',
        title: 'Welcome & Framing',
        description: 'Where BEPS 2.0 implementation stands globally.',
      },
      {
        id: 'a2',
        timeLabel: '02:20 PM',
        title: 'Pillar One & Two Mechanics',
        description: 'Treasury implications of the current implementation timeline.',
      },
      {
        id: 'a3',
        timeLabel: '03:15 PM',
        title: 'Structuring Roundtable',
        description: 'Open discussion on IP location and intercompany financing.',
      },
      {
        id: 'a4',
        timeLabel: '04:15 PM',
        title: 'Closing & Next Steps',
        description: 'Key takeaways and follow-up resources.',
      },
    ],
  },
};

const fallbackSlug = 'navigating-indias-changing-regulatory-landscape';

export default async function EventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [hero, dbDetail] = await Promise.all([
    getPublicHeroSection('events'),
    getPublicEventBySlug(params.slug),
  ]);

  const fallback = defaultEventDetails[params.slug] ?? defaultEventDetails[fallbackSlug];
  const detail = dbDetail || fallback;

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
                  <p className="mt-1 text-sm font-bold text-ink">{detail.format}</p>
                </div>
                <div>
                  <p className="font-mono text-[11px] tracking-[.1em] text-slate-500 uppercase">Location</p>
                  <p className="mt-1 text-sm font-bold text-ink">{detail.location}</p>
                </div>
              </div>

              <a
                href={detail.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-ink hover:text-sky-700"
              >
                REGISTER FOR EVENT <ArrowRight size={14} />
              </a>
            </div>

            <div className="overflow-hidden">
              <img
                src={detail.imageUrl}
                alt={detail.title}
                className="h-[380px] w-full object-cover lg:h-[480px]"
              />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ABOUT THE EVENT */}
      <AnimatedSection className="bg-slate-100 px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-4xl text-ink lg:text-5xl">About the Event</h2>
              <p className="mt-6 max-w-md text-base leading-7 font-medium text-ink">{detail.aboutIntro}</p>
            </div>
            <div className="space-y-6">
              {detail.aboutParagraphs.map((p, i) => (
                <p key={i} className="text-base leading-7 text-slate-600">
                  {p}
                </p>
              ))}
            </div>
          </div>

          <p className="mt-16 font-mono text-xs tracking-[.14em] text-sky-700 uppercase">Why Attend</p>
          <div className="mt-6 grid gap-8 border-t border-slate-300 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {detail.whyAttend.map((item) => (
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
            {detail.agenda.map((item) => (
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