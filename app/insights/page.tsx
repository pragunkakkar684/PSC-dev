import { ArrowRight, ArrowUpRight, Download } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import Link from 'next/link';
import { getPublicHeroSection, getPublicInsights } from '@/lib/queries/public';
import InsightsGrid from './InsightsGrid';

// Placeholder insights shown only when the database has no entries yet.
// Slugs here intentionally match the fallback article detail pages in
// insights/[slug]/page.tsx so "Read Article" links never 404.
const defaultInsights = [
  {
    id: 'default-1',
    slug: 'navigating-cross-border-ma-2024',
    title: 'Navigating the Complexity of Cross-Border M&A in 2024.',
    summary:
      'As geopolitical landscapes shift, structural integrity in transaction planning becomes paramount. Our definitive guide to mitigating regulatory risk and structuring for long-term value creation.',
    tag: 'STRATEGIC ADVISORY',
    contentType: 'Report',
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85',
    readTimeMins: 12,
    publishedAt: '2024-10-24',
    isFeatured: true,
    fileUrl: null,
  },
  {
    id: 'default-2',
    slug: 'implications-new-global-minimum-tax-regime',
    title: 'Implications of the New Global Minimum Tax Regime.',
    summary: 'An analysis of structural adjustments required by multinational entities to comply with recent OECD directives.',
    tag: 'TAX POLICY',
    contentType: 'Article',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=85',
    readTimeMins: 6,
    publishedAt: '2024-10-14',
    isFeatured: false,
    fileUrl: null,
  },
  {
    id: 'default-3',
    slug: 'real-estate-infrastructure-2025-outlook',
    title: 'Real Estate Infrastructure: 2025 Outlook.',
    summary: 'Evaluating capital allocation strategies in an era of fluctuating interest rates and stringent sustainability mandates.',
    tag: 'INDUSTRY',
    contentType: 'Report',
    imageUrl: null,
    readTimeMins: 7,
    publishedAt: '2024-10-10',
    isFeatured: false,
    fileUrl: null,
  },
  {
    id: 'default-4',
    slug: 'architecting-corporate-governance-frameworks',
    title: 'Architecting Corporate Governance Frameworks.',
    summary: 'Building resilient internal controls that withstand intense regulatory scrutiny and shareholder activism.',
    tag: 'RISK ADVISORY',
    contentType: 'Article',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=85',
    readTimeMins: 8,
    publishedAt: '2024-10-05',
    isFeatured: false,
    fileUrl: null,
  },
];

const regulatoryUpdates = [
  { tag: 'SEBI', date: 'Oct 12, 2024', title: 'Revised Disclosure Norms for FPIs.', description: 'Mandatory granular disclosure requirements introduced for Foreign Portfolio Investors meeting specific AUM thresholds to prevent circumvention of MPS norms.' },
  { tag: 'INCOME TAX', date: 'Oct 08, 2024', title: 'Notification on Angel Tax Exemption.', description: 'CBDT issues final rules outlining valuation methodologies and recognized investor categories eligible for exemption under Section 56(2)(viib).' },
  { tag: 'GST', date: 'Oct 01, 2024', title: 'Clarification on Corporate Guarantees.', description: 'GST Council clarifies the valuation mechanism for corporate guarantees provided by holding companies to subsidiaries, setting a safe harbor rate.' },
  { tag: 'FEMA', date: 'Sep 28, 2024', title: 'Overseas Investment Rules Updated.', description: 'RBI introduces streamlined reporting procedures for Overseas Direct Investments, consolidating multiple forms into a unified filing system.' },
];

const judgements = [
  { court: 'SUPREME COURT OF INDIA', date: 'Oct 20, 2024', title: 'Ruling on Input Tax Credit Eligibility.', description: 'The court clarified the nexus required between input services and outward supplies for claiming ITC under specific GST provisions, providing significant relief to the manufacturing sector.' },
  { court: 'HIGH COURT OF DELHI', date: 'Oct 15, 2024', title: "Interpretation of 'Permanent Establishment'.", description: 'A landmark judgement defining the scope of virtual presence in determining PE status for multinational digital service providers under the DTAA.' },
  { court: 'NCLAT', date: 'Oct 08, 2024', title: 'Resolution Plan Approval Standards.', description: 'The tribunal reinforced the commercial wisdom of the Committee of Creditors while emphasizing the need for equitable treatment of operational creditors.' },
];

const researchDownloads = [
  { tag: 'HANDBOOK', title: '2024 Global Tax Handbook', description: 'A comprehensive guide to navigating international tax compliance across 40+ jurisdictions.' },
  { tag: 'COMPLIANCE GUIDE', title: 'M&A Compliance Guide', description: 'Essential regulatory checklists for cross-border mergers and acquisitions in the current year.' },
  { tag: 'WHITEPAPER', title: 'ESG Reporting Frameworks', description: 'Analyzing the shift from voluntary to mandatory sustainability disclosures for listed entities.' },
  { tag: 'MARKET REPORT', title: 'Q3 Economic Outlook', description: 'Strategic insights into market volatility and interest rate projections for the upcoming quarter.' },
];

