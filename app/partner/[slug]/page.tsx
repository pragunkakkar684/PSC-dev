import { Briefcase, FileText, Globe, Landmark, ShieldCheck, Tags, CheckCircle2 } from 'lucide-react';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import { db } from '@/lib/db';
import { teamMembers, teamMemberExpertise } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { ALLOWED_ICONS } from '@/app/admin/(dashboard)/components/IconPicker';
import { notFound } from 'next/navigation';

// Placeholder profiles shown only when the database has no matching row.
// These slugs match the fallback team members used across the homepage,
// Contact, Industries, and Our Team pages, so their "view profile" links
// never 404 while the team table is empty.
//
// `journey` is optional per-profile copy for the "Professional Journey &
// Approach" section, shaped as two columns of paragraphs (matches the
// static demo page's layout). Profiles without their own `journey` fall
// back to `genericJourney` below — add per-partner copy here (or, better,
// a `journey` column on the teamMembers table) as real content comes in.
const defaultMembersBySlug: Record<
  string,
  {
    name: string;
    roleTitle: string;
    location: string;
    yearsExperience: string;
    quote: string;
    shortBio: string;
    imageUrl: string;
    journey?: string[][];
  }
> = {
  'julian-vance': {
    name: 'Dr. Julian Vance',
    roleTitle: 'Founder & CEO',
    location: 'LONDON / NEW YORK',
    yearsExperience: '25+ YEARS EXPERIENCE',
    quote: 'Architecting Resilience for Global Enterprises.',
    shortBio:
      'Dr. Vance specializes in navigating complex regulatory environments and executing high-stakes cross-border transactions for Fortune 500 companies.',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85',
    journey: [
      [
        'With over two decades of dedicated practice, Dr. Vance has established himself as a preeminent authority in international corporate structuring. His tenure spans key economic hubs, allowing him to cultivate a nuanced understanding of geopolitical impacts on multinational commerce.',
        'Prior to founding PSC Global, he served as Chief Legal Counsel for a major European financial institution, where he orchestrated several of the most significant mergers in the sector\u2019s history during the post-2008 regulatory overhaul.',
      ],
      [
        'His leadership philosophy is grounded in anticipation rather than reaction. He believes that true advisory value lies in identifying systemic vulnerabilities before they manifest as crises, architecting structural resilience into the core of enterprise operations.',
        'When engaging with clients, Dr. Vance demands rigorous analytical integrity, insisting on comprehensive risk modeling paired with actionable, pragmatic execution strategies that align with long-term corporate objectives.',
      ],
    ],
  },
  'helena-thorne': {
    name: 'Helena Thorne',
    roleTitle: 'Partner, Digital Transformation',
    location: 'LONDON',
    yearsExperience: '18+ YEARS EXPERIENCE',
    quote: 'Bridging Legacy Infrastructure and What Comes Next.',
    shortBio:
      'Helena leads our transformation labs, bridging the gap between legacy infrastructure and emergent AI-driven business models.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=85',
  },
  'marcus-oh': {
    name: 'Marcus Oh',
    roleTitle: 'Principal, Global Logistics',
    location: 'SINGAPORE',
    yearsExperience: '20+ YEARS EXPERIENCE',
    quote: 'Precision at Scale, Across Every Border.',
    shortBio:
      'Marcus specializes in complex logistics and supply chain optimization, having managed projects exceeding $4B in annual spend.',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85',
  },
  'sarah-jenkins': {
    name: 'Sarah Jenkins',
    roleTitle: 'Partner, Tax Strategy',
    location: 'NEW YORK',
    yearsExperience: '16+ YEARS EXPERIENCE',
    quote: 'Fiscal Planning Is Long-Range Strategy, Not Paperwork.',
    shortBio: 'Sarah advises multinational clients on cross-border tax structuring and long-term fiscal planning.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=85',
  },
  'eleanor-vance': {
    name: 'Eleanor Vance',
    roleTitle: 'Senior Partner, Corporate Law',
    location: 'LONDON',
    yearsExperience: '19+ YEARS EXPERIENCE',
    quote: 'Governance Is the Architecture Beneath the Deal.',
    shortBio: 'Eleanor leads our corporate law practice, specializing in complex M&A and governance structuring.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=85',
  },
  'david-chen': {
    name: 'David Chen',
    roleTitle: 'Partner, Risk & Assurance',
    location: 'NEW YORK',
    yearsExperience: '17+ YEARS EXPERIENCE',
    quote: 'Trust Is Earned Through the Audit Trail.',
    shortBio: 'David oversees audit and compliance engagements for institutional clients across global markets.',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85',
  },
  'amira-rossi': {
    name: 'Amira Rossi',
    roleTitle: 'Partner, Business Advisory',
    location: 'DUBAI',
    yearsExperience: '14+ YEARS EXPERIENCE',
    quote: 'Growth Without Structure Is Just Motion.',
    shortBio: 'Amira advises growth-stage enterprises on operational strategy and organizational design.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=85',
  },
  'thomas-reid': {
    name: 'Thomas Reid',
    roleTitle: 'Partner, Tax Strategy',
    location: 'LONDON',
    yearsExperience: '21+ YEARS EXPERIENCE',
    quote: 'The Right Structure Pays for Itself.',
    shortBio: 'Thomas structures multinational tax planning and transfer pricing strategies for clients operating across 15+ jurisdictions.',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85',
  },
  'priya-nair': {
    name: 'Priya Nair',
    roleTitle: 'Partner, Mergers & Acquisitions',
    location: 'SINGAPORE',
    yearsExperience: '15+ YEARS EXPERIENCE',
    quote: 'Integration Planning Starts on Day One.',
    shortBio: 'Priya leads deal execution on complex cross-border mergers, from due diligence through post-merger integration.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=85',
  },
  'lucas-bennett': {
    name: 'Lucas Bennett',
    roleTitle: 'Partner, Regulatory Affairs',
    location: 'DUBAI',
    yearsExperience: '13+ YEARS EXPERIENCE',
    quote: 'Compliance Is a Design Problem, Not a Checklist.',
    shortBio: 'Lucas guides clients through multi-jurisdictional regulatory approval processes and ongoing compliance obligations.',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85',
  },
  'robert-sterling': {
    name: 'Robert Sterling',
    roleTitle: 'Senior Advisor, Global Markets',
    location: 'NEW YORK',
    yearsExperience: '40+ YEARS EXPERIENCE',
    quote: 'Markets Reward Patience Over Prediction.',
    shortBio:
      'Robert brings over 40 years of institutional experience guiding Fortune 500 companies through complex market transitions and cross-border expansions.',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85',
  },
  'evelyn-hayes': {
    name: 'Dr. Evelyn Hayes',
    roleTitle: 'Senior Advisor, Regulatory Affairs',
    location: 'LONDON',
    yearsExperience: '30+ YEARS EXPERIENCE',
    quote: 'Anticipate the Policy Shift Before It Lands.',
    shortBio:
      'A former chief regulator, Dr. Hayes advises our structural teams on anticipating policy shifts and building resilient compliance frameworks.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=85',
  },
};

