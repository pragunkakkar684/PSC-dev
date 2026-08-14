import { ArrowRight, ArrowUpRight } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import Link from 'next/link';
import { getPublicHeroSection, getPublicIndustries, getPublicTeamMembers } from '@/lib/queries/public';

const challenges = [
  'Regulatory Compliance',
  'Business Expansion',
  'Corporate Governance',
  'Operational Efficiency',
  'Financial Reporting',
  'Cross-border Growth',
  'Risk Management',
  'Technology Transformation',
];

const approach = [
  [
    '01',
    'Understand',
    'We begin with an exhaustive audit of the industry landscape, identifying both obvious risks and obscured opportunities unique to your sector.',
  ],
  [
    '02',
    'Integrate',
    'Our multidisciplinary teams merge financial, legal, and operational expertise into a single cohesive strategy.',
  ],
  [
    '03',
    'Execute',
    'We partner with leadership to deploy solutions with precision, ensuring resilience against market volatility.',
  ],
];

export default async function IndustriesPage() {
  const [hero, dbIndustries, dbTeam] = await Promise.all([
    getPublicHeroSection('industries'),
    getPublicIndustries(),
    getPublicTeamMembers(),
  ]);

  return (
    <main id="top">
      <SiteHeader />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1fr_.9fr] lg:px-10 lg:py-18">
        <div>
          <p className="font-mono text-[10px] tracking-[.18em] text-slate-500 uppercase">{hero.eyebrow || 'SECTOR SPECIALIZATION'}</p>
          <h1 className="mt-4 max-w-xl font-serif text-5xl leading-[1.02] tracking-[-.04em] text-ink sm:text-6xl">
            {hero.heading || 'Deep Domain & Sector Expertise.'}
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-slate-600">
            {hero.subheading || 'Tailored counsel across energy, financial services, tech, healthcare, and infrastructure.'}
          </p>
          <div className="mt-8 flex gap-3">
            <a href="#portfolio" className="flex items-center gap-2 bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
              Explore Sectors <ArrowRight size={15} />
            </a>
            <Link href="/contact" className="flex items-center gap-2 border border-ink px-5 py-3 text-sm font-medium transition hover:bg-slate-100">
              Speak With Sector Leads <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
        <div className="relative">
          <img
            className="h-[360px] w-full object-cover"
            src={hero.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85'}
            alt="City skyline"
          />
        </div>
      </section>

      {/* Dynamic Industry Portfolio */}
      <section id="portfolio" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <p className="font-mono text-[10px] tracking-[.18em] text-slate-500">INDUSTRY PORTFOLIO</p>
        <h2 className="mt-4 font-serif text-4xl text-ink">Industries We Empower</h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dbIndustries.map((ind) => (
            <article key={ind.id} className="border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl">
              {ind.imageUrl && (
                <img src={ind.imageUrl} alt={ind.name} className="h-44 w-full object-cover mb-5 rounded" />
              )}
              <h3 className="font-serif text-2xl text-ink">{ind.name}</h3>
              <p className="mt-3 text-xs leading-6 text-slate-600">{ind.shortDescription || 'Tailored advisory for sector excellence.'}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Sector Leadership */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <h2 className="text-center font-serif text-4xl text-ink">Sector Leadership</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {dbTeam.slice(0, 3).map((m) => (
            <article key={m.id}>
              <Link href={`/partner/${m.slug}`}>
                <img
                  className="h-72 w-full object-cover grayscale transition hover:grayscale-0"
                  src={m.imageUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85'}
                  alt={m.name}
                />
                <h3 className="mt-4 font-serif text-xl text-ink hover:text-sky-800 transition-colors">{m.name}</h3>
                <p className="mt-1 text-xs font-bold tracking-wide text-slate-500 uppercase">{m.roleTitle}</p>
                <p className="mt-2 text-xs text-slate-600 line-clamp-2">{m.focusArea || m.shortBio}</p>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Approach */}
      <section className="bg-navy px-6 py-20 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] tracking-[.18em] text-sky-200">OUR METHODOLOGY</p>
          <h2 className="mt-4 font-serif text-4xl">The PSC Industry Approach</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {approach.map(([num, title, copy]) => (
              <div key={title} className="border border-slate-700 bg-slate-900/50 p-7">
                <span className="font-serif text-3xl text-sky-400">{num}</span>
                <h3 className="mt-4 font-serif text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}