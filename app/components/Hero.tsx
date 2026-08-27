import { ArrowUpRight } from 'lucide-react';
import type { HeroSection } from '@/lib/db/schema';

interface HeroProps {
  data?: Partial<HeroSection> | null;
}

export default function Hero({ data }: HeroProps) {
  const eyebrow = data?.eyebrow || 'GLOBAL STRATEGY & ADVISORY';
  const heading = data?.heading || 'Helping Businesses Navigate Growth with Confidence.';
  const subheading =
    data?.subheading ||
    'Comprehensive Audit, Tax, Legal, and Strategic Business Advisory services for the modern global enterprise. Trust built on decades of excellence.';
  const bgUrl =
    data?.imageUrl ||
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1800&q=85';
  const cta1Text = data?.cta1Text || 'Explore Practice Areas';
  const cta1Href = data?.cta1Href || '/practice-areas';
  const cta2Text = data?.cta2Text || 'Book a Consultation';
  const cta2Href = data?.cta2Href || '/contact';

  return (
    <section
      id="top"
      className="flex h-[90dvh] min-h-[600px] items-center bg-cover bg-center text-white"
      style={{
        backgroundImage: `linear-gradient(90deg,rgba(0,22,43,.9),rgba(0,22,43,.35)),url(${bgUrl})`,
      }}
    >
      <div className="animate-rise mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">
        <p
          className="mb-5 text-[11px] tracking-[.18em] text-sky-200 uppercase"
          style={{ fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }}
        >
          {eyebrow}
        </p>
        <h1 className="font-serif font-semibold text-6xl leading-[1.12] tracking-[-.02em] sm:text-7xl max-w-3xl">
          {heading}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-slate-200">
          {subheading}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href={cta2Href}
            className="inline-flex items-center gap-3 bg-slate-600/80 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:-translate-y-1 hover:bg-slate-600 hover:shadow-xl"
          >
            {cta2Text} <ArrowUpRight size={17} />
          </a>
          <a
            href={cta1Href}
            className="inline-flex items-center gap-3 bg-white/95 px-5 py-3.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl"
          >
            {cta1Text}
          </a>
        </div>
      </div>
    </section>
  );
}