const defaultExpertiseList = [
  { iconName: 'Landmark', title: 'Corporate Law', description: 'Structuring sophisticated multinational entities and ensuring robust governance frameworks.' },
  { iconName: 'FileText', title: 'Tax Advisory', description: 'Optimizing cross-border tax strategies while ensuring strict compliance with emerging global standards.' },
  { iconName: 'ShieldCheck', title: 'Risk & Assurance', description: 'Developing comprehensive risk mitigation protocols for volatile regulatory environments.' },
  { iconName: 'Briefcase', title: 'Business Advisory', description: 'Strategic counsel for market entry, expansion, and operational restructuring.' },
  { iconName: 'Globe', title: 'Cross-border Transactions', description: 'Navigating complex jurisdictional conflicts in international deal-making.' },
  { iconName: 'Tags', title: 'M&A', description: 'End-to-end management of high-value mergers and acquisitions.' },
];

// Generic two-column "Professional Journey" copy used whenever a partner has no
// specific `journey` content of their own (via DB or the fallback map above).
// Written to read sensibly for any partner rather than naming a specific person.
const genericJourney = [
  [
    'With years of dedicated practice, this advisor has built a strong reputation within their specialty, developing a nuanced understanding of the regulatory and commercial dynamics that shape client outcomes.',
    'Prior to joining PSC Global, they held senior positions at respected institutions, contributing to some of the most significant transactions and structural initiatives in their field.',
  ],
  [
    'Their approach is grounded in anticipation rather than reaction — identifying systemic vulnerabilities before they manifest as crises, and architecting resilience into the core of client operations.',
    'When engaging with clients, they insist on rigorous analytical integrity, pairing comprehensive risk modeling with actionable, pragmatic strategies aligned to long-term objectives.',
  ],
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [member] = await db.select().from(teamMembers).where(eq(teamMembers.slug, slug)).limit(1);
  const fallback = defaultMembersBySlug[slug];
  const resolved = member || fallback;

  if (resolved) {
    return {
      title: `${resolved.name} — ${resolved.roleTitle || 'Partner'} | PSC Global`,
      description: ('shortBio' in resolved && resolved.shortBio) || ('quote' in resolved && (resolved as any).quote) || 'Executive advisory partner profile at PSC Global.',
    };
  }
  return {
    title: 'Partner Profile | PSC Global',
  };
}

