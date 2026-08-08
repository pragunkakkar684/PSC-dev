import { Building2, Landmark, Scale, Users } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';

const complexities = [
  [Landmark, 'Regulatory Complexity', 'Establishing legal entities and maintaining compliance across shifting local and national tax frameworks requires rigorous oversight and localized expertise.'],
  [Users, 'Talent Acquisition', 'Sourcing, vetting, and retaining premium executive and technical talent in a highly competitive market demands a sophisticated recruitment apparatus.'],
  [Building2, 'Operational Infrastructure', 'Deploying secure technology infrastructure, standardized governance models, and physical workspaces without disrupting core global operations.'],
];

const stats = [
  ['1,500+', 'GLOBAL CENTERS', 'Multinational corporations operating dedicated capability centers across tier-1 and tier-2 Indian hubs.'],
  ['1.3M', 'STEM GRADUATES ANNUALLY', 'An unparalleled talent ecosystem driving advanced engineering, analytics, and operational excellence.'],
];

const services = [
  [
    'Finance & Accounting',
    'Deploy robust financial controls, reporting mechanisms, and transaction processing units. We build finance functions that integrate seamlessly with your global ERP and standard operating procedures.',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=85',
    'left',
  ],
  [
    'Tax, Legal & Corporate',
    "Navigate India's FDI regulations, corporate law, and direct/indirect tax frameworks. From entity incorporation to ongoing statutory compliance and transfer pricing strategies.",
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1000&q=85',
    'right',
  ],
];

const faqs = [
  ['How long does it take to establish a fully operational GCC?', 'Timelines vary by scope, but most fully operational centers are stood up within 4 to 6 months from initial strategy consultation to go-live, including entity setup, hiring, and infrastructure deployment.'],
  ['How does PSC handle talent acquisition and retention?', 'We combine executive search, structured competency frameworks, and localized compensation benchmarking to attract and retain premium technical and leadership talent across India\u2019s major hubs.'],
  ['What governance models do you implement?', 'We design governance structures tailored to your global operating model, spanning board oversight, standardized reporting cadences, and compliance checkpoints aligned with both Indian and international standards.'],
];

export default function GCCPage() {
  return (
    <main id="top">
      <SiteHeader />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="font-mono text-[10px] tracking-[.18em] text-slate-500">GLOBAL CAPABILITY CENTER</p>
          <h1 className="mt-4 max-w-lg font-serif text-5xl leading-[1.02] tracking-[-.04em] text-ink sm:text-6xl">
            Building Global Operations From India With Confidence.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-slate-600">
            Navigate regulatory complexity, secure top-tier talent, and scale your enterprise
            with PSC&apos;s fully integrated Global Capability Center proposition. We combine
            advisory, legal, and operational execution.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="bg-ink px-5 py-3 text-center text-xs font-bold tracking-wide text-white">
              BOOK A STRATEGY CONSULTATION
            </a>
            <a href="#services" className="border border-ink px-5 py-3 text-center text-xs font-bold tracking-wide">
              EXPLORE GCC SERVICES
            </a>
          </div>
        </div>
        <img
          className="h-[420px] w-full object-cover"
          src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1100&q=85"
          alt="PSC Global capability center office"
        />
      </section>

      <section className="bg-navy px-6 py-20 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-serif text-5xl">Navigating The Complexities of Scale</h2>
          <div className="mt-14 grid divide-y divide-slate-700 border border-slate-700 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {complexities.map(([Icon, title, copy]) => (
              <div className="p-8" key={title}>
                <Icon className="text-slate-300" size={22} strokeWidth={1.5} />
                <h3 className="mt-6 font-serif text-2xl leading-tight">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-300">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          <div>
            <h2 className="font-serif text-3xl leading-tight text-ink">The Strategic Imperative of India</h2>
            <p className="mt-5 text-sm leading-7 text-slate-600">
              India has evolved beyond cost arbitrage. It is the definitive destination for
              scalable innovation, housing the world&apos;s deepest pool of technical and
              operational leadership.
            </p>
          </div>
          {stats.map(([num, label, copy]) => (
            <div className="border-l border-slate-200 pl-8" key={label}>
              <b className="font-serif text-6xl text-ink">{num}</b>
              <p className="mt-3 text-xs font-bold tracking-wide text-slate-500">{label}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="px-6 py-20 lg:px-10">
        <h2 className="text-center font-serif text-4xl text-ink">Comprehensive GCC Services</h2>
        <p className="mx-auto mt-5 max-w-xl text-center text-sm leading-6 text-slate-600">
          A unified, end-to-end framework encompassing advisory, legal entity setup, and
          ongoing operational management.
        </p>

        <div className="mx-auto mt-16 max-w-7xl space-y-20">
          {services.map(([title, copy, img, side]) => (
            <div className="grid items-center gap-10 md:grid-cols-2" key={title}>
              {side === 'left' && <img className="h-[380px] w-full object-cover" src={img} alt={title} />}
              <div>
                <Scale className="text-ink" size={22} strokeWidth={1.5} />
                <h3 className="mt-6 font-serif text-3xl text-ink">{title}</h3>
                <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">{copy}</p>
                <a className="mt-5 inline-block border-b border-ink text-xs font-bold tracking-wide text-ink" href="#contact">
                  LEARN MORE
                </a>
              </div>
              {side === 'right' && <img className="h-[380px] w-full object-cover" src={img} alt={title} />}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#fdf9f8] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-serif text-4xl text-ink">Frequently Asked Questions</h2>
          <div className="mt-10 divide-y divide-slate-200 border-t border-slate-200">
            {faqs.map(([q, a]) => (
              <details className="group py-6" key={q}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-xl italic text-ink">
                  {q}
                  <span className="shrink-0 text-slate-400 transition-transform group-open:rotate-180">⌄</span>
                </summary>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-6 py-24 text-center">
        <h2 className="mx-auto max-w-2xl font-serif text-5xl leading-tight text-ink">
          Let&apos;s Build Your India Operations.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-slate-600">
          Engage our specialized GCC advisory team to blueprint a secure, scalable, and
          compliant strategy for your global expansion.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#top" className="bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white">
            BOOK A STRATEGY CONSULTATION
          </a>
          <a href="#top" className="flex items-center gap-2 border border-ink px-5 py-3 text-xs font-bold tracking-wide">
            SPEAK WITH A GCC SPECIALIST
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}