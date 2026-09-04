import { ArrowRight, ArrowUpRight, Download } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  getPublicHeroSection,
  getPublicInsights,
  getPublicRegulatoryUpdates,
  getPublicKeyJudgements,
  getPublicResearchResources,
  getPublicPracticeAreas,
  buildPageMetadata,
} from '@/lib/queries/public';
import InsightsGrid from './InsightsGrid';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('page', 'insights', {
    title: 'Insights & Thought Leadership | PSC Global',
    description:
      'Explore our curated perspectives on tax policy, regulatory shifts, landmark judgements, and strategic market dynamics.',
  });
}

export default async function InsightsPage() {
  const [hero, dbInsights, dbRegUpdates, dbJudgements, dbResearch, dbPracticeAreas] = await Promise.all([
    getPublicHeroSection('insights'),
    getPublicInsights(),
    getPublicRegulatoryUpdates(),
    getPublicKeyJudgements(),
    getPublicResearchResources(),
    getPublicPracticeAreas(),
  ]);

  const insights = dbInsights;
  const featured = insights.find((a: any) => a.isFeatured) || insights[0];
  const otherArticles = insights.filter((a: any) => a.id !== featured?.id);

  return (
    <main id="top">
      <SiteHeader />

      {/* HERO */}
      <AnimatedSection className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1fr_.9fr] lg:px-10">
        <div>
          <p className="font-mono text-xs tracking-[.18em] text-slate-500 uppercase">{hero?.eyebrow || 'KNOWLEDGE & THOUGHT LEADERSHIP'}</p>
          <h1 className="mt-4 max-w-xl font-serif text-6xl leading-[1.02] tracking-[-.045em] text-ink sm:text-7xl">
            {hero?.heading || 'Ideas That Help Businesses Make Better Decisions.'}
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-600 lg:text-lg">
            {hero?.subheading || 'Explore our curated perspectives on regulatory shifts, market dynamics, and strategic imperatives. We provide the architectural framework for institutional resilience and growth.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#articles" className="flex items-center gap-2 bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
              EXPLORE ARTICLES <ArrowRight size={16} />
            </a>
            <Link href="/contact" className="flex items-center gap-2 border border-ink px-5 py-3 text-sm font-medium transition hover:bg-slate-100">
              SPEAK WITH AN EXPERT
            </Link>
          </div>
        </div>
        <div className="relative">
          <img
            className="h-[360px] w-full object-cover lg:h-[460px]"
            src={hero?.imageUrl || 'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?auto=format&fit=crop&w=1000&q=85'}
            alt="Insights gallery"
          />
          <div className="absolute -top-5 -right-5 h-16 w-16 border-t border-r border-slate-300" />
          <div className="absolute -bottom-5 -left-5 h-16 w-16 border-b border-l border-slate-300" />
        </div>
      </AnimatedSection>

      {/* FEATURED INSIGHT */}
      {featured && (
        <AnimatedSection className="bg-navy px-6 py-20 text-white lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
            {featured.imageUrl && (
              <img src={featured.imageUrl} alt={featured.title} className="h-96 w-full object-cover" />
            )}
            <div>
              <span className="font-mono text-xs tracking-[.18em] text-sky-300 uppercase">
                {featured.tag || featured.contentType?.toUpperCase()} · {featured.readTimeMins || 5} MIN READ
              </span>
              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                {featured.title}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-300 lg:text-lg">
                {featured.summary}
              </p>
              <Link
                href={`/insights/${featured.slug}`}
                className="mt-6 inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-medium text-ink transition hover:bg-slate-100"
              >
                READ FULL ANALYSIS <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* FILTERS + GRID */}
      <AnimatedSection id="articles" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <InsightsGrid articles={otherArticles} />
      </AnimatedSection>

      {/* REGULATORY UPDATES */}
      {dbRegUpdates.length > 0 && (
        <AnimatedSection className="bg-navy px-6 py-24 text-white lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between">
              <h2 className="font-serif text-5xl lg:text-6xl">Regulatory Updates.</h2>
              <Link href="/insights" className="hidden items-center gap-1 font-mono text-xs font-bold tracking-wide sm:flex">
                VIEW ALL <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
              {dbRegUpdates.map((u) => (
                <div key={u.id} className="border-t border-slate-700 pt-5">
                  <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-slate-400 uppercase">
                    <span className="bg-slate-800 px-2 py-1 font-bold text-sky-300">{u.authority}</span>
                    <span>{u.date}</span>
                  </div>
                  <h3 className="mt-3 font-serif text-2xl leading-snug">{u.title}</h3>
                  <p className="mt-2 text-base leading-6 text-slate-400 lg:leading-7">{u.description}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* KEY JUDGEMENTS */}
      {dbJudgements.length > 0 && (
        <AnimatedSection className="mx-auto max-w-5xl px-6 py-24 lg:px-10">
          <h2 className="font-serif text-5xl text-ink lg:text-6xl">Key Judgements.</h2>
          <div className="mt-12 divide-y divide-slate-200 border-t border-slate-200">
            {dbJudgements.map((j) => (
              <div key={j.id} className="grid gap-2 py-8 sm:grid-cols-[1fr_2fr] sm:gap-8">
                <div>
                  <p className="font-mono text-xs font-bold tracking-widest text-slate-500 uppercase">{j.court}</p>
                  <p className="mt-1 text-sm text-slate-400">{j.date}</p>
                </div>
                <div>
                  <h3 className="font-serif text-3xl text-ink">{j.title}</h3>
                  <p className="mt-2 text-base leading-7 text-slate-600">{j.description}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      )}

      {/* RESEARCH & KNOWLEDGE CENTRE */}
      {dbResearch.length > 0 && (
        <AnimatedSection className="border-t border-slate-200 bg-slate-50 px-6 py-24 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-5xl text-ink lg:text-6xl">Research &amp; Knowledge Centre.</h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {dbResearch.map((doc) => (
                <div key={doc.id} className="border border-slate-200 bg-white p-6">
                  <p className="font-mono text-xs tracking-widest text-slate-500 uppercase">{doc.tag}</p>
                  <h3 className="mt-3 font-serif text-xl leading-snug text-ink">{doc.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{doc.description}</p>
                  <a href={doc.ctaUrl || '/contact'} className="mt-5 flex items-center gap-1.5 text-sm font-bold text-ink">
                    REQUEST PDF <Download size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* NEED PRACTICAL SUPPORT */}
      {dbPracticeAreas.length > 0 && (
        <AnimatedSection className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <h2 className="max-w-md font-serif text-5xl leading-[1.05] text-ink lg:text-6xl">Need Practical Support?</h2>
          <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
            Our insights are the foundation of our practice. We translate these perspectives into actionable strategies for your business.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {dbPracticeAreas.slice(0, 4).map((pa) => (
              <Link
                href={`/practice-areas/${pa.slug}`}
                key={pa.id}
                className="border border-slate-200 p-7 transition hover:border-ink"
              >
                <h3 className="font-serif text-2xl text-ink lg:text-3xl">{pa.name}</h3>
                <p className="mt-2 text-base leading-6 text-slate-600 lg:leading-7">{pa.shortDescription}</p>
                <span className="mt-4 flex items-center gap-1.5 text-sm font-bold text-ink">
                  EXPLORE SERVICE <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </AnimatedSection>
      )}

      <Footer />
    </main>
  );
}