export default async function DynamicPartnerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [member] = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.slug, slug))
    .limit(1);

  const fallback = defaultMembersBySlug[slug];

  // Only 404 when there's no DB row AND no matching placeholder profile.
  if (!member && !fallback) {
    notFound();
  }

  const name = member?.name ?? fallback?.name ?? 'Dr. Julian Vance';
  const roleTitle = member?.roleTitle ?? fallback?.roleTitle ?? 'Founder & CEO / Senior Partner';
  const location = member?.location ?? fallback?.location ?? 'LONDON / NEW YORK';
  const yearsExperience = member?.yearsExperience ?? fallback?.yearsExperience ?? '25+ YEARS EXPERIENCE';
  const quote = member?.quote ?? fallback?.quote ?? 'Architecting Resilience for Global Enterprises.';
  const shortBio =
    member?.shortBio ??
    fallback?.shortBio ??
    'Dr. Vance specializes in navigating complex regulatory environments and executing high-stakes cross-border transactions for Fortune 500 companies.';
  const imageUrl =
    member?.imageUrl ??
    fallback?.imageUrl ??
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85';
  // `member` (a live DB row) has no journey column today — this is wired up so that
  // once one is added to the schema, real per-partner journey copy will be picked up
  // automatically ahead of the static fallback and generic text.
  const journey = (member as { journey?: string[][] })?.journey ?? fallback?.journey ?? genericJourney;

  let expertiseList = [];
  if (member) {
    expertiseList = await db
      .select()
      .from(teamMemberExpertise)
      .where(eq(teamMemberExpertise.teamMemberId, member.id))
      .orderBy(asc(teamMemberExpertise.sortOrder));
  } else {
    expertiseList = defaultExpertiseList;
  }

  return (
    <main id="top">
      <SiteHeader />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10">
        <img
          className="h-[560px] w-full object-cover"
          src={imageUrl}
          alt={name}
        />
        <div>
          <p className="flex items-center gap-2 text-xs font-medium text-slate-500">
            {location} <span>|</span> {yearsExperience}
          </p>
          <h1 className="mt-4 font-serif text-6xl tracking-[-.03em] text-ink">{name}</h1>
          <p className="mt-4 text-base font-medium text-slate-600">{roleTitle}</p>

          <div className="mt-6 max-w-xl border-t border-slate-200" />

          {quote && (
            <h2 className="mt-8 font-serif text-3xl leading-tight text-ink">
              &quot;{quote}&quot;
            </h2>
          )}
          {shortBio && (
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
              {shortBio}
            </p>
          )}

          <div className="mt-8 flex gap-3">
            <a href="#contact" className="bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white">
              SCHEDULE A DISCUSSION
            </a>
            <a href="#contact" className="border border-ink px-5 py-3 text-xs font-bold tracking-wide">
              BOOK A CONSULTATION
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[280px_1fr]">
          <h2 className="font-serif text-4xl leading-tight text-ink">
            Professional Journey &amp; Approach
          </h2>
          <div className="grid gap-10 md:grid-cols-2">
            {journey.map((paragraphs, i) => (
              <div className="space-y-5" key={i}>
                {paragraphs.map((p) => (
                  <p className="text-sm leading-7 text-slate-600" key={p.slice(0, 20)}>
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {expertiseList.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <h2 className="font-serif text-4xl text-ink">Areas of Expertise</h2>
          <div className="mt-6 border-t border-slate-200" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {expertiseList.map((item, idx) => {
              const IconComp = (item.iconName && ALLOWED_ICONS[item.iconName]) || CheckCircle2;
              return (
                <article className="bg-[#fdf9f8] p-8" key={idx}>
                  <IconComp className="text-ink" size={22} strokeWidth={1.5} />
                  <h3 className="mt-5 font-serif text-2xl text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section id="contact" className="bg-navy px-6 py-24 text-center text-white">
        <h2 className="mx-auto max-w-3xl font-serif text-5xl leading-tight">
          Let&apos;s Discuss Your Business Challenges.
        </h2>
        <div className="mt-9 flex justify-center gap-3">
          <a href="#top" className="bg-white px-5 py-3 text-xs font-bold tracking-wide text-navy">
            SCHEDULE A DISCUSSION
          </a>
          <a href="#top" className="border border-white px-5 py-3 text-xs font-bold tracking-wide">
            CONTACT PSC
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}