import { ArrowDown, ArrowRight } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import Link from 'next/link';
import { getPublicHeroSection, getPublicTeamMembers } from '@/lib/queries/public';

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

export default async function OurTeamPage() {
  const [hero, dbTeam] = await Promise.all([
    getPublicHeroSection('team'),
    getPublicTeamMembers(),
  ]);

  const partners = dbTeam.filter((m) => m.category === 'partner' || m.category === 'leadership');
  const mentors = dbTeam.filter((m) => m.category === 'mentor' || m.category === 'advisor');

  return (
    <main id="top">
      <SiteHeader />

      <section className="relative flex min-h-[560px] items-end overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={hero.imageUrl || 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=85'}
          alt="PSC Global team meeting"
        />
        <div className="absolute inset-0 bg-navy/60" />
        <div className="relative mx-auto w-full max-w-7xl px-6 py-16 text-white lg:px-10">
          <p className="font-mono text-[10px] tracking-[.18em] text-slate-200 uppercase">{hero.eyebrow || 'OUR TEAM'}</p>
          <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[1.02] tracking-[-.04em] sm:text-6xl">
            {hero.heading || 'Meet The Experts Behind PSC Global.'}
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-7 text-slate-200">
            {hero.subheading || 'Our multidisciplinary team of Chartered Accountants, legal professionals, tax strategists, and corporate advisors bring decades of institutional experience.'}
          </p>
          <a
            href="#leadership"
            className="mt-8 inline-flex items-center gap-3 bg-white px-5 py-3 text-xs font-bold text-ink transition hover:bg-slate-100"
          >
            EXPLORE LEADERSHIP <ArrowDown size={14} />
          </a>
        </div>
      </section>

      {/* Leadership & Partners */}
      <section id="leadership" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <p className="text-center font-mono text-[10px] tracking-[.18em] text-slate-500">
          EXECUTIVE STEWARDSHIP
        </p>
        <h2 className="mt-4 text-center font-serif text-4xl text-ink">Leadership &amp; Partners</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(partners.length > 0 ? partners : dbTeam).map((m) => (
            <article key={m.id} className="group border border-slate-200 bg-white p-4 transition hover:shadow-xl">
              <Link href={`/partner/${m.slug}`}>
                <div className="relative overflow-hidden">
                  <img
                    className="h-64 w-full object-cover grayscale transition duration-300 group-hover:grayscale-0"
                    src={m.imageUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85'}
                    alt={m.name}
                  />
                  <span className="absolute left-2 top-2 bg-navy px-2 py-0.5 text-[8px] font-bold tracking-widest text-white uppercase">
                    {m.category}
                  </span>
                </div>
                <h3 className="mt-4 font-serif text-xl text-ink group-hover:text-sky-800 transition-colors">{m.name}</h3>
                <p className="mt-1 text-[10px] font-bold tracking-wide text-slate-500 uppercase">{m.roleTitle}</p>
                <p className="mt-2 text-xs leading-5 text-slate-600 line-clamp-3">{m.shortBio}</p>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Advisors & Mentors */}
      {mentors.length > 0 && (
        <section className="bg-[#fdf9f8] px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center font-serif text-4xl text-ink">Senior Advisors &amp; Mentors</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {mentors.map((m) => (
                <article className="flex flex-col gap-6 border border-slate-200 bg-white p-7 sm:flex-row" key={m.id}>
                  <img
                    className="h-48 w-full object-cover grayscale sm:w-44 shrink-0"
                    src={m.imageUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=85'}
                    alt={m.name}
                  />
                  <div>
                    <h3 className="font-serif text-2xl text-ink">{m.name}</h3>
                    <p className="mt-1 text-xs font-bold tracking-wide text-slate-500 uppercase">{m.roleTitle}</p>
                    <p className="mt-3 text-xs leading-6 text-slate-600">{m.shortBio}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Philosophy */}
      <section className="bg-navy px-6 py-20 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] tracking-[.18em] text-sky-200">OUR PHILOSOPHY</p>
          <h2 className="mt-4 font-serif text-4xl">How We Work</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {philosophyPoints.map(([title, copy]) => (
              <div key={title}>
                <b className="text-[10px] tracking-widest text-sky-300">{title}</b>
                <p className="mt-3 text-xs leading-6 text-slate-300">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disciplines */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <h2 className="text-center font-serif text-4xl text-ink">Multidisciplinary Synergy</h2>
        <div className="mt-12 space-y-12">
          {disciplines.map(([title, copy, image, align]) => (
            <div
              className={`flex flex-col gap-8 md:items-center ${
                align === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'
              }`}
              key={title}
            >
              <img className="h-64 w-full object-cover md:w-1/2" src={image} alt={title} />
              <div className="md:w-1/2">
                <h3 className="font-serif text-3xl text-ink">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}