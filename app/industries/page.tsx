import { ArrowRight, ArrowUpRight } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  getPublicHeroSection,
  getPublicIndustries,
  getPublicTeamMembers,
  getPublicSharedChallenges,
  getPublicInsights,
  buildPageMetadata,
} from '@/lib/queries/public';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('page', 'industries', {
    title: 'Industries Overview | PSC Global',
    description:
      'Industry expertise built around real business challenges across manufacturing, energy, technology, real estate, and financial services.',
  });
}

const approach = [
  ['01', 'Understand', 'We begin with an exhaustive audit of the industry landscape, identifying both obvious risks and obscured opportunities unique to your sector.'],
  ['02', 'Integrate', 'Our solutions are never siloed. We weave regulatory, financial, and strategic advice into a single, cohesive industrial framework.'],
  ['03', 'Deliver', 'Execution is measured against industry-standard KPIs, ensuring that our advisory translates into tangible, long-term business resilience.'],
] as const;

const synergyPanels = [
  { title: 'Manufacturing Alignment', tags: ['Risk Management', 'Corporate Law', 'Business Advisory'] },
  { title: 'Tech & E-Commerce Alignment', tags: ['Intellectual Property', 'Global Tax', 'M&A'] },
] as const;

export default async function IndustriesPage() {
  const [hero, dbIndustries, dbTeam, dbSharedChallenges, dbInsights] = await Promise.all([
    getPublicHeroSection('industries'),
    getPublicIndustries(),
    getPublicTeamMembers(),
    getPublicSharedChallenges(),
    getPublicInsights(),
  ]);

  const industries = dbIndustries;
  const team = dbTeam;
  const sharedChallenges = dbSharedChallenges.map((c) => c.title);

  return (
    <main id="top">
      <SiteHeader />

      {/* HERO */}
      <AnimatedSection className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1fr_.9fr] lg:px-10">
        <div>
          <p className="font-mono text-xs tracking-[.18em] text-slate-500 uppercase">{hero?.eyebrow || 'INDUSTRIES WE SERVE'}</p>
          <h1 className="mt-4 max-w-xl font-serif text-6xl leading-[1.02] tracking-[-.045em] text-ink sm:text-7xl">
            {hero?.heading || 'Industry Expertise Built Around Real Business Challenges.'}
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-600 lg:text-lg">
            {hero?.subheading || 'We combine deep sectoral knowledge with rigorous advisory frameworks to navigate the complexities of global markets. Our approach is tailored to the specific regulatory and economic drivers of your industry.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#portfolio" className="flex items-center gap-2 bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white transition hover:bg-slate-800">
              EXPLORE INDUSTRIES <ArrowRight size={14} />
            </a>
            <Link href="/contact" className="flex items-center gap-2 border border-ink px-5 py-3 text-xs font-bold tracking-wide transition hover:bg-slate-100">
              TALK TO OUR INDUSTRY EXPERTS
            </Link>
          </div>
        </div>
        <img
          className="h-[360px] w-full object-cover lg:h-[460px]"
          src={hero?.imageUrl || 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1000&q=85'}
          alt="City skyline"
        />
      </AnimatedSection>

      {/* ADVISORY CONTEXT */}
      <AnimatedSection className="bg-slate-50 px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="max-w-md font-serif text-4xl leading-[1.05] text-ink lg:text-5xl">
              Advisory Built Around Industry Context.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-slate-600 lg:text-base">
              Generic advice often fails to account for the nuanced pressures of specific sectors. At PSC Global, we bridge the gap between high-level strategy and operational reality.
            </p>
            <blockquote className="mt-6 max-w-md border-l-2 border-ink pl-5 text-sm leading-6 text-slate-600 italic">
              &ldquo;Understanding the legislative landscape of a sector is only half the battle. The other half is anticipating how global shifts will disrupt local operations.&rdquo;
            </blockquote>
          </div>
          <img
            className="h-72 w-full object-cover lg:h-96"
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85"
            alt="Modern interior workspace"
          />
        </div>
      </AnimatedSection>

      {/* INDUSTRY PORTFOLIO */}
      <AnimatedSection id="portfolio" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <h2 className="font-serif text-4xl text-ink lg:text-5xl">Industries We Support</h2>
        <div className="mt-2 h-0.5 w-10 bg-ink" />

        <div className="mt-10 grid divide-y divide-slate-200 border border-slate-200 sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
          {industries.map((ind) => (
            <div key={ind.id} className="industry-card p-7">
              <h3 className="font-serif text-xl text-ink">{ind.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {ind.shortDescription || 'Tailored advisory for sector excellence.'}
              </p>
              <Link href={`/industries/${ind.slug}`} className="mt-4 flex items-center gap-1 text-xs font-bold tracking-wide text-ink">
                EXPLORE INDUSTRY <ArrowUpRight size={12} />
              </Link>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* SHARED CHALLENGES */}
      {sharedChallenges.length > 0 && (
        <AnimatedSection className="bg-navy px-6 py-20 text-white lg:px-10">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-serif text-4xl italic lg:text-5xl">Challenges Shared Across Industries.</h2>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {sharedChallenges.map((c) => (
                <div key={c} className="border border-slate-700 px-6 py-8 text-lg font-serif leading-snug">
                  {c}
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* APPROACH */}
      <AnimatedSection className="bg-sky-50 px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-serif text-4xl text-ink lg:text-5xl">
            <em className="italic">Integrated Advisory.</em> Industry-Specific Solutions.
          </h2>
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {approach.map(([num, title, copy]) => (
              <div key={title}>
                <span className="font-serif text-5xl text-sky-200 lg:text-6xl">{num}</span>
                <h3 className="mt-3 font-serif text-2xl text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CROSS DISCIPLINARY SYNERGY */}
      <AnimatedSection className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <h2 className="font-serif text-3xl text-ink lg:text-4xl">Cross Disciplinary Synergy</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              How our specialized practice areas align with core industry needs.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {synergyPanels.map((panel) => (
              <div key={panel.title} className="border border-slate-200 bg-slate-50 p-6">
                <p className="font-mono text-[11px] font-bold tracking-[.1em] text-slate-500 uppercase">{panel.title}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {panel.tags.map((tag) => (
                    <span key={tag} className="border border-slate-300 bg-white px-3 py-1 text-xs text-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* EXPERTS */}
      {team.length > 0 && (
        <AnimatedSection className="border-t border-slate-200 px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center font-serif text-4xl text-ink lg:text-5xl">Experts Who Understand Your Industry.</h2>
            <div className="mt-14 grid gap-10 md:grid-cols-3">
              {team.slice(0, 3).map((m) => (
                <Link href={`/team/${m.slug}`} key={m.id} className="profile-card block">
                  <img
                    className="h-72 w-full object-cover grayscale transition hover:grayscale-0"
                    src={m.imageUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85'}
                    alt={m.name}
                  />
                  <h3 className="mt-5 font-serif text-2xl text-ink">{m.name}</h3>
                  <p className="mt-1 text-xs font-bold tracking-wide text-slate-500 uppercase">{m.roleTitle}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-3">{m.shortBio}</p>
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* INSIGHTS */}
      {dbInsights.length > 0 && (
        <AnimatedSection className="border-t border-slate-200 bg-slate-50 px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between">
              <h2 className="font-serif text-4xl text-ink lg:text-5xl">Latest Industry Perspectives.</h2>
              <Link href="/insights" className="hidden items-center gap-1 text-xs font-bold tracking-wide text-ink sm:flex">
                VIEW ALL INSIGHTS <ArrowRight size={14} />
              </Link>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {dbInsights.slice(0, 3).map((post) => (
                <Link key={post.id} href={`/insights/${post.slug}`} className="group block">
                  {post.imageUrl && (
                    <img className="h-48 w-full object-cover" src={post.imageUrl} alt={post.title} />
                  )}
                  <p className="mt-4 font-mono text-[11px] tracking-[.14em] text-slate-500 uppercase">{post.tag || 'INSIGHT'}</p>
                  <h3 className="mt-2 font-serif text-xl leading-snug text-ink group-hover:text-sky-700 transition">{post.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* CLOSING STATEMENT */}
      <AnimatedSection className="bg-navy px-6 py-20 text-white lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <h2 className="font-serif text-4xl leading-[1.05] lg:text-5xl">
            Business Advice Begins With Industry Understanding.
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            <p className="text-sm leading-6 text-slate-300">
              Our partners spent their careers within specific industries, ensuring we speak your language and understand your unique hurdles.
            </p>
            <div>
              <p className="font-mono text-[11px] tracking-[.14em] text-sky-300 uppercase">Long Term Partnership</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                We are not transactional. We grow with our clients, evolving our advisory as their industry matures.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="bg-sky-50 px-6 py-24 text-center lg:px-10">
        <h2 className="font-serif text-5xl leading-[1.05] text-ink lg:text-6xl">
          Let&apos;s Discuss Your
          <br />
          Industry Challenges.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-600 lg:text-base">
          Our specialists are ready to provide a preliminary assessment of your strategic position within your sector.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="bg-ink px-5 py-3 text-center text-xs font-bold tracking-wide text-white transition hover:bg-slate-800">
            TALK TO OUR INDUSTRY EXPERTS
          </Link>
          <Link href="/book-consultation" className="border border-ink px-5 py-3 text-center text-xs font-bold tracking-wide transition hover:bg-white">
            BOOK A CONSULTATION
          </Link>
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  );
}