import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import AnimatedSection from '../../components/AnimatedSection';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import Link from 'next/link';
import {
  getPublicIndustryBySlug,
  getPublicIndustries,
  buildPageMetadata,
} from '@/lib/queries/public';

// ─── generateStaticParams ───────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const industries = await getPublicIndustries();
    return industries.map((ind) => ({ slug: ind.slug }));
  } catch {
    return [];
  }
}

// ─── generateMetadata ────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ind = await getPublicIndustryBySlug(slug);
  if (!ind) return {};
  return buildPageMetadata('industry', slug, {
    title: `${ind.name} | PSC Global Advisory`,
    description: ind.heroDescription || ind.shortDescription || '',
  });
}

// ─── Page Component ──────────────────────────────────────────────────────────
export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ind = await getPublicIndustryBySlug(slug);

  if (!ind) {
    notFound();
  }

  const challenges = ind.challenges ?? [];
  const solutions = ind.solutions ?? [];
  const relatedPracticeAreas = ind.relatedPracticeAreas ?? [];
  const relatedExperts = ind.relatedExperts ?? [];
  const relatedInsights = ind.relatedInsights ?? [];

  return (
    <main id="top">
      <SiteHeader />

      {/* HERO */}
      <AnimatedSection className="bg-[#fdf8f3] px-6 py-16 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_.9fr]">
          <div>
            <p className="font-mono text-xs tracking-[.18em] text-slate-500 uppercase">
              {ind.heroEyebrow || 'INDUSTRIES'}
            </p>
            <h1 className="mt-4 max-w-xl font-serif text-6xl leading-[1.02] tracking-[-.045em] text-ink sm:text-7xl">
              {ind.heroHeading || `${ind.name} Advisory`}
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-slate-600 lg:text-lg">
              {ind.heroDescription || ind.shortDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={ind.heroCta1Href || '/contact'}
                className="flex items-center gap-2 bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white transition hover:bg-slate-800"
              >
                {ind.heroCta1Text || 'TALK TO OUR INDUSTRY EXPERTS'}
                <ArrowRight size={14} />
              </Link>
              <a
                href={ind.heroCta2Href || '#how-we-help'}
                className="flex items-center gap-2 border border-ink px-5 py-3 text-xs font-bold tracking-wide transition hover:bg-slate-100"
              >
                {ind.heroCta2Text || 'EXPLORE RELEVANT SERVICES'}
              </a>
            </div>
          </div>
          <div className="overflow-hidden">
            <img
              className="h-[360px] w-full object-cover grayscale lg:h-[460px]"
              src={ind.heroImageUrl || ind.imageUrl || 'https://images.unsplash.com/photo-1497366754035-f200581272b4?auto=format&fit=crop&w=1200&q=85'}
              alt={ind.heroImageAlt || ind.name}
            />
          </div>
        </div>
      </AnimatedSection>

      {/* UNDERSTANDING THE INDUSTRY */}
      <AnimatedSection className="border-t border-slate-200 px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl leading-[1.05] text-ink lg:text-5xl">
              {ind.overviewHeading || `Understanding ${ind.name}`}
            </h2>
            <div className="mt-6 h-px w-10 bg-ink" />
            {ind.overviewQuote && (
              <blockquote className="mt-6 max-w-sm font-serif text-2xl leading-snug text-ink italic lg:text-3xl">
                &ldquo;{ind.overviewQuote}&rdquo;
              </blockquote>
            )}
          </div>
          <div className="space-y-6">
            {ind.overviewBody && (
              <p className="text-base leading-7 text-slate-600 lg:text-lg">{ind.overviewBody}</p>
            )}
            {ind.overviewBody2 && (
              <p className="text-base leading-7 text-slate-600 lg:text-lg">{ind.overviewBody2}</p>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* CHALLENGES */}
      {challenges.length > 0 && (
        <AnimatedSection className="bg-navy px-6 py-24 text-white lg:px-10">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-4xl leading-tight lg:text-5xl">
              The Challenges Shaping {ind.name}
            </h2>
            {ind.challengesIntro && (
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">{ind.challengesIntro}</p>
            )}
            <div className="mt-12 border-t border-slate-700">
              <div className="grid gap-x-16 gap-y-10 pt-12 sm:grid-cols-2">
                {challenges.map((c) => (
                  <div key={c.id}>
                    <p className="font-mono text-xs tracking-[.14em] text-slate-400">{c.number}</p>
                    <h3 className="mt-3 font-serif text-2xl text-white lg:text-3xl">{c.title}</h3>
                    <p className="mt-3 max-w-md text-sm leading-6 text-slate-300 lg:text-base">
                      {c.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* HOW WE HELP + RELATED PRACTICE AREAS */}
      <AnimatedSection id="how-we-help" className="px-6 py-24 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.3fr_.9fr]">
          <div>
            <h2 className="max-w-lg font-serif text-4xl leading-[1.05] text-ink lg:text-5xl">
              {ind.solutionsHeading || `How PSC Global Helps ${ind.name}`}
            </h2>

            {ind.solutionsIntro && (
              <p className="mt-6 max-w-md text-base leading-7 text-slate-600">{ind.solutionsIntro}</p>
            )}

            {solutions.length > 0 && (
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {solutions.map((item) => (
                  <div key={item.id} className="border border-slate-200 p-5">
                    <p className="font-mono text-xs font-bold tracking-[.1em] text-slate-500 uppercase">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {relatedPracticeAreas.length > 0 && (
            <div className="h-fit border border-slate-200 p-8">
              <h3 className="font-serif text-2xl text-ink lg:text-3xl">Relevant Practice Areas</h3>
              <div className="mt-6 border-t border-slate-200">
                {relatedPracticeAreas.map((pa) => (
                  <Link
                    key={pa.slug}
                    href={`/practice-areas/${pa.slug}`}
                    className="flex items-center justify-between border-b border-slate-200 py-5 font-serif text-xl text-ink transition duration-200 ease-out hover:text-sky-700"
                  >
                    {pa.name}
                    <ArrowRight
                      size={18}
                      className="shrink-0 text-slate-400 transition duration-200 ease-out group-hover:translate-x-1"
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* RELATED EXPERTS (if any linked) */}
      {relatedExperts.length > 0 && (
        <AnimatedSection className="border-t border-slate-200 bg-slate-50 px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-3xl text-ink lg:text-4xl">Industry Experts</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedExperts.map((tm) => (
                <div key={tm.id} className="flex items-center gap-4 border border-slate-200 bg-white p-5">
                  {tm.imageUrl ? (
                    <img
                      src={tm.imageUrl}
                      alt={tm.name}
                      className="h-14 w-14 flex-shrink-0 rounded-full object-cover grayscale"
                    />
                  ) : (
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-lg font-bold text-slate-500">
                      {tm.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-serif text-lg text-ink">{tm.name}</p>
                    <p className="text-sm text-slate-500">{tm.roleTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* RELATED INSIGHTS (if any linked) */}
      {relatedInsights.length > 0 && (
        <AnimatedSection className="border-t border-slate-200 px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-3xl text-ink lg:text-4xl">Related Insights</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedInsights.map((art) => (
                <Link
                  key={art.id}
                  href={`/insights/${art.slug}`}
                  className="group block border border-slate-200 p-6 transition hover:border-slate-400"
                >
                  {art.tag && (
                    <p className="font-mono text-xs tracking-[.12em] text-slate-400 uppercase">{art.tag}</p>
                  )}
                  <h3 className="mt-3 font-serif text-xl text-ink transition group-hover:text-sky-700">
                    {art.title}
                  </h3>
                  {art.summary && (
                    <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-3">{art.summary}</p>
                  )}
                  <p className="mt-4 flex items-center gap-1 text-xs font-bold text-ink">
                    READ MORE <ArrowRight size={12} />
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* FINAL CTA */}
      <AnimatedSection className="bg-sky-50 px-6 py-24 text-center lg:px-10">
        <h2 className="font-serif text-5xl leading-[1.05] text-ink lg:text-6xl">
          {ind.finalCtaHeading || "Let's Discuss Your Industry."}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-600 lg:text-base">
          {ind.finalCtaDescription ||
            'Schedule a confidential consultation with our sector specialists to architect the optimal structural approach for your enterprise.'}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={ind.finalCta1Href || '/contact'}
            className="border border-ink px-5 py-3 text-center text-xs font-bold tracking-wide transition hover:bg-white"
          >
            {ind.finalCta1Text || 'TALK TO OUR INDUSTRY EXPERTS'}
          </Link>
          <Link
            href="/book-consultation"
            className="bg-ink px-5 py-3 text-center text-xs font-bold tracking-wide text-white transition hover:bg-slate-800"
          >
            {ind.finalCta2Text || 'BOOK A CONSULTATION'}
          </Link>
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  );
}
