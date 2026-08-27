import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { getPublicInsightBySlug } from '@/lib/queries/public';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, FileText, User } from 'lucide-react';

// Placeholder articles shown only when the database has no matching row.
// Slugs match the fallback cards in insights/page.tsx so links between
// the listing and detail pages never 404 while the DB is empty.
const defaultArticlesBySlug: Record<
  string,
  {
    title: string;
    summary: string;
    tag: string;
    contentType: string;
    imageUrl: string | null;
    readTimeMins: number;
    publishedAt: string;
    fileUrl: string | null;
    author: { name: string; roleTitle: string; imageUrl: string | null } | null;
    body: string;
  }
> = {
  'navigating-cross-border-ma-2024': {
    title: 'Navigating the Complexity of Cross-Border M&A in 2024.',
    summary:
      'As geopolitical landscapes shift, structural integrity in transaction planning becomes paramount. Our definitive guide to mitigating regulatory risk and structuring for long-term value creation.',
    tag: 'STRATEGIC ADVISORY',
    contentType: 'Report',
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=85',
    readTimeMins: 12,
    publishedAt: '2024-10-24',
    fileUrl: null,
    author: {
      name: 'Dr. Julian Vance',
      roleTitle: 'Managing Partner',
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    },
    body: 'Cross-border M&A activity in 2024 is being reshaped by a wave of national security screening regimes and diverging antitrust philosophies across major economies.\n\nDealmakers can no longer treat regulatory clearance as a late-stage formality. Structuring decisions made at term sheet stage now materially affect the probability and timeline of closing, particularly in transactions touching critical infrastructure, data, or semiconductors.\n\nOur advisory work across recent transactions highlights a consistent pattern: acquirers who build a joint regulatory workstream from day one of due diligence close with meaningfully less friction than those who treat it as a closing-condition checklist.',
  },
  'implications-new-global-minimum-tax-regime': {
    title: 'Implications of the New Global Minimum Tax Regime.',
    summary: 'An analysis of structural adjustments required by multinational entities to comply with recent OECD directives.',
    tag: 'TAX POLICY',
    contentType: 'Article',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85',
    readTimeMins: 6,
    publishedAt: '2024-10-14',
    fileUrl: null,
    author: null,
    body: 'The rollout of the global minimum tax continues to reshape how multinational groups approach effective tax rate planning, particularly under Pillar Two\u2019s top-up tax provisions.\n\nOrganizations with operations across multiple low-tax jurisdictions should expect increased scrutiny and should begin modeling exposure well ahead of local implementation deadlines.',
  },
  'real-estate-infrastructure-2025-outlook': {
    title: 'Real Estate Infrastructure: 2025 Outlook.',
    summary: 'Evaluating capital allocation strategies in an era of fluctuating interest rates and stringent sustainability mandates.',
    tag: 'INDUSTRY',
    contentType: 'Report',
    imageUrl: null,
    readTimeMins: 7,
    publishedAt: '2024-10-10',
    fileUrl: null,
    author: null,
    body: 'Institutional real estate portfolios are entering 2025 under a materially different cost-of-capital environment than the decade prior, forcing a re-underwriting of hold periods and exit assumptions across asset classes.\n\nSustainability-linked financing terms are increasingly setting the floor for building specification, not the ceiling, as lenders price climate risk directly into loan covenants.',
  },
  'architecting-corporate-governance-frameworks': {
    title: 'Architecting Corporate Governance Frameworks.',
    summary: 'Building resilient internal controls that withstand intense regulatory scrutiny and shareholder activism.',
    tag: 'RISK ADVISORY',
    contentType: 'Article',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=85',
    readTimeMins: 8,
    publishedAt: '2024-10-05',
    fileUrl: null,
    author: null,
    body: 'Boards are facing a widening gap between the pace of activist campaigns and the cadence of traditional governance review cycles.\n\nResilient governance frameworks now require real-time escalation pathways and pre-negotiated response protocols, rather than the annual review structures that defined the last decade of practice.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublicInsightBySlug(slug);
  const fallback = defaultArticlesBySlug[slug];
  const resolved = article || fallback;

  if (resolved) {
    return {
      title: `${resolved.title} | PSC Global Insights`,
      description: resolved.summary || resolved.title,
    };
  }
  return {
    title: 'Insight Article | PSC Global',
  };
}

export default async function InsightArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dbArticle = await getPublicInsightBySlug(slug);

  // Fall back to placeholder content only when the DB has no matching row.
  const article = dbArticle || defaultArticlesBySlug[slug];

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

        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="mt-8 h-[400px] w-full object-cover rounded-lg"
          />
        ) : (
          <div className="mt-8 flex h-[400px] w-full items-center justify-center rounded-lg bg-slate-100">
            <span className="font-serif text-4xl tracking-wide text-slate-300 uppercase">{article.contentType}</span>
          </div>
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