const supportServices = [
  ['Risk & Assurance', 'Navigating complex regulatory landscapes with robust internal controls and strategic risk management.', '/practice-areas/risk-assurance'],
  ['Tax Advisory', 'Optimizing tax structures and ensuring compliance in an evolving global fiscal environment.', '/practice-areas/tax-advisory'],
  ['Corporate Law', 'Providing the legal framework for transactions, governance, and institutional growth.', '/practice-areas/corporate-law'],
  ['Business Advisory', 'Strategic foresight and execution support for market entry, expansion, and transformation.', '/practice-areas/business-advisory'],
] as const;

export default async function InsightsPage() {
  const [hero, dbInsights] = await Promise.all([
    getPublicHeroSection('insights'),
    getPublicInsights(),
  ]);

  const insights = dbInsights.length > 0 ? dbInsights : defaultInsights;
  const featured = insights.find((a: any) => a.isFeatured) || insights[0];
  const otherArticles = insights.filter((a: any) => a.id !== featured?.id);

  return (
    <main id="top">
      <SiteHeader />

      {/* HERO */}
      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1fr_.9fr] lg:px-10">
        <div>
          <p className="font-mono text-xs tracking-[.18em] text-slate-500 uppercase">{hero.eyebrow || 'KNOWLEDGE & THOUGHT LEADERSHIP'}</p>
          <h1 className="mt-4 max-w-xl font-serif text-6xl leading-[1.02] tracking-[-.045em] text-ink sm:text-7xl">
            {hero.heading || 'Ideas That Help Businesses Make Better Decisions.'}
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-600 lg:text-lg">
            {hero.subheading || 'Explore our curated perspectives on regulatory shifts, market dynamics, and strategic imperatives. We provide the architectural framework for institutional resilience and growth.'}
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
            src={hero.imageUrl || 'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?auto=format&fit=crop&w=1000&q=85'}
            alt="Insights gallery"
          />
          <div className="absolute -top-5 -right-5 h-16 w-16 border-t border-r border-slate-300" />
          <div className="absolute -bottom-5 -left-5 h-16 w-16 border-b border-l border-slate-300" />
        </div>
      </section>

      {/* FEATURED INSIGHT */}
      {featured && (
        <section className="bg-navy px-6 py-20 text-white lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
            {featured.imageUrl && (
              <img src={featured.imageUrl} alt={featured.title} className="h-96 w-full object-cover" />
            )}
            <div>
              <span className="font-mono text-xs tracking-[.18em] text-sky-300 uppercase">
                {featured.tag || featured.contentType.toUpperCase()} · {featured.readTimeMins || 5} MIN READ
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
        </section>
      )}

      {/* FILTERS + GRID */}
      <section id="articles" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <InsightsGrid articles={otherArticles} />
      </section>

      {/* REGULATORY UPDATES */}
      <section className="bg-navy px-6 py-24 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-5xl lg:text-6xl">Regulatory Updates.</h2>
            <Link href="/insights/regulatory-archive" className="hidden items-center gap-1 font-mono text-xs font-bold tracking-wide sm:flex">
              VIEW ARCHIVE <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {regulatoryUpdates.map((u) => (
              <div key={u.title} className="border-t border-slate-700 pt-5">
                <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-slate-400 uppercase">
                  <span className="bg-slate-800 px-2 py-1 font-bold text-sky-300">{u.tag}</span>
                  <span>{u.date}</span>
                </div>
                <h3 className="mt-3 font-serif text-2xl leading-snug">{u.title}</h3>
                <p className="mt-2 text-base leading-6 text-slate-400 lg:leading-7">{u.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEY JUDGEMENTS */}
      <section className="mx-auto max-w-5xl px-6 py-24 lg:px-10">
        <h2 className="font-serif text-5xl text-ink lg:text-6xl">Key Judgements.</h2>
        <div className="mt-12 divide-y divide-slate-200 border-t border-slate-200">
          {judgements.map((j) => (
            <div key={j.title} className="grid gap-2 py-8 sm:grid-cols-[1fr_2fr] sm:gap-8">
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
      </section>

      {/* RESEARCH & KNOWLEDGE CENTRE */}
      <section className="border-t border-slate-200 bg-slate-50 px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-5xl text-ink lg:text-6xl">Research &amp; Knowledge Centre.</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {researchDownloads.map((doc) => (
              <div key={doc.title} className="border border-slate-200 bg-white p-6">
                <p className="font-mono text-xs tracking-widest text-slate-500 uppercase">{doc.tag}</p>
                <h3 className="mt-3 font-serif text-xl leading-snug text-ink">{doc.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{doc.description}</p>
                <a href="#" className="mt-5 flex items-center gap-1.5 text-sm font-bold text-ink">
                  DOWNLOAD PDF <Download size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEED PRACTICAL SUPPORT */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <h2 className="max-w-md font-serif text-5xl leading-[1.05] text-ink lg:text-6xl">Need Practical Support?</h2>
        <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
          Our insights are the foundation of our practice. We translate these perspectives into actionable strategies for your business.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {supportServices.map(([title, copy, href]) => (
            <Link
              href={href}
              key={title}
              className="border border-slate-200 p-7 transition hover:border-ink"
            >
              <h3 className="font-serif text-2xl text-ink lg:text-3xl">{title}</h3>
              <p className="mt-2 text-base leading-6 text-slate-600 lg:leading-7">{copy}</p>
              <span className="mt-4 flex items-center gap-1.5 text-sm font-bold text-ink">
                EXPLORE SERVICE <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}