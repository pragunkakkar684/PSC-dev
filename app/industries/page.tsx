import { ArrowRight, ArrowUpRight } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';

const industries = [
  ['Manufacturing', 'Optimizing supply chains and navigating industrial regulation.'],
  ['Infrastructure', 'Long-term advisory for large-scale capital projects.'],
  ['Real Estate', 'Strategic portfolio management and market analysis.'],
  ['Aviation', 'Navigating complex international aerospace compliance.'],
  ['Energy', 'Advising on the transition to sustainable power models.'],
  ['Banking & Finance', 'Securing assets in a volatile global regulatory climate.'],
  ['Healthcare', 'Balancing clinical innovation with operational governance.'],
  ['NGOs', 'Ensuring transparency and impact in global development.'],
  ['Technology', 'Scaling digital solutions within legal frameworks.'],
  ['E-Commerce', 'Structuring cross-border retail and logistics.'],
  ['Media', 'Content rights and digital distribution strategies.'],
  ['Startups', 'Agile advisory for rapid scaling and fundraising.'],
];

const people = [
  [
    'Adrian Thorne',
    'PARTNER, INFRASTRUCTURE & ENERGY',
    'Expert in long-term project finance and regulatory structuring for emerging energy markets.',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85',
  ],
  [
    'Elena Rostova',
    'DIRECTOR, TECH & STARTUPS',
    'Advising on scale-up strategies, cross-border IP protection, and venture capital compliance.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=85',
  ],
  [
    'Marcus Vane',
    'HEAD OF BANKING & FINANCE',
    'Strategic advisor for global financial institutions navigating digital transformation and risk.',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85',
  ],
];

const challenges = [
  'Regulatory Compliance',
  'Business Expansion',
  'Corporate Governance',
  'Operational Efficiency',
  'Financial Reporting',
  'Cross-border Growth',
  'Risk Management',
  'Technology Transformation',
];

const approach = [
  [
    '01',
    'Understand',
    'We begin with an exhaustive audit of the industry landscape, identifying both obvious risks and obscured opportunities unique to your sector.',
  ],
  [
    '02',
    'Integrate',
    'Our solutions are never siloed. We weave regulatory, financial, and strategic advice into a single, cohesive industrial framework.',
  ],
  [
    '03',
    'Deliver',
    'Execution is measured against industry-standard KPIs, ensuring that our advisory translates into tangible, long-term business resilience.',
  ],
];

const synergies = [
  {
    label: 'MANUFACTURING ALIGNMENT',
    tags: ['RISK MANAGEMENT', 'CORPORATE LAW', 'BUSINESS ADVISORY'],
  },
  {
    label: 'TECH & E-COMMERCE ALIGNMENT',
    tags: ['INTELLECTUAL PROPERTY', 'GLOBAL TAX', 'M&A'],
  },
];

const perspectives = [
  [
    'REGULATORY UPDATE',
    'The Impact of New Global Carbon Tax Frameworks on Manufacturing.',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=85',
  ],
  [
    'INDUSTRY INSIGHT',
    'Digital Sovereignty: How Tech Firms Are Navigating EU Data Laws.',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=85',
  ],
  [
    'CASE STUDY',
    'Scaling Real Estate Portfolios in High-Inflation Environments.',
    'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=700&q=85',
  ],
];

const businessAdvice = [
  [
    'SECTOR EXPERIENCE',
    'Our partners spend their careers within specific industries, ensuring we speak your language and anticipate your unique hurdles.',
  ],
  [
    'INTEGRATED EXPERTISE',
    'We connect legal, financial, and strategic dots to provide a panoramic view of your business environment.',
  ],
  [
    'LONG-TERM PARTNERSHIP',
    'We are not transactional. We grow with our clients, evolving our advisory as their industry matures.',
  ],
];

