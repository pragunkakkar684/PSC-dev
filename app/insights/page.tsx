import { ArrowRight, ArrowUpRight, Download, FileText } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import Link from 'next/link';
import { getPublicHeroSection, getPublicInsights } from '@/lib/queries/public';

const filters = ['ALL INSIGHTS', 'ARTICLES', 'PUBLICATIONS', 'JUDGEMENTS', 'WEBINARS'];

export default async function InsightsPage() {
  const [hero, dbInsights] = await Promise.all([
    getPublicHeroSection('insights'),
    getPublicInsights(),
  ]);

  const featured = dbInsights.find((a) => a.isFeatured) || dbInsights[0];
  const otherArticles = dbInsights.filter((a) => a.id !== featured?.id);

  return (
    <main id="top">
      <SiteHeader />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1fr_.9fr] lg:px-10 lg:py-18">
        <div>
          <p className="font-mono text-[10px] tracking-[.18em] text-slate-500 uppercase">{hero.eyebrow || 'KNOWLEDGE & THOUGHT LEADERSHIP'}</p>
          <h1 className="mt-4 max-w-xl font-serif text-5xl leading-[1.02] tracking-[-.04em] text-ink sm:text-6xl">
            {hero.heading || 'Authoritative Insights on Global Regulation.'}
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-slate-600">
            {hero.subheading || 'Analysis on tax reforms, judicial precedents, and international compliance frameworks.'}
          </p>
        </div>
        <div className="relative">
          <img
            className="h-[360px] w-full object-cover"
            src={hero.imageUrl || 'https://images.unsplash.com/photo-1553484771-047a44eee27b?auto=format&fit=crop&w=1000&q=85'}
            alt="Insights library"
          />
        </div>
      </section>

      {/* Featured Insight */}
      {featured && (
        <section className="bg-navy px-6 py-16 text-white lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
            {featured.imageUrl && (
              <img src={featured.imageUrl} alt={featured.title} className="h-80 w-full object-cover rounded" />
            )}
            <div>
              <span className="font-mono text-[10px] tracking-[.18em] text-sky-300 uppercase">
                FEATURED {featured.contentType.toUpperCase()} · {featured.readTimeMins || 5} MIN READ
              </span>
              <h2 className="mt-4 font-serif text-3xl sm:text-4xl leading-tight">
                {featured.title}
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                {featured.summary}
              </p>
              <Link
                href={`/insights/${featured.slug}`}
                className="mt-6 inline-flex items-center gap-2 bg-white px-5 py-3 text-xs font-bold text-ink transition hover:bg-slate-100"
              >
                READ FULL REPORT <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Articles Grid */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <h2 className="font-serif text-3xl text-ink">All Research &amp; Articles</h2>
          <div className="flex gap-2">
            {filters.map((f) => (
              <span key={f} className="text-[10px] font-bold tracking-widest text-slate-500 px-3 py-1 bg-slate-100 rounded">
                {f}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {otherArticles.map((art) => (
            <article key={art.id} className="border border-slate-200 bg-white p-6 transition hover:shadow-lg">
              {art.imageUrl && (
                <img src={art.imageUrl} alt={art.title} className="h-48 w-full object-cover mb-4 rounded" />
              )}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-widest text-slate-500 uppercase">
                  {art.tag || art.contentType}
                </span>
                {art.publishedAt && (
                  <span className="text-[10px] text-slate-400">
                    {new Date(art.publishedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-serif text-xl text-ink leading-snug">{art.title}</h3>
              <p className="mt-3 text-xs leading-6 text-slate-600 line-clamp-3">{art.summary}</p>

              {art.fileUrl && (
                <a
                  href={art.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:underline"
                >
                  <FileText size={14} /> Download PDF
                </a>
              )}

              <div className="mt-5 border-t border-slate-100 pt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">{art.readTimeMins || 5} min read</span>
                <Link href={`/insights/${art.slug}`} className="text-xs font-bold text-ink hover:underline">
                  Read Article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}