import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { getPublicInsightBySlug, buildPageMetadata, getPublicInsights } from '@/lib/queries/public';
import { notFound } from 'next/navigation';
import { FileText, User } from 'lucide-react';
import ShareInsight from './ShareInsight';
import type { Metadata } from 'next';

type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: { label: string; text: string }[] }
  | { type: 'quote'; text: string };

export async function generateStaticParams() {
  try {
    const articles = await getPublicInsights();
    return articles.map((art) => ({ slug: art.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublicInsightBySlug(slug);
  if (!article) return {};
  return buildPageMetadata('insight', slug, {
    title: `${article.title} | PSC Global Insights`,
    description: article.summary || article.title,
  });
}

function ArticleContent({ blocks }: { blocks: ContentBlock[] }) {
  if (!blocks || blocks.length === 0) return null;
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={i} className="text-base leading-8 text-slate-800">
                {block.text}
              </p>
            );
          case 'heading':
            return (
              <h2 key={i} className="pt-4 font-serif text-4xl leading-tight text-ink">
                {block.text}
              </h2>
            );
          case 'list':
            return (
              <div key={i} className="space-y-5 border-l-2 border-ink py-1 pl-5">
                {block.items.map((item) => (
                  <p key={item.label} className="text-base leading-7 text-slate-700">
                    <span className="font-bold text-ink">{item.label}:</span> {item.text}
                  </p>
                ))}
              </div>
            );
          case 'quote':
            return (
              <div key={i} className="border-y border-slate-300 py-10 text-center">
                <p className="mx-auto max-w-xl font-serif text-2xl leading-snug text-ink italic lg:text-3xl">
                  &ldquo;{block.text}&rdquo;
                </p>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

export default async function InsightArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublicInsightBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main id="top">
      <SiteHeader />

      <article className="mx-auto max-w-5xl px-6 py-14 lg:px-10">
        {/* BREADCRUMB */}
        <p className="flex items-center gap-2 font-mono text-xs font-bold tracking-[.14em] text-slate-500 uppercase">
          <Link href="/insights" className="hover:text-ink">
            Insights
          </Link>
          <span className="text-slate-300">•</span>
          <span>{article.tag || article.contentType}</span>
        </p>

        {/* HEADLINE */}
        <h1 className="mt-6 max-w-3xl font-serif text-6xl leading-[1.05] font-bold text-ink lg:text-7xl">
          {article.title}
        </h1>

        {/* SUMMARY */}
        {article.summary && (
          <p className="mt-8 max-w-2xl text-base leading-7 text-slate-600 lg:text-lg">{article.summary}</p>
        )}

        {/* META ROW */}
        <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4 border-y border-slate-200 py-5">
          {article.author && (
            <div className="flex items-center gap-3">
              {article.author.imageUrl ? (
                <img
                  src={article.author.imageUrl}
                  alt={article.author.name}
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                  <User size={18} />
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-ink">{article.author.name}</p>
                <p className="text-xs text-slate-500">{article.author.roleTitle || 'Editorial Team'}</p>
              </div>
            </div>
          )}

          {article.publishedAt && (
            <div className="border-l border-slate-200 pl-10">
              <p className="font-mono text-[11px] tracking-[.1em] text-slate-500 uppercase">Published</p>
              <p className="mt-1 text-sm font-bold text-ink">
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          )}

          <div className="border-l border-slate-200 pl-10">
            <p className="font-mono text-[11px] tracking-[.1em] text-slate-500 uppercase">Reading Time</p>
            <p className="mt-1 text-sm font-bold text-ink">{article.readTimeMins || 5} Minute Read</p>
          </div>
        </div>

        {/* HERO IMAGE */}
        {article.imageUrl ? (
          <img src={article.imageUrl} alt={article.title} className="mt-10 h-[520px] w-full object-cover" />
        ) : (
          <div className="mt-10 flex h-[520px] w-full items-center justify-center bg-slate-100">
            <span className="font-serif text-4xl tracking-wide text-slate-300 uppercase">{article.contentType}</span>
          </div>
        )}

        {/* SHARE + BODY */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[160px_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ShareInsight title={article.title} />
          </div>

          <div>
            <ArticleContent blocks={article.content} />

            {article.fileUrl && (
              <div className="mt-12 flex flex-col items-start justify-between gap-4 bg-navy p-6 text-white sm:flex-row sm:items-center">
                <div>
                  <h4 className="font-serif text-xl">Official Research Publication (PDF)</h4>
                  <p className="mt-1 text-xs text-slate-400">Download the full un-edited whitepaper document.</p>
                </div>
                <a
                  href={article.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 bg-white px-5 py-3 text-xs font-bold text-ink transition hover:bg-slate-100"
                >
                  <FileText size={16} /> Download Document
                </a>
              </div>
            )}
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}