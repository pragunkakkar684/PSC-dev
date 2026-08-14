import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { getPublicInsightBySlug } from '@/lib/queries/public';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, FileText, User } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublicInsightBySlug(slug);
  if (article) {
    return {
      title: `${article.title} | PSC Global Insights`,
      description: article.summary || article.title,
    };
  }
  return {
    title: 'Insight Article | PSC Global',
  };
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

      <article className="mx-auto max-w-4xl px-6 py-14 lg:px-10">
        <Link href="/insights" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-ink mb-8">
          <ArrowLeft size={14} /> Back to All Insights
        </Link>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono mb-4 uppercase">
          <span className="bg-sky-100 text-sky-900 px-2.5 py-1 rounded font-bold">{article.tag || article.contentType}</span>
          {article.publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar size={13} /> {new Date(article.publishedAt).toLocaleDateString()}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock size={13} /> {article.readTimeMins || 5} min read
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl leading-tight text-ink font-bold">
          {article.title}
        </h1>

        {article.author && (
          <div className="mt-6 flex items-center gap-3 border-y border-slate-200 py-4">
            {article.author.imageUrl ? (
              <img src={article.author.imageUrl} alt={article.author.name} className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                <User size={20} />
              </div>
            )}
            <div>
              <div className="text-sm font-bold text-ink">{article.author.name}</div>
              <div className="text-xs text-slate-500">{article.author.roleTitle || 'Editorial Team'}</div>
            </div>
          </div>
        )}

        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="mt-8 h-[400px] w-full object-cover rounded-lg"
          />
        )}

        {article.summary && (
          <div className="mt-8 p-6 bg-slate-50 border-l-4 border-sky-800 text-base leading-7 text-slate-700 font-serif italic">
            {article.summary}
          </div>
        )}

        {article.body && (
          <div className="mt-10 space-y-6 text-base leading-8 text-slate-800 whitespace-pre-wrap">
            {article.body}
          </div>
        )}

        {article.fileUrl && (
          <div className="mt-12 p-6 border border-slate-200 bg-slate-900 text-white rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-serif text-xl">Official Research Publication (PDF)</h4>
              <p className="text-xs text-slate-400 mt-1">Download the full un-edited whitepaper document.</p>
            </div>
            <a
              href={article.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-ink px-5 py-3 text-xs font-bold rounded transition hover:bg-slate-100 shrink-0"
            >
              <FileText size={16} /> Download Document
            </a>
          </div>
        )}
      </article>

      <Footer />
    </main>
  );
}
