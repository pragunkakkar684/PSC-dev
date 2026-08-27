'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const filters = ['ALL INSIGHTS', 'ARTICLES', 'PUBLICATIONS', 'JUDGEMENTS', 'WEBINARS'];

function matchesFilter(art: any, filter: string) {
  if (filter === 'ALL INSIGHTS') return true;
  const type = (art.contentType || '').toUpperCase();
  // Matches e.g. "ARTICLE" -> "ARTICLES", or an already-plural contentType.
  return `${type}S` === filter || type === filter;
}

export default function InsightsGrid({ articles }: { articles: any[] }) {
  const [activeFilter, setActiveFilter] = useState(filters[0]);

  const filteredArticles = articles.filter((art) => matchesFilter(art, activeFilter));

  return (
    <>
      <div className="flex flex-wrap gap-8 border-b border-slate-200 pb-4">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActiveFilter(f)}
            aria-pressed={activeFilter === f}
            className={`font-mono text-xs font-bold tracking-widest transition-colors ${
              activeFilter === f
                ? 'border-b-2 border-ink pb-4 -mb-4 text-ink'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredArticles.length > 0 ? (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((art) => (
            <article className="insight-card" key={art.id}>
              {art.imageUrl ? (
                <img src={art.imageUrl} alt={art.title} className="h-60 w-full object-cover" />
              ) : (
                <div className="flex h-60 w-full items-center justify-center bg-slate-100">
                  <span className="font-serif text-3xl tracking-wide text-slate-300 uppercase">{art.contentType}</span>
                </div>
              )}
              <div className="mt-4 flex items-center gap-3 font-mono text-xs tracking-widest text-slate-500 uppercase">
                <span>{art.tag || art.contentType}</span>
                {art.publishedAt && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span>{new Date(art.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </>
                )}
              </div>
              <h3 className="mt-2 font-serif text-2xl leading-snug text-ink">{art.title}</h3>
              <p className="mt-2 text-base leading-6 text-slate-600 lg:leading-7">{art.summary}</p>
              <Link href={`/insights/${art.slug}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-ink">
                Read Article <ArrowRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-10 text-base text-slate-500">No insights found in this category yet.</p>
      )}
    </>
  );
}