import { ArrowUpRight, Check, Compass } from 'lucide-react';

const areas = [
  ['01', 'INFRASTRUCTURE', 'Structural Strategy & Operations', 'Re-engineering organizational DNA to withstand the volatility of global markets. We focus on scalability, resilience, and operational excellence.', 'bg-navy text-white md:col-span-2'],
  ['02', 'ANALYTICS', 'Financial Forensics & Growth', 'Deep-dive economic modeling and predictive analytics designed for C-suite decision making.', 'bg-blue-100'],
  ['03', 'DIGITAL', 'Transformation', 'Harnessing emergent technologies to redefine industrial boundaries.', ''],
  ['04', 'POLICY', 'Global Compliance', 'Navigating the intricate landscape of international regulation and ESG standards.', ''],
  ['05', 'M&A', 'Advisory', 'Architecting seamless transitions and high-value mergers across continents.', ''],
];

export default function PracticeAreas() {
  return (
    <section id="practice" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <p className="text-center font-mono text-[10px] tracking-[.18em] text-slate-500">CORE COMPETENCIES</p>
      <h2 className="mt-4 text-center font-serif text-4xl">Practice Areas</h2>
      <div className="mx-auto mt-4 h-0.5 w-10 bg-sky-900" />
      <div className="mt-10 grid gap-3 md:grid-cols-3">
        {areas.map(([no, tag, title, copy, style], i) => (
          <article className={`relative min-h-44 border border-slate-200 p-7 transition hover:-translate-y-1 hover:shadow-xl ${style}`} key={title}>
            <div className="flex items-start justify-between">
              <small className="text-[10px] tracking-widest opacity-65">{no}. {tag}</small>
              {i === 0 && <Compass size={22} className="text-white/80" />}
            </div>
            <h3 className="mt-5 font-serif text-2xl leading-tight">{title}</h3>
            <p className="mt-3 text-sm leading-6 opacity-75">{copy}</p>
            {i === 0 && (
              <a href="#contact" className="mt-6 inline-flex items-center gap-2 text-xs font-bold">
                Learn more about Strategy <ArrowUpRight size={15} />
              </a>
            )}
            {i === 1 && (
              <>
                <ul className="mt-4 space-y-1 text-xs">
                  {['Market Penetration', 'Risk Mitigation', 'Value Optimization'].map((x) => (
                    <li className="flex gap-2" key={x}>
                      <Check size={13} />
                      {x}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold tracking-widest">
                  <ArrowUpRight size={13} /> MARKET INTELLIGENCE
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}