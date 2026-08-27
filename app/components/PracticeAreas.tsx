import { ArrowUpRight, Compass } from 'lucide-react';
import type { PracticeArea } from '@/lib/db/schema';

interface PracticeAreasProps {
  data?: Array<PracticeArea & { services?: Array<{ name: string }> }> | null;
}

const defaultAreas = [
  [
    '01',
    'INFRASTRUCTURE',
    'Structural Strategy & Operations',
    'Re-engineering organizational DNA to withstand the volatility of global markets. We focus on scalability, resilience, and operational excellence.',
    'bg-navy text-white md:col-span-2',
  ],
  [
    '02',
    'ANALYTICS',
    'Financial Forensics & Growth',
    'Deep-dive economic modeling and predictive analytics designed for C-suite decision making.',
    'bg-[#e7f1ff]',
  ],
  ['03', 'DIGITAL', 'Transformation', 'Harnessing emergent technologies to redefine industrial boundaries.', ''],
  [
    '04',
    'POLICY',
    'Global Compliance',
    'Navigating the intricate landscape of international regulation and ESG standards.',
    '',
  ],
  ['05', 'M&A', 'Advisory', 'Architecting seamless transitions and high-value mergers across continents.', ''],
];

export default function PracticeAreas({ data }: PracticeAreasProps) {
  const hasDbData = data && data.length > 0;

  return (
    <section
      id="practice"
      className="flex min-h-screen flex-col justify-center bg-[#fdf9f6] px-6 py-20 lg:px-10"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex justify-center">
          <span
            className="bg-[#e7f1ff] px-3 py-1.5 text-[10px] tracking-[.18em] text-slate-600 uppercase"
            style={{ fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }}
          >
            CORE COMPETENCIES
          </span>
        </div>
        <h2 className="mt-5 text-center font-serif text-5xl text-navy sm:text-6xl">
          Practice Areas
        </h2>
        <div className="mx-auto mt-5 h-0.5 w-10 bg-navy" />

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {hasDbData
            ? data.map((pa, idx) => (
                <article
                  className={`relative min-h-44 border border-slate-200 p-8 transition hover:-translate-y-1 hover:shadow-xl ${
                    idx === 0 ? 'bg-navy text-white md:col-span-2' : idx === 1 ? 'bg-[#e7f1ff]' : ''
                  }`}
                  key={pa.id}
                >
                  <div className="flex items-start justify-between">
                    <small className="text-[10px] tracking-widest opacity-65">
                      {pa.number || `0${idx + 1}`}. {pa.slug?.toUpperCase()}
                    </small>
                    {idx === 0 && <Compass size={22} className="text-white/80" />}
                  </div>
                  <h3 className="mt-6 font-serif text-3xl leading-tight font-medium">{pa.name}</h3>
                  <p className="mt-4 text-sm leading-6 opacity-75">{pa.shortDescription}</p>

                  {pa.services && pa.services.length > 0 && (
                    <ul className="mt-5 space-y-2.5 text-sm">
                      {pa.services.slice(0, 4).map((s) => (
                        <li className="flex items-center gap-2.5" key={s.name}>
                          <span className="h-1.5 w-1.5 shrink-0 bg-current" />
                          {s.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))
            : defaultAreas.map(([no, tag, title, copy, style], i) => (
                <article
                  className={`relative min-h-44 border border-slate-200 p-8 transition hover:-translate-y-1 hover:shadow-xl ${style}`}
                  key={title}
                >
                  <div className="flex items-start justify-between">
                    <small className="text-[10px] tracking-widest opacity-65">
                      {no}. {tag}
                    </small>
                    {i === 0 && <Compass size={22} className="text-white/80" />}
                  </div>
                  <h3 className="mt-6 font-serif text-3xl leading-tight font-medium">{title}</h3>
                  <p className="mt-4 text-sm leading-6 opacity-75">{copy}</p>
                  {i === 0 && (
                    <a href="/practice-areas" className="mt-8 inline-flex items-center gap-2 text-xs font-bold">
                      Learn more about Strategy <ArrowUpRight size={15} />
                    </a>
                  )}
                  {i === 1 && (
                    <ul className="mt-5 space-y-2.5 text-sm">
                      {['Market Penetration', 'Risk Mitigation', 'Value Optimization'].map((x) => (
                        <li className="flex items-center gap-2.5" key={x}>
                          <span className="h-1.5 w-1.5 shrink-0 bg-current" />
                          {x}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
        </div>
      </div>
    </section>
  );
}