import { ArrowUpRight, Check } from 'lucide-react';

const areas = [
  ['01', 'Structural Strategy & Operations', 'Re-engineering organizational DNA to withstand global market volatility.', 'bg-navy text-white md:col-span-2'],
  ['02', 'Financial Forensics & Growth', 'Deep-dive economic modeling and predictive analytics for C-suite decision making.', 'bg-blue-100'],
  ['03', 'Transformation', 'Harnessing emerging technologies to redefine modern businesses.', ''],
  ['04', 'Global Compliance', 'Navigating international regulation and risk standards.', ''],
  ['05', 'Advisory', 'Architecting seamless transitions and high-value mergers.', ''],
];

export default function PracticeAreas() {
  return (
    <section id="practice" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <p className="text-center font-mono text-[10px] tracking-[.18em] text-slate-500">CORE COMPETENCIES</p>
      <h2 className="mt-4 text-center font-serif text-4xl">Practice Areas</h2>
      <div className="mx-auto mt-4 h-0.5 w-10 bg-sky-900" />
      <div className="mt-10 grid gap-3 md:grid-cols-3">
        {areas.map(([no, title, copy, style], i) => (
          <article className={`min-h-44 border border-slate-200 p-7 transition hover:-translate-y-1 hover:shadow-xl ${style}`} key={title}>
            <small className="text-[10px] tracking-widest opacity-65">{no}. SERVICES</small>
            <h3 className="mt-5 font-serif text-2xl leading-tight">{title}</h3>
            <p className="mt-3 text-sm leading-6 opacity-75">{copy}</p>
            {i < 2 && (
              <a href="#contact" className="mt-6 inline-flex items-center gap-2 text-xs font-bold">
                Learn more <ArrowUpRight size={15} />
              </a>
            )}
            {i === 1 && (
              <ul className="mt-4 space-y-1 text-xs">
                {['Market Penetration', 'Risk Mitigation', 'Value Optimization'].map((x) => (
                  <li className="flex gap-2" key={x}>
                    <Check size={13} />
                    {x}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}