export default function IndustriesPage() {
  return (
    <main id="top">
      <SiteHeader />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-2 lg:px-10 lg:py-18">
        <div>
          <p className="font-mono text-[10px] tracking-[.18em] text-slate-500">INDUSTRIES WE SERVE</p>
          <h1 className="mt-4 max-w-xl font-serif text-5xl font-black leading-[1.02] tracking-[-.04em] text-ink sm:text-6xl">
            Industry Expertise Built Around Real Business Challenges.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-slate-600">
            We combine deep sectoral knowledge with rigorous advisory
            frameworks to navigate the complexities of global markets. Our
            approach is tailored to the specific regulatory and economic
            drivers of your industry.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a className="flex items-center justify-center gap-2 bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white" href="#industries">
              EXPLORE INDUSTRIES <ArrowRight size={14} />
            </a>
            <a className="flex items-center justify-center border border-ink px-5 py-3 text-xs font-bold tracking-wide" href="#experts">
              TALK TO OUR INDUSTRY EXPERTS
            </a>
          </div>
        </div>
        <img
          className="h-[420px] w-full object-cover"
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1100&q=85"
          alt="City skyline"
        />
      </section>

      <section className="bg-[#fdf9f8] px-6 py-16 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl font-bold text-ink">
              Advisory Built Around Industry Context.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
              Generic advice often fails to account for the nuanced pressures
              of specific sectors. At PSC Global, we bridge the gap between
              high-level strategy and operational reality.
            </p>
            <p className="mt-5 max-w-md border-l-2 border-ink pl-4 text-sm italic leading-6 text-slate-600">
              &quot;Understanding the legislative landscape of a sector is
              only half the battle. The other half is anticipating how global
              shifts will disrupt local operations.&quot;
            </p>
          </div>
          <img
            className="h-72 w-full object-cover md:h-auto"
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85"
            alt="Modern interior"
          />
        </div>
      </section>

      <section id="industries" className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <p className="font-serif text-4xl font-bold text-ink">Industries We Support</p>
        <div className="mt-6 h-0.5 w-10 bg-ink" />
        <div className="mt-7 grid border border-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map(([name, copy]) => (
            <article className="border-b border-r border-slate-200 p-8" key={name}>
              <h3 className="font-serif text-2xl text-ink">{name}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
              <a className="mt-6 inline-flex items-center gap-1 text-[11px] font-bold tracking-wide text-ink" href="#contact">
                EXPLORE INDUSTRY <ArrowUpRight size={13} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <h2 className="text-center font-serif text-4xl font-bold">
            Challenges Shared Across Industries.
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {challenges.map((x) => {
              const words = x.split(' ');
              const last = words.pop();
              const head = last.slice(0, 2);
              const tail = last.slice(2);
              return (
                <div className="border border-slate-700 p-6 font-serif text-xl leading-tight" key={x}>
                  {words.length > 0 && <>{words.join(' ')} </>}
                  <span className="border-b border-slate-500">{head}</span>
                  {tail}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <h2 className="font-serif text-4xl text-ink">
          <span className="italic">Integrated Advisory.</span> Industry-Specific Solutions.
        </h2>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {approach.map(([no, title, copy]) => (
            <article key={no}>
              <b className="font-serif text-5xl font-bold text-slate-200">{no}</b>
              <h3 className="mt-4 font-serif text-2xl text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 px-6 py-16 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          <div>
            <h2 className="font-serif text-3xl text-ink">Cross-Disciplinary Synergy</h2>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600">
              How our specialized practice areas align with core industry needs.
            </p>
          </div>
          {synergies.map(({ label, tags }) => (
            <div className="bg-slate-50 p-6" key={label}>
              <p className="font-mono text-[10px] tracking-[.14em] text-slate-500">{label}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span className="bg-ink px-3 py-2 text-[10px] font-bold tracking-wide text-white" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="experts" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <h2 className="text-center font-serif text-4xl text-ink">Experts Who Understand Your Industry.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {people.map(([name, role, copy, image]) => (
            <article key={name}>
              <img className="h-72 w-full object-cover" src={image} alt={name} />
              <h3 className="mt-4 font-serif text-2xl text-ink">{name}</h3>
              <small className="text-[10px] font-bold tracking-widest text-slate-500">{role}</small>
              <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#f7f3f2] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-4xl text-ink">Latest Industry Perspectives.</h2>
            <a className="text-xs font-bold tracking-wide text-ink" href="#top">
              VIEW ALL INSIGHTS →
            </a>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {perspectives.map(([tag, title, img]) => (
              <article key={title}>
                <img className="h-40 w-full object-cover" src={img} alt="" />
                <p className="mt-4 font-mono text-[10px] tracking-[.14em] text-slate-500">{tag}</p>
                <p className="mt-2 font-serif text-xl font-bold text-ink">{title}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy px-6 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <h2 className="font-serif text-4xl font-bold leading-tight">
            Business Advice Begins With Industry Understanding.
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {businessAdvice.map(([label, copy]) => (
              <div key={label}>
                <p className="font-mono text-[10px] tracking-[.14em] text-slate-400">{label}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-6 py-24 text-center">
        <h2 className="mx-auto max-w-3xl font-serif text-5xl font-black leading-tight text-ink">
          Let&apos;s Discuss Your Industry Challenges.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-600">
          Our specialists are ready to provide a preliminary assessment of
          your strategic position within your sector.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="#experts" className="bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white">
            TALK TO OUR INDUSTRY EXPERTS
          </a>
          <a href="#top" className="border border-ink px-5 py-3 text-xs font-bold tracking-wide">
            BOOK A CONSULTATION
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}