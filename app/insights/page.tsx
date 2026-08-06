import { ArrowRight, ArrowUpRight, Download } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';

const filters = ['ALL INSIGHTS', 'ARTICLES', 'PUBLICATIONS', 'JUDGEMENTS', 'WEBINARS'];

const articles = [
  [
    'TAX POLICY',
    'Oct 14, 2024',
    'Implications of the New Global Minimum Tax Regime.',
    'An analysis of structural adjustments required by multinational entities to comply with recent OECD directives.',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=700&q=85',
    false,
  ],
  [
    'INDUSTRY',
    'Oct 10, 2024',
    'Real Estate Infrastructure: 2025 Outlook.',
    'Evaluating capital allocation strategies in an era of fluctuating interest rates and stringent sustainability mandates.',
    '',
    true,
  ],
  [
    'RISK ADVISORY',
    'Oct 05, 2024',
    'Architecting Corporate Governance Frameworks.',
    'Building resilient internal controls that withstand intense regulatory scrutiny and shareholder activism.',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=700&q=85',
    false,
  ],
];

const regulatoryUpdates = [
  ['SEBI', 'Oct 12, 2024', 'Revised Disclosure Norms for FPIs.', 'Mandatory granular disclosure requirements introduced for Foreign Portfolio Investors meeting specific AUM thresholds to prevent circumvention of MPS norms.'],
  ['INCOME TAX', 'Oct 08, 2024', 'Notification on Angel Tax Exemption.', 'CBDT issues final rules outlining valuation methodologies and recognized investor categories eligible for exemption under Section 56(2)(viib).'],
  ['GST', 'Oct 01, 2024', 'Clarification on Corporate Guarantees.', 'GST Council clarifies the valuation mechanism for corporate guarantees provided by holding companies to subsidiaries, setting a safe harbor rate.'],
  ['FEMA', 'Sep 28, 2024', 'Overseas Investment Rules Updated.', 'RBI introduces streamlined reporting procedures for Overseas Direct Investments, consolidating multiple forms into a unified filing system.'],
];

const judgements = [
  ['SUPREME COURT OF INDIA', 'Oct 20, 2024', 'Ruling on Input Tax Credit Eligibility.', 'The court clarified the nexus required between input services and outward supplies for claiming ITC under specific GST provisions, providing significant relief to the manufacturing sector.'],
  ['HIGH COURT OF DELHI', 'Oct 15, 2024', "Interpretation of 'Permanent Establishment'.", 'A landmark judgement defining the scope of virtual presence in determining PE status for multinational digital service providers under the DTAA.'],
  ['NCLAT', 'Oct 05, 2024', 'Resolution Plan Approval Standards.', 'The tribunal reinforced the commercial wisdom of the Committee of Creditors while emphasizing the need for equitable treatment of operational creditors.'],
];

const research = [
  ['HANDBOOK', '2024 Global Tax Handbook', 'A comprehensive guide to navigating international tax compliance across 40+ jurisdictions.'],
  ['COMPLIANCE GUIDE', 'M&A Compliance Guide', 'Essential regulatory checklists for cross-border mergers and acquisitions in the current year.'],
  ['WHITEPAPER', 'ESG Reporting Frameworks', 'Analyzing the shift from voluntary to mandatory sustainability disclosures for listed entities.'],
  ['MARKET REPORT', 'Q3 Economic Outlook', 'Strategic insights into market volatility and interest rate projections for the upcoming quarter.'],
];

const supportServices = [
  ['Risk & Assurance', 'Navigating complex regulatory landscapes with robust internal controls and strategic risk management.'],
  ['Tax Advisory', 'Optimizing tax structures and ensuring compliance in an evolving global fiscal environment.'],
  ['Corporate Law', 'Providing the legal framework for transactions, governance, and institutional growth.'],
  ['Business Advisory', 'Strategic foresight and execution support for market entry, expansion, and transformation.'],
];

