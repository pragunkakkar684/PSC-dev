import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { getPublicInsightBySlug } from '@/lib/queries/public';
import { notFound } from 'next/navigation';
import { FileText, User } from 'lucide-react';
import ShareInsight from './ShareInsight';

type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: { label: string; text: string }[] }
  | { type: 'quote'; text: string };

type Article = {
  title: string;
  summary: string;
  tag: string;
  contentType: string;
  imageUrl: string | null;
  readTimeMins: number;
  publishedAt: string;
  fileUrl: string | null;
  author: { name: string; roleTitle: string; imageUrl: string | null } | null;
  content: ContentBlock[];
};

const defaultArticlesBySlug: Record<string, Article> = {
  'navigating-regulatory-complexity-2025': {
    title: 'Navigating Regulatory Complexity: What Businesses Need to Know in 2025.',
    summary:
      'As global markets continue to interconnect, the regulatory frameworks governing them are evolving at an unprecedented pace. Organizations must proactively adapt their compliance strategies to maintain operational resilience and strategic advantage.',
    tag: 'REGULATORY UPDATE',
    contentType: 'Article',
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=85',
    readTimeMins: 8,
    publishedAt: '2024-10-12',
    fileUrl: null,
    author: {
      name: 'Dr. Eleanor Vance',
      roleTitle: 'Director of Regulatory Strategy',
      imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    },
    content: [
      {
        type: 'paragraph',
        text: 'The upcoming year represents a critical inflection point for international trade and corporate governance. Emerging mandates across multiple jurisdictions are coalescing to demand unprecedented transparency from multinational entities. This shift from reactionary compliance to proactive risk management requires a fundamental realignment of operational priorities.',
      },
      { type: 'heading', text: 'The Changing Landscape' },
      {
        type: 'paragraph',
        text: 'Historically, regulatory bodies operated within isolated silos, creating a patchwork of localized requirements. Today, we observe a harmonization of standards, particularly concerning digital privacy, environmental impact reporting, and supply chain auditability. This convergence, while intellectually elegant, introduces complex tactical challenges for legacy systems.',
      },
      {
        type: 'list',
        items: [
          {
            label: 'Cross-Border Data Flows',
            text: 'Stringent new localized storage requirements conflicting with global operational models.',
          },
          { label: 'Scope 3 Emissions', text: 'Mandatory granular reporting on indirect value chain impacts.' },
          {
            label: 'Algorithmic Accountability',
            text: 'Establishing governance frameworks for automated decision-making processes.',
          },
        ],
      },
      {
        type: 'quote',
        text: 'Compliance is no longer a localized checklist; it is a global architectural imperative.',
      },
      { type: 'heading', text: 'Key Implications for Leadership' },
      {
        type: 'paragraph',
        text: 'Executive boards must transition their perspective of regulatory affairs from a cost center to a critical component of strategic resilience. Failure to anticipate these shifts will not merely result in punitive fines, but in substantive market exclusion. Organizations that embed agility into their compliance frameworks will secure a distinct competitive moat.',
      },
    ],
  },

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
    content: [
      {
        type: 'paragraph',
        text: 'Cross-border M&A activity in 2024 is being reshaped by a wave of national security screening regimes and diverging antitrust philosophies across major economies.',
      },
      {
        type: 'paragraph',
        text: 'Dealmakers can no longer treat regulatory clearance as a late-stage formality. Structuring decisions made at term sheet stage now materially affect the probability and timeline of closing, particularly in transactions touching critical infrastructure, data, or semiconductors.',
      },
      {
        type: 'paragraph',
        text: 'Our advisory work across recent transactions highlights a consistent pattern: acquirers who build a joint regulatory workstream from day one of due diligence close with meaningfully less friction than those who treat it as a closing-condition checklist.',
      },
    ],
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
    content: [
      {
        type: 'paragraph',
        text: "The rollout of the global minimum tax continues to reshape how multinational groups approach effective tax rate planning, particularly under Pillar Two's top-up tax provisions.",
      },
      {
        type: 'paragraph',
        text: 'Organizations with operations across multiple low-tax jurisdictions should expect increased scrutiny and should begin modeling exposure well ahead of local implementation deadlines.',
      },
    ],
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
    content: [
      {
        type: 'paragraph',
        text: 'Institutional real estate portfolios are entering 2025 under a materially different cost-of-capital environment than the decade prior, forcing a re-underwriting of hold periods and exit assumptions across asset classes.',
      },
      {
        type: 'paragraph',
        text: 'Sustainability-linked financing terms are increasingly setting the floor for building specification, not the ceiling, as lenders price climate risk directly into loan covenants.',
      },
    ],
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
    content: [
      {
        type: 'paragraph',
        text: 'Boards are facing a widening gap between the pace of activist campaigns and the cadence of traditional governance review cycles.',
      },
      {
        type: 'paragraph',
        text: 'Resilient governance frameworks now require real-time escalation pathways and pre-negotiated response protocols, rather than the annual review structures that defined the last decade of practice.',
      },
    ],
  },
};

function ArticleContent({ blocks }: { blocks: ContentBlock[] }) {
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
  const article: Article | undefined = dbArticle || defaultArticlesBySlug[slug];

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