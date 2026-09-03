import { ArrowDown, ArrowRight } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublicHeroSection, getPublicTeamMembers, buildPageMetadata } from '@/lib/queries/public';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('page', 'team', {
    title: 'Leadership & Team | PSC Global',
    description:
      'Meet our multidisciplinary team of Chartered Accountants, legal professionals, tax strategists, and business consultants.',
  });
}

const philosophyPoints = [
  ['INSTITUTIONAL INTEGRITY', 'Our advisory model is built on the premise that complex challenges cannot be solved in isolation.'],
  ['LONG-TERM RELATIONSHIPS', 'We cultivate long-term partnerships with our clients, acting as a steady hand through market transitions.'],
  ['MULTIDISCIPLINARY COLLABORATION', 'Our collaborative approach ensures every strategic recommendation is vetted through multiple lenses.'],
  ['TRUSTED ADVISORY', 'This holistic approach transforms traditional consulting into a trusted partnership that endures across generations.'],
];

const disciplines = [
  ['Risk & Assurance', 'Fortifying structural integrity through meticulous audit, compliance, and proactive risk mitigation strategies.', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=85', 'right'],
  ['Tax Advisory', 'Optimizing corporate structures with strategic tax planning and international compliance frameworks.', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85', 'left'],
  ['Corporate Law', 'Navigating complex M&A, structural reorganizations, and governance with robust legal foresight.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85', 'right'],
];

const closingPoints = [
  ['Integrated Expertise', 'We fuse diverse professional disciplines into a single, cohesive strategy, ensuring no structural vulnerability goes unaddressed.'],
  ['Industry Experience', 'Decades of combined institutional experience across global markets, providing deep situational fluency for complex challenges.'],
  ['Trusted Relationships', 'Built on discretion, rigor, and long-term partnership, we are the quiet force behind sustained corporate excellence.'],
];

const defaultTeam = [
  { id: '1', slug: 'julian-vance', name: 'Dr. Julian Vance', roleTitle: 'Founder & CEO', category: 'leadership', shortBio: 'With over three decades of experience in structural economics, Dr. Vance has advised four of the world’s top ten sovereign wealth funds.', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85' },
  { id: '2', slug: 'helena-thorne', name: 'Helena Thorne', roleTitle: 'Partner, Digital Transformation', category: 'leadership', shortBio: 'Helena leads our transformation labs, bridging the gap between legacy infrastructure and emergent AI-driven business models.', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=85' },
  { id: '3', slug: 'marcus-oh', name: 'Marcus Oh', roleTitle: 'Principal, Global Logistics', category: 'leadership', shortBio: 'Marcus specializes in complex logistics and supply chain optimization, having managed projects exceeding $4B in annual spend.', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85' },
  { id: '4', slug: 'sarah-jenkins', name: 'Sarah Jenkins', roleTitle: 'Partner, Tax Strategy', category: 'leadership', shortBio: 'Sarah advises multinational clients on cross-border tax structuring and long-term fiscal planning.', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=85' },
  { id: '5', slug: 'eleanor-vance', name: 'Eleanor Vance', roleTitle: 'Senior Partner', specialty: 'Corporate Law', category: 'partner', shortBio: 'Eleanor leads our corporate law practice, specializing in complex M&A and governance structuring.', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=85' },
  { id: '6', slug: 'david-chen', name: 'David Chen', roleTitle: 'Partner', specialty: 'Risk & Assurance', category: 'partner', shortBio: 'David oversees audit and compliance engagements for institutional clients across global markets.', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85' },
  { id: '7', slug: 'amira-rossi', name: 'Amira Rossi', roleTitle: 'Partner', specialty: 'Business Advisory', category: 'partner', shortBio: 'Amira advises growth-stage enterprises on operational strategy and organizational design.', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=85' },
  { id: '8', slug: 'robert-sterling', name: 'Robert Sterling', roleTitle: 'Senior Advisor, Global Markets', category: 'mentor', shortBio: 'Robert brings over 40 years of institutional experience guiding Fortune 500 companies through complex market transitions and cross-border expansions.', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=85' },
  { id: '9', slug: 'evelyn-hayes', name: 'Dr. Evelyn Hayes', roleTitle: 'Senior Advisor, Regulatory Affairs', category: 'mentor', shortBio: 'A former chief regulator, Dr. Hayes advises our structural teams on anticipating policy shifts and building resilient compliance frameworks.', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=85' },
];

export default async function OurTeamPage() {
  const [hero, dbTeam] = await Promise.all([
    getPublicHeroSection('team'),
    getPublicTeamMembers(),
  ]);

  const team = dbTeam.length > 1 ? dbTeam : defaultTeam;
  const leadership = team.filter((m) => m.category === 'leadership');
  const partnersList = team.filter((m) => m.category === 'partner');
  const mentors = team.filter((m) => m.category === 'mentor' || m.category === 'advisor');

  return (
    <main id="top">
      <SiteHeader />

      {/* HERO */}
      <AnimatedSection className="relative flex h-[calc(100vh-88px)] items-end overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={hero.imageUrl || 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=85'}
          alt="PSC Global team meeting"
        />
        <div className="absolute inset-0 bg-navy/60" />
        <div className="relative mx-auto w-full max-w-7xl px-6 py-20 text-white lg:px-10">
          <p className="font-mono text-xs tracking-[.18em] text-slate-200 uppercase">{hero.eyebrow || 'OUR TEAM'}</p>
          <h1 className="mt-4 max-w-2xl font-serif text-6xl leading-[1.02] tracking-[-.045em] sm:text-7xl">
            {hero.heading || 'Meet The Experts Behind PSC Global.'}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-slate-200 lg:text-lg">
            {hero.subheading || 'Our multidisciplinary team of Chartered Accountants, legal professionals, tax strategists, and business consultants works together to solve complex business challenges with clarity and confidence.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#leadership"
              className="inline-flex items-center gap-3 bg-white px-5 py-3 text-xs font-bold text-ink transition hover:bg-slate-100"
            >
              MEET OUR PARTNERS <ArrowDown size={14} />
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border border-white px-5 py-3 text-xs font-bold text-white transition hover:bg-white hover:text-ink"
            >
              BOOK A CONSULTATION
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* PHILOSOPHY */}
      <AnimatedSection className="border-t border-slate-200 px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-4xl leading-tight text-ink lg:text-5xl">
            A Philosophy Rooted in Structural Integrity
          </h2>
          <p className="mx-auto mt-10 max-w-2xl font-serif text-2xl italic leading-snug text-slate-700 lg:text-3xl">
            &ldquo;Strong businesses are built on thoughtful advice, enduring relationships and
            uncompromising integrity.&rdquo;
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-6xl gap-10 border-t border-slate-200 pt-10 text-left sm:grid-cols-2 lg:grid-cols-4">
          {philosophyPoints.map(([title, copy]) => (
            <div key={title}>
              <b className="text-xs tracking-widest text-slate-500">{title}</b>
              <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* LEADERSHIP */}
      <AnimatedSection id="leadership" className="mx-auto max-w-7xl border-t border-slate-200 px-6 py-24 lg:px-10">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-5xl text-ink lg:text-6xl">Leadership</h2>
          <Link href="/team" className="hidden items-center gap-2 text-xs font-bold tracking-wide hover:underline md:flex">
            VIEW ALL MEMBERS <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {(leadership.length > 0 ? leadership : team).map((m) => (
            <article key={m.id} className="profile-card group">
              <Link href={`/partner/${m.slug}`}>
                <img
                  className="h-72 w-full object-cover grayscale transition duration-300 group-hover:grayscale-0"
                  src={m.imageUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85'}
                  alt={m.name}
                />
                <h3 className="mt-4 font-serif text-2xl text-ink transition-colors group-hover:text-sky-800">{m.name}</h3>
                <p className="mt-1 text-xs font-bold tracking-wide text-slate-500 uppercase">{m.roleTitle}</p>
              </Link>
            </article>
          ))}
        </div>
      </AnimatedSection>

      {/* PARTNERS */}
      {partnersList.length > 0 && (
        <AnimatedSection className="mx-auto max-w-7xl border-t border-slate-200 px-6 py-24 lg:px-10">
          <h2 className="border-b border-slate-200 pb-8 font-serif text-5xl text-ink lg:text-6xl">Partners</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {partnersList.map((m) => (
              <article key={m.id} className="profile-card">
                <Link href={`/partner/${m.slug}`} className="group block">
                  <img
                    className="h-72 w-full object-cover grayscale transition duration-300 group-hover:grayscale-0"
                    src={m.imageUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=85'}
                    alt={m.name}
                  />
                  <h3 className="mt-4 font-serif text-2xl text-ink transition-colors group-hover:text-sky-800">{m.name}</h3>
                  <p className="mt-1 text-xs font-bold tracking-wide text-slate-500 uppercase">{m.roleTitle}</p>
                  {'specialty' in m && m.specialty ? (
                    <p className="mt-1 text-sm font-medium text-sky-800">{m.specialty as string}</p>
                  ) : null}
                  <span className="mt-3 inline-flex items-center gap-2 text-xs font-bold tracking-wide text-ink">
                    VIEW PROFILE <ArrowRight size={12} />
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </AnimatedSection>
      )}

      {/* MENTORS */}
      {mentors.length > 0 && (
        <AnimatedSection className="border-t border-slate-200 bg-[#fdf9f8] px-6 py-24 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-5xl text-ink lg:text-6xl">Mentors</h2>
            <div className="mt-12 grid gap-x-10 gap-y-14 md:grid-cols-2">
              {mentors.map((m) => (
                <article className="profile-card flex flex-col gap-6 sm:flex-row sm:items-start" key={m.id}>
                  <img
                    className="h-48 w-full shrink-0 object-cover grayscale sm:w-44"
                    src={m.imageUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=85'}
                    alt={m.name}
                  />
                  <div>
                    <h3 className="font-serif text-2xl text-ink lg:text-3xl">{m.name}</h3>
                    <p className="mt-1 text-xs font-bold tracking-wide text-slate-500 uppercase">{m.roleTitle}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{m.shortBio}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* DISCIPLINES */}
      <AnimatedSection className="mx-auto max-w-7xl border-t border-slate-200 px-6 py-24 lg:px-10">
        <h2 className="text-center font-serif text-5xl text-ink lg:text-6xl">Expertise Across Disciplines</h2>
        <div className="mt-16 divide-y divide-slate-200">
          {disciplines.map(([title, copy, image, align]) => (
            <div
              className={`flex flex-col gap-8 py-12 first:pt-0 last:pb-0 md:items-center ${
                align === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'
              }`}
              key={title}
            >
              <img className="h-64 w-full object-cover md:h-80 md:w-1/2" src={image} alt={title} />
              <div className="md:w-1/2">
                <h3 className="font-serif text-3xl text-ink lg:text-4xl">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600 lg:text-base">{copy}</p>
                <Link href="/practice-areas" className="mt-5 inline-flex items-center gap-2 text-xs font-bold tracking-wide text-ink hover:underline">
                  EXPLORE <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* CLOSING STATEMENT */}
      <AnimatedSection className="border-t border-slate-700/60 bg-navy px-6 py-20 text-white lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-3">
          {closingPoints.map(([title, copy]) => (
            <div key={title}>
              <h3 className="font-serif text-2xl">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <h2 className="font-serif text-5xl leading-tight text-ink lg:text-6xl">
          Let&apos;s Start The Conversation.
        </h2>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/contact" className="bg-ink px-5 py-3 text-xs font-bold text-white transition hover:bg-slate-800">
            BOOK A CONSULTATION
          </Link>
          <Link href="/team" className="border border-ink px-5 py-3 text-xs font-bold text-ink transition hover:bg-slate-100">
            MEET OUR EXPERTS
          </Link>
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  );
}