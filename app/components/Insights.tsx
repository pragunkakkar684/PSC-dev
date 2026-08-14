import type { InsightsArticle } from '@/lib/db/schema';
import Link from 'next/link';

interface InsightsProps {
  data?: InsightsArticle[] | null;
}

const sideArticles = [
  [
    'TAX · OCT 18, 2023',
    'New BEPS 2.0 Pillars: Strategic Implications for Corporate Tax',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=200&q=70',
  ],
  [
    'LEGAL · OCT 12, 2023',
    'Digital Asset Regulation: A Comprehensive Guide for FinTech Leaders',
    'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=200&q=70',
  ],
];

export default function Insights({ data }: InsightsProps) {
  const hasDbData = data && data.length > 0;
  const featured = hasDbData ? data.find((a) => a.isFeatured) || data[0] : null;
  const list = hasDbData ? data.filter((a) => a.id !== featured?.id).slice(0, 2) : [];

  return (
    <section id="insights" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 className="font-serif text-2xl">Featured Insights & Reports</h2>
        <Link className="text-xs font-semibold hover:underline" href="/insights">
          Browse All Insights →
        </Link>
      </div>
      <div className="mt-7 grid gap-8 lg:grid-cols-[2fr_1fr]">
        {hasDbData && featured ? (
          <article>
            <img
              className="h-64 w-full object-cover"
              src={featured.imageUrl || 'https://images.unsplash.com/photo-1553484771-047a44eee27b?auto=format&fit=crop&w=1200&q=85'}
              alt={featured.title}
            />
            <small className="mt-5 block text-[10px] tracking-widest text-slate-500 uppercase">
              {featured.tag || featured.contentType} · {featured.readTimeMins || 5} MIN READ
            </small>
            <h3 className="mt-3 font-serif text-3xl leading-tight">
              {featured.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {featured.summary}
            </p>
          </article>
        ) : (
          <article>
            <img
              className="h-64 w-full object-cover"
              src="https://images.unsplash.com/photo-1553484771-047a44eee27b?auto=format&fit=crop&w=1200&q=85"
              alt="Executive desk with report"
            />
            <small className="mt-5 block text-[10px] tracking-widest text-slate-500">
              MARKET REPORT 2026 · EXECUTIVE STRATEGY · 12 MIN READ · OCT 24, 2023
            </small>
            <h3 className="mt-3 font-serif text-3xl leading-tight">
              The Future of Cross-Border Regulatory Compliance in Emerging Markets
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              As global markets become more interconnected, the regulatory landscape is shifting. Dr. Vance has
              advised four of the world&rsquo;s top ten sovereign wealth funds on these critical maneuvers.
            </p>
          </article>
        )}

        <div className="space-y-6">
          {hasDbData
            ? list.map((art) => (
                <article className="flex gap-4 border-b border-slate-200 pb-5" key={art.id}>
                  <img
                    className="h-16 w-16 shrink-0 object-cover"
                    src={art.imageUrl || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=200&q=70'}
                    alt=""
                  />
                  <div>
                    <small className="text-[10px] tracking-widest text-slate-500 uppercase">{art.tag || art.contentType}</small>
                    <h3 className="mt-2 font-serif text-lg leading-snug">{art.title}</h3>
                  </div>
                </article>
              ))
            : sideArticles.map(([tag, title, image]) => (
                <article className="flex gap-4 border-b border-slate-200 pb-5" key={title}>
                  <img className="h-16 w-16 shrink-0 object-cover" src={image} alt="" />
                  <div>
                    <small className="text-[10px] tracking-widest text-slate-500">{tag}</small>
                    <h3 className="mt-2 font-serif text-lg leading-snug">{title}</h3>
                  </div>
                </article>
              ))}
          <blockquote className="bg-slate-100 p-6 text-sm leading-6">
            &ldquo;The quality of PSC&rsquo;s insight reports consistently provided our board with the clarity
            needed for major M&amp;A decisions.&rdquo;
            <cite className="mt-4 block text-[10px] font-semibold not-italic tracking-widest text-slate-500">
              — CFO, GLOBAL LOGISTICS CORP
            </cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
}