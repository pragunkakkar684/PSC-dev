import { ArrowUpRight } from 'lucide-react';

export default function Hero() {
  return (
    <section
      id="top"
      className="flex min-h-[590px] items-center bg-[linear-gradient(90deg,rgba(0,22,43,.9),rgba(0,22,43,.35)),url('https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1800&q=85')] bg-cover bg-center text-white"
    >
      <div className="animate-rise mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">
        <p className="mb-5 font-mono text-[11px] tracking-[.18em] text-sky-200">
          GLOBAL STRATEGY & ADVISORY
        </p>
        <h1 className="font-serif text-5xl leading-[1.12] tracking-[-.045em] sm:text-6xl">
          Helping Businesses
          <br />
          Navigate Growth with
          <br />
          Confidence.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-slate-200">
          Comprehensive Audit, Tax, Legal, and Strategic Business Advisory services for the
          progressive future. Built on decades of trust and global execution.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#contact"
            className="inline-flex items-center gap-5 bg-sky-100 px-5 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-1 hover:shadow-xl"
          >
            Book a Consultation <ArrowUpRight size={17} />
          </a>
          <a
            href="#practice"
            className="inline-flex items-center gap-5 border border-white/70 px-5 py-3.5 text-sm font-semibold transition hover:-translate-y-1 hover:bg-white/10"
          >
            Explore Practice Areas <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}