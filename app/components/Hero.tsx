import { ArrowUpRight } from 'lucide-react';
import type { HeroSection } from '@/lib/db/schema';

interface HeroProps {
  data?: Partial<HeroSection> | null;
}

export default function Hero({ data }: HeroProps) {
  const eyebrow = data?.eyebrow || 'GLOBAL STRATEGY & ADVISORY';
  const heading = data?.heading || 'Navigating Regulatory Complexity Across Borders.';
  const subheading =
    data?.subheading ||
    'Comprehensive Audit, Tax, Legal, and Strategic Business Advisory services for the progressive future. Built on decades of trust and global execution.';
  const bgUrl =
    data?.imageUrl ||
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1800&q=85';
  const cta1Text = data?.cta1Text || 'Explore Practice Areas';
  const cta1Href = data?.cta1Href || '/practice-areas';
  const cta2Text = data?.cta2Text || 'Book a Consultation';
  const cta2Href = data?.cta2Href || '/contact';

  return (
    <section
      id="top"
      className="flex min-h-[590px] items-center bg-cover bg-center text-white"
      style={{
        backgroundImage: `linear-gradient(90deg,rgba(0,22,43,.9),rgba(0,22,43,.35)),url(${bgUrl})`,
      }}
    >
      <div className="animate-rise mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">
        <p className="mb-5 font-mono text-[11px] tracking-[.18em] text-sky-200 uppercase">
          {eyebrow}
        </p>
        <h1 className="font-serif text-5xl leading-[1.12] tracking-[-.045em] sm:text-6xl max-w-3xl">
          {heading}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-slate-200">
          {subheading}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href={cta2Href}
            className="inline-flex items-center gap-3 bg-sky-100 px-5 py-3.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-1 hover:shadow-xl"
          >
            {cta2Text} <ArrowUpRight size={17} />
          </a>
          <a
            href={cta1Href}
            className="inline-flex items-center gap-3 border border-white/70 px-5 py-3.5 text-sm font-semibold transition hover:-translate-y-1 hover:bg-white/10"
          >
            {cta1Text} <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}