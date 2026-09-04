import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import AnimatedSection from '../../components/AnimatedSection';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import Link from 'next/link';
import {
  getPublicPracticeAreaBySlug,
  getPublicPracticeAreas,
  buildPageMetadata,
} from '@/lib/queries/public';

// ─── generateStaticParams ───────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const areas = await getPublicPracticeAreas();
    return areas.map((pa) => ({ slug: pa.slug }));
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
  const pa = await getPublicPracticeAreaBySlug(slug);
  if (!pa) return {};
  return buildPageMetadata('practice-area', slug, {
    title: `${pa.name} | PSC Global Advisory`,
    description: pa.heroDescription || pa.shortDescription || '',
  });
}

// ─── Page Component ──────────────────────────────────────────────────────────
export default async function PracticeAreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pa = await getPublicPracticeAreaBySlug(slug);

  if (!pa) {
    notFound();
  }

  const services = pa.services ?? [];
  const capabilities = pa.capabilities ?? [];
  const relatedIndustries = pa.relatedIndustries ?? [];
  const relatedExperts = pa.relatedExperts ?? [];
  const relatedInsights = pa.relatedInsights ?? [];

  return (
    <main id="top">
      <SiteHeader />

      {/* HERO */}
      <AnimatedSection className="bg-[#fdf8f3] px-6 py-16 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_.9fr]">
          <div>
            <p className="font-mono text-xs tracking-[.18em] text-slate-500 uppercase">
              {pa.heroEyebrow || 'PRACTICE AREA'}
            </p>
            <h1 className="mt-4 max-w-xl font-serif text-6xl leading-[1.02] tracking-[-.045em] text-ink sm:text-7xl">
              {pa.heroHeading || `${pa.name} Advisory`}
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-slate-600 lg:text-lg">
              {pa.heroDescription || pa.shortDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={pa.heroCta1Text ? (pa.heroCta1Href || '/contact') : '/contact'}
                className="flex items-center gap-2 bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white transition hover:bg-slate-800"
              >
                {pa.heroCta1Text || 'TALK TO OUR ADVISORS'}
                <ArrowRight size={14} />
              </Link>
              <a
                href={pa.heroCta2Href || '#capabilities'}
                className="flex items-center gap-2 border border-ink px-5 py-3 text-xs font-bold tracking-wide transition hover:bg-slate-100"
              >
                {pa.heroCta2Text || 'VIEW CAPABILITIES'}
              </a>
            </div>
          </div>
          <div className="overflow-hidden">
            <img
              className="h-[360px] w-full object-cover grayscale lg:h-[460px]"
              src={
                pa.heroImageUrl ||
                pa.imageUrl ||
                'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=85'
              }
              alt={pa.heroImageAlt || pa.name}
            />
          </div>
        </div>
      </AnimatedSection>

      {/* OVERVIEW SECTION */}
      <AnimatedSection className="border-t border-slate-200 px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl leading-[1.05] text-ink lg:text-5xl">
              {pa.overviewHeading || `Understanding ${pa.name}`}
            </h2>
            <div className="mt-6 h-px w-10 bg-ink" />
            {pa.overviewQuote && (
              <blockquote className="mt-6 max-w-sm font-serif text-2xl leading-snug text-ink italic lg:text-3xl">
                &ldquo;{pa.overviewQuote}&rdquo;
              </blockquote>
            )}
          </div>
          <div className="space-y-6">
            {pa.overviewBody && (
              <p className="text-base leading-7 text-slate-600 lg:text-lg">{pa.overviewBody}</p>
            )}
            {pa.overviewBody2 && (
              <p className="text-base leading-7 text-slate-600 lg:text-lg">{pa.overviewBody2}</p>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* CORE SERVICES LIST */}
      {services.length > 0 && (
        <AnimatedSection className="border-t border-slate-200 bg-slate-50 px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-4xl leading-tight text-ink lg:text-5xl">
              {pa.servicesHeading || 'Core Practice Services'}
            </h2>
            {pa.servicesIntro && (
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">{pa.servicesIntro}</p>
            )}
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((srv) => (
                <div key={srv.id} className="border border-slate-200 bg-white p-6 shadow-sm">
                  <CheckCircle2 size={20} className="text-sky-700" />
                  <p className="mt-4 font-serif text-xl text-ink">{srv.name}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* STRATEGIC CAPABILITIES */}
      {capabilities.length > 0 && (
        <AnimatedSection id="capabilities" className="bg-navy px-6 py-24 text-white lg:px-10">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-4xl leading-tight lg:text-5xl">
              {pa.capabilitiesHeading || `Strategic Capabilities in ${pa.name}`}
            </h2>
            {pa.capabilitiesIntro && (
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">{pa.capabilitiesIntro}</p>
            )}
            <div className="mt-12 border-t border-slate-700">
              <div className="grid gap-x-16 gap-y-10 pt-12 sm:grid-cols-2">
                {capabilities.map((c, idx) => (
                  <div key={c.id}>
                    <p className="font-mono text-xs tracking-[.14em] text-slate-400">
                      0{idx + 1}.
                    </p>
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

      {/* RELEVANT INDUSTRIES */}
      {relatedIndustries.length > 0 && (
        <AnimatedSection className="border-t border-slate-200 px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-3xl text-ink lg:text-4xl">Relevant Industry Verticals</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedIndustries.map((ind) => (
                <Link
                  key={ind.slug}
                  href={`/industries/${ind.slug}`}
                  className="group flex items-center justify-between border border-slate-200 p-5 font-serif text-lg text-ink transition hover:border-slate-400 hover:text-sky-700"
                >
                  {ind.name}
                  <ArrowRight size={16} className="text-slate-400 transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* LEAD EXPERTS */}
      {relatedExperts.length > 0 && (
        <AnimatedSection className="border-t border-slate-200 bg-slate-50 px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-3xl text-ink lg:text-4xl">Lead Practice Practitioners</h2>
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

      {/* RELATED INSIGHTS */}
      {relatedInsights.length > 0 && (
        <AnimatedSection className="border-t border-slate-200 px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-3xl text-ink lg:text-4xl">Related Publications & Insights</h2>
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
                    READ PUBLICATION <ArrowRight size={12} />
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
          {pa.finalCtaHeading || `Strengthen Your ${pa.name} Architecture.`}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-600 lg:text-base">
          {pa.finalCtaDescription ||
            'Schedule a confidential consultation with our practice specialists to architect the optimal structural approach for your enterprise.'}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={pa.finalCta1Href || '/contact'}
            className="border border-ink px-5 py-3 text-center text-xs font-bold tracking-wide transition hover:bg-white"
          >
            {pa.finalCta1Text || 'TALK TO OUR ADVISORS'}
          </Link>
          <Link
            href="/book-consultation"
            className="bg-ink px-5 py-3 text-center text-xs font-bold tracking-wide text-white transition hover:bg-slate-800"
          >
            {pa.finalCta2Text || 'BOOK A CONSULTATION'}
          </Link>
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  );
}
