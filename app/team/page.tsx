import { ArrowDown, ArrowRight } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';

const philosophyPoints = [
  ['INSTITUTIONAL INTEGRITY', 'Our advisory model is built on the premise that complex challenges cannot be solved in isolation.'],
  ['LONG-TERM RELATIONSHIPS', 'We cultivate long-term partnerships with our clients, acting as a steady hand through market transitions.'],
  ['MULTIDISCIPLINARY COLLABORATION', 'Our collaborative approach ensures every strategic recommendation is vetted through multiple lenses.'],
  ['TRUSTED ADVISORY', 'This holistic approach transforms traditional consulting into a trusted partnership that endures across generations.'],
];

const leadership = [
  ['Dr. Julian Vance', 'FOUNDER & CEO', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85'],
  ['Helena Thorne', 'PARTNER, DIGITAL TRANSFORMATION', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=85'],
  ['Marcus Oh', 'PRINCIPAL, GLOBAL LOGISTICS', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85'],
  ['Sarah Jenkins', 'PARTNER, TAX STRATEGY', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=85'],
];

const partners = [
  ['Eleanor Vance', 'SENIOR PARTNER', 'Corporate Law', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=85'],
  ['David Chen', 'PARTNER', 'Risk & Assurance', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85'],
  ['Amira Rossi', 'PARTNER', 'Business Advisory', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=500&q=85'],
];

const mentors = [
  ['Robert Sterling', 'SENIOR ADVISOR, GLOBAL MARKETS', 'Robert brings over 40 years of institutional experience guiding Fortune 500 companies through complex market transitions and cross-border expansions.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=85'],
  ['Dr. Evelyn Hayes', 'SENIOR ADVISOR, REGULATORY AFFAIRS', 'A former chief regulator, Dr. Hayes advises our structural teams on anticipating policy shifts and building resilient compliance frameworks.', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=700&q=85'],
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

export default function OurTeamPage() {
  return (
    <main id="top">
      <SiteHeader />

      <section className="relative flex min-h-[560px] items-end overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=85"
          alt="PSC Global team meeting"
        />
        <div className="absolute inset-0 bg-navy/60" />
        <div className="relative mx-auto w-full max-w-7xl px-6 py-16 text-white lg:px-10">
          <p className="font-mono text-[10px] tracking-[.18em] text-slate-200">OUR TEAM</p>
          <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[1.02] tracking-[-.04em] sm:text-6xl">
            Meet The Experts Behind PSC Global.
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-7 text-slate-200">
            Our multidisciplinary team of Chartered Accountants, legal professionals, tax
            advisors and business consultants works together to solve complex business
            challenges with clarity and confidence.
          </p>
          <div className="mt-8 flex gap-3">
            <a href="#partners" className="flex items-center gap-2 bg-white px-5 py-3 text-xs font-bold tracking-wide text-navy">
              MEET OUR PARTNERS <ArrowDown size={14} />
            </a>
            <a href="#contact" className="border border-white px-5 py-3 text-xs font-bold tracking-wide">
              BOOK A CONSULTATION
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-10">
        <h2 className="mx-auto max-w-3xl text-center font-serif text-4xl leading-tight text-ink">
          A Philosophy Rooted in Structural Integrity
        </h2>
        <p className="mx-auto mt-10 max-w-3xl text-center font-serif text-2xl italic leading-relaxed text-ink">
          &quot;Strong businesses are built on thoughtful advice, enduring relationships and
          uncompromising integrity.&quot;
        </p>
        <div className="mx-auto mt-16 grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {philosophyPoints.map(([title, copy]) => (
            <div className="border-t border-slate-300 pt-5" key={title}>
              <p className="text-xs font-bold tracking-wide text-ink">{title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="flex items-end justify-between border-b border-slate-200 pb-6">
          <h2 className="font-serif text-4xl text-ink">Leadership</h2>
          <a className="flex items-center gap-2 text-xs font-bold tracking-wide text-ink" href="#contact">
            VIEW FULL STRUCTURE <ArrowRight size={14} />
          </a>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {leadership.map(([name, role, img]) => (
            <article key={name}>
              <img className="h-72 w-full object-cover grayscale" src={img} alt={name} />
              <h3 className="mt-5 font-serif text-2xl text-ink">{name}</h3>
              <p className="mt-1 text-xs font-bold tracking-wide text-slate-500">{role}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="partners" className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="border-b border-slate-200 pb-6">
          <h2 className="font-serif text-4xl text-ink">Partners</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {partners.map(([name, role, focus, img]) => (
            <article key={name}>
              <img className="h-80 w-full object-cover grayscale" src={img} alt={name} />
              <h3 className="mt-5 font-serif text-2xl text-ink">{name}</h3>
              <p className="mt-1 text-xs font-bold tracking-wide text-slate-500">{role}</p>
              <p className="mt-1 text-sm text-slate-600">{focus}</p>
              <a className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold tracking-wide text-ink" href="#contact">
                VIEW PROFILE <ArrowRight size={12} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="border-b border-slate-200 pb-6">
          <h2 className="font-serif text-4xl text-ink">Mentors</h2>
        </div>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {mentors.map(([name, role, copy, img]) => (
            <div className="flex gap-6" key={name}>
              <img className="h-52 w-40 shrink-0 object-cover grayscale" src={img} alt={name} />
              <div>
                <h3 className="font-serif text-2xl text-ink">{name}</h3>
                <p className="mt-1 text-xs font-bold tracking-wide text-slate-500">{role}</p>
                <p className="mt-4 text-sm leading-6 text-slate-600">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 lg:px-10">
        <h2 className="text-center font-serif text-4xl text-ink">Expertise Across Disciplines</h2>
        <div className="mx-auto mt-10 max-w-7xl divide-y divide-slate-200 border-t border-slate-200">
          {disciplines.map(([title, copy, img, side]) => (
            <div className="grid items-center gap-10 py-16 md:grid-cols-2" key={title}>
              {side === 'left' && <img className="h-80 w-full object-cover grayscale" src={img} alt={title} />}
              <div>
                <h3 className="font-serif text-2xl text-ink">{title}</h3>
                <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">{copy}</p>
                <a className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold tracking-wide text-ink" href="#contact">
                  EXPLORE <ArrowRight size={13} />
                </a>
              </div>
              {side === 'right' && <img className="h-80 w-full object-cover grayscale" src={img} alt={title} />}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy px-6 py-20 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="border-b border-slate-700 pb-10" />
          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            {closingPoints.map(([title, copy]) => (
              <div key={title}>
                <h3 className="font-serif text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-6 py-24 text-center">
        <h2 className="mx-auto max-w-2xl font-serif text-5xl leading-tight text-ink">
          Let&apos;s Start The Conversation.
        </h2>
        <div className="mt-9 flex justify-center gap-3">
          <a href="#top" className="bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white">
            BOOK A CONSULTATION
          </a>
          <a href="#partners" className="border border-ink px-5 py-3 text-xs font-bold tracking-wide">
            MEET OUR EXPERTS
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}