export default function InsightsPage() {
  return (
    <main id="top">
      <SiteHeader />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-2 lg:px-10 lg:py-18">
        <div>
          <h1 className="max-w-lg font-serif text-5xl leading-[1.02] tracking-[-.04em] text-ink sm:text-6xl">
            Ideas That Help Businesses Make Better Decisions.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-slate-600">
            Explore our curated perspectives on regulatory shifts, market dynamics, and
            strategic imperatives. We provide the architectural framework for institutional
            resilience and growth.
          </p>
          <div className="mt-8 flex gap-3">
            <a href="#insights" className="flex items-center gap-2 bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white">
              EXPLORE ARTICLES <ArrowRight size={14} />
            </a>
            <a href="#contact" className="flex items-center border border-ink px-5 py-3 text-xs font-bold tracking-wide">
              SPEAK WITH AN EXPERT
            </a>
          </div>
        </div>
        <div className="border border-slate-200 bg-white">
          <div className="flex items-center justify-end border-b border-slate-200 px-4 py-3">
            <span className="text-[10px] tracking-widest text-slate-400">Overview</span>
          </div>
          <img
            className="h-64 w-full object-cover"
            src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1000&q=85"
            alt="Art installation"
          />
          <p className="border-b border-slate-100 px-4 py-3 text-[11px] text-slate-500">
            &apos;Silent Flux&apos; by Artech Collective | Displayed at PSC Global HQ Gallery
          </p>
          <div className="grid grid-cols-2 gap-3 p-4">
            <div className="bg-slate-50 p-3">
              <p className="text-[10px] text-slate-500">Systems Global Network</p>
              <p className="mt-2 text-[10px] font-bold text-ink">Network Connectivity Score: 8.4/10</p>
            </div>
            <div className="bg-slate-50 p-3">
              <p className="text-[10px] text-slate-500">System Efficiency Trend</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid border border-slate-200 md:grid-cols-2">
          <img
            className="h-72 w-full object-cover md:h-auto"
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85"
            alt="Modern office atrium"
          />
          <div className="p-8 lg:p-12">
            <p className="flex items-center gap-2 text-[11px] font-bold tracking-wide text-slate-500">
              STRATEGIC ADVISORY <span>•</span> 12 MIN READ
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-[1.05] text-ink">
              Navigating the Complexity of Cross-Border M&amp;A in 2024.
            </h2>
            <p className="mt-5 text-sm leading-7 text-slate-600">
              As geopolitical landscapes shift, structural integrity in transaction planning
              becomes paramount. Our definitive guide to mitigating regulatory risk and
              structuring for long-term value creation.
            </p>
            <a className="mt-6 inline-flex items-center gap-1 border-b border-ink text-xs font-bold tracking-wide text-ink" href="#contact">
              READ FULL ANALYSIS <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </section>

      <section id="insights" className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-wrap gap-8 border-b border-slate-200 pb-4">
          {filters.map((f, i) => (
            <a
              key={f}
              href="#insights"
              className={`text-xs font-bold tracking-wide ${i === 0 ? 'border-b-2 border-ink pb-4 -mb-[17px] text-ink' : 'text-slate-500'}`}
            >
              {f}
            </a>
          ))}
        </div>

        <div className="mt-10 grid gap-8 pb-16 md:grid-cols-3">
          {articles.map(([tag, date, title, copy, img, isPlaceholder]) => (
            <article key={title}>
              {isPlaceholder ? (
                <div className="flex h-52 w-full items-center justify-center border border-slate-200 bg-white">
                  <span className="font-serif text-3xl tracking-widest text-slate-300">REPORT</span>
                </div>
              ) : (
                <img className="h-52 w-full object-cover" src={img} alt="" />
              )}
              <p className="mt-4 flex items-center gap-2 text-[11px] font-bold tracking-wide text-slate-500">
                {tag} <span>|</span> {date}
              </p>
              <h3 className="mt-3 font-serif text-2xl leading-tight text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-5xl">Regulatory Updates.</h2>
            <a className="flex items-center gap-2 text-xs font-bold tracking-wide" href="#contact">
              VIEW ARCHIVE <ArrowRight size={14} />
            </a>
          </div>
          <div className="mt-10 grid gap-x-16 gap-y-0 border-t border-slate-700 sm:grid-cols-2">
            {regulatoryUpdates.map(([tag, date, title, copy], i) => (
              <div className={`py-8 ${i > 1 ? 'border-t border-slate-700' : ''}`} key={title}>
                <div className="flex items-center justify-between">
                  <span className="bg-slate-800 px-2 py-1 text-[10px] font-bold tracking-wide text-slate-300">{tag}</span>
                  <span className="text-xs text-slate-400">{date}</span>
                </div>
                <h3 className="mt-4 font-serif text-2xl leading-tight">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <h2 className="font-serif text-5xl text-ink">Key Judgements.</h2>
        <div className="mt-8 border-t border-slate-200">
          {judgements.map(([court, date, title, copy]) => (
            <div className="grid gap-4 border-b border-slate-200 py-8 md:grid-cols-[220px_1fr]" key={title}>
              <div>
                <p className="text-[11px] font-bold tracking-wide text-slate-500">{court}</p>
                <p className="mt-1 text-xs text-slate-400">{date}</p>
              </div>
              <div>
                <h3 className="font-serif text-2xl leading-tight text-ink">{title}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-5xl text-ink">Research &amp; Knowledge Centre.</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {research.map(([tag, title, copy]) => (
              <article className="border border-slate-200 bg-[#fdf9f8] p-6" key={title}>
                <p className="text-[10px] font-bold tracking-wide text-slate-500">{tag}</p>
                <h3 className="mt-3 font-serif text-2xl leading-tight text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
                <a className="mt-6 inline-flex items-center gap-2 border-b border-ink text-[11px] font-bold tracking-wide text-ink" href="#contact">
                  DOWNLOAD PDF <Download size={13} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-5xl leading-tight text-ink">
            Need Practical Support?
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
            Our insights are the foundation of our practice. We translate these perspectives
            into actionable strategies for your business.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {supportServices.map(([title, copy]) => (
              <article className="border border-slate-200 p-8" key={title}>
                <h3 className="font-serif text-2xl text-ink">{title}</h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">{copy}</p>
                <a className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold tracking-wide text-ink" href="#contact">
                  EXPLORE SERVICE <ArrowRight size={13} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}