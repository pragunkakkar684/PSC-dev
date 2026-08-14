import { Building2, Landmark, Scale, Users } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import Link from 'next/link';
import { getPublicHeroSection, getPublicFaqs } from '@/lib/queries/public';

const complexities: Array<[React.ElementType, string, string]> = [
  [Landmark, 'Regulatory Complexity', 'Establishing legal entities and maintaining compliance across shifting local and national tax frameworks requires rigorous oversight and localized expertise.'],
  [Users, 'Talent Acquisition', 'Sourcing, vetting, and retaining premium executive and technical talent in a highly competitive market demands a sophisticated recruitment apparatus.'],
  [Building2, 'Operational Infrastructure', 'Deploying secure technology infrastructure, standardized governance models, and physical workspaces without disrupting core global operations.'],
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

export default async function GCCPage() {
  const [hero, dbFaqs] = await Promise.all([
    getPublicHeroSection('gcc'),
    getPublicFaqs('gcc'),
  ]);

  return (
    <main id="top">
      <SiteHeader />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="font-mono text-[10px] tracking-[.18em] text-slate-500 uppercase">{hero.eyebrow || 'GLOBAL CAPABILITY CENTER'}</p>
          <h1 className="mt-4 max-w-lg font-serif text-5xl leading-[1.02] tracking-[-.04em] text-ink sm:text-6xl">
            {hero.heading || 'Building Global Operations From India With Confidence.'}
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-slate-600">
            {hero.subheading || "Navigate regulatory complexity, secure top-tier talent, and scale your enterprise with PSC's fully integrated Global Capability Center proposition."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="bg-ink px-5 py-3 text-center text-xs font-bold tracking-wide text-white transition hover:bg-slate-800">
              BOOK A STRATEGY CONSULTATION
            </Link>
            <a href="#services" className="border border-ink px-5 py-3 text-center text-xs font-bold tracking-wide transition hover:bg-slate-100">
              EXPLORE GCC SERVICES
            </a>
          </div>
        </div>
        <img
          className="h-[380px] w-full object-cover"
          src={hero.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85'}
          alt="GCC office"
        />
      </section>

      {/* Complexities */}
      <section className="bg-slate-50 px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-serif text-4xl text-ink">The GCC Challenge</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {complexities.map(([Icon, title, copy]) => (
              <div key={title} className="border border-slate-200 bg-white p-7">
                <Icon size={24} className="text-ink" />
                <h3 className="mt-4 font-serif text-xl text-ink">{title}</h3>
                <p className="mt-3 text-xs leading-6 text-slate-600">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <h2 className="text-center font-serif text-4xl text-ink">GCC Advisory &amp; Support Services</h2>
        <div className="mt-12 space-y-12">
          {services.map(([title, copy, image, align]) => (
            <div
              className={`flex flex-col gap-8 md:items-center ${
                align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'
              }`}
              key={title}
            >
              <img className="h-64 w-full object-cover md:w-1/2" src={image} alt={title} />
              <div className="md:w-1/2">
                <h3 className="font-serif text-3xl text-ink">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      {dbFaqs.length > 0 && (
        <section className="bg-[#fdf9f8] px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-serif text-4xl text-ink">GCC Frequently Asked Questions</h2>
            <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
              {dbFaqs.map((faq) => (
                <details className="group py-6" key={faq.id}>
                  <summary className="flex cursor-pointer list-none items-center justify-between font-serif text-xl italic text-ink">
                    {faq.question}
                    <span className="text-slate-400 transition-transform group-open:rotate-180">⌄</span>
                  </summary>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}