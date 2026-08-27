import { Building2, Landmark, Scale, Users, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import { OfficeMap } from '../components/OfficeMap';
import Link from 'next/link';
import { getPublicHeroSection, getPublicFaqs } from '@/lib/queries/public';

const complexities: Array<[React.ElementType, string, string]> = [
  [Landmark, 'Regulatory Complexity', 'Navigating multi-layered compliance frameworks, FDI regulations, and evolving tax structures across central and state jurisdictions.'],
  [Users, 'Talent Acquisition', 'Securing leadership and specialized domain expertise in a highly competitive market while ensuring cultural alignment.'],
  [Building2, 'Operational Infrastructure', 'Deploying robust SEZ/STPI registrations, securing facilities, and deploying compliant IT and physical security frameworks.'],
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
] as const;

const stats = [
  ['150+', 'GCCs OPERATING'],
  ['1.3M', 'STEM GRADUATES ANNUALLY'],
  ['#1', 'DESTINATION FOR DIGITAL CAPABILITY'],
] as const;

const advisoryModel = [
  ['Legal & Structural', 'Entity formation, FDI structuring, and comprehensive corporate governance frameworks.'],
  ['Tax & Compliance', 'Direct/indirect tax strategy, transfer pricing, and continuous statutory compliance.'],
  ['Operational Setup', 'SEZ/STPI registrations, facility acquisition, and infrastructural deployment.'],
  ['Business Advisory', 'Talent strategy, vendor contract negotiation, and localized risk management.'],
] as const;

const capabilityBlocks = [
  {
    title: 'Entity Setup & Strategy',
    copy: 'Designing the optimal corporate structure (WOS, LLP, JV) tailored to your intellectual property, funding requirements, and operational timeline.',
    theme: 'light',
  },
  {
    title: 'Legal & Compliance',
    copy: 'Comprehensive oversight of FEMA regulations, labor laws, and intellectual property protection within the Indian jurisdiction.',
    theme: 'dark',
  },
  {
    title: 'Finance & Accounting',
    copy: 'Establishing scalable financial operations, statutory audits, treasury management, and continuous tax reporting frameworks.',
    theme: 'blue',
  },
  {
    title: 'Operational Advisory',
    copy: 'Navigating real estate acquisition, SEZ compliance, technology infrastructure deployment, and vendor ecosystem management.',
    theme: 'light',
  },
] as const;

const journeySteps = ['Assessment', 'Planning', 'Setup', 'Operate', 'Scale'];

const globalReachPoints = [
  'Cross-Border Tax & Transfer Pricing',
  'International IP Protection Frameworks',
  'Global Corporate Governance Alignment',
];

const gccOffices = [
  { id: 'blr', city: 'Bengaluru', isHeadquarters: true },
  { id: 'nyc', city: 'New York' },
  { id: 'lon', city: 'London' },
  { id: 'sin', city: 'Singapore' },
] as const;

const gccOfficeCoordinates: Record<string, [number, number]> = {
  Bengaluru: [77.5946, 12.9716],
  'New York': [-74.006, 40.7128],
  London: [-0.1276, 51.5074],
  Singapore: [103.8198, 1.3521],
};

const insights = [
  {
    tag: 'WHITEPAPER',
    title: 'Navigating SEZ Regulations in 2024',
    copy: 'Strategic implications for new capability centers establishing in Special Economic Zones.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=85',
  },
  {
    tag: 'CASE STUDY',
    title: 'Scaling a Fintech GCC to 500 Engineers',
    copy: 'How a European fintech navigated rapid talent acquisition and compliance hurdles.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=85',
  },
  {
    tag: 'ADVISORY',
    title: 'Transfer Pricing Strategies for Captive Centers',
    copy: 'Mitigating risk and ensuring compliance in cross-border intra-group transactions.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=85',
  },
] as const;

const defaultFaqs = [
  { id: '1', question: 'What is a Global Capability Center?', answer: 'A GCC is a dedicated offshore unit that centralizes finance, technology, or operational functions for a multinational enterprise.' },
  { id: '2', question: 'How long does entity incorporation take?', answer: 'Typical incorporation timelines in India range from 4-8 weeks depending on the entity structure chosen.' },
  { id: '3', question: 'Can you support ongoing compliance?', answer: 'Yes, our GCC advisory includes end-to-end statutory, tax, and regulatory compliance management.' },
];

export default async function GCCPage() {
  const [hero, dbFaqs] = await Promise.all([
    getPublicHeroSection('gcc'),
    getPublicFaqs('gcc'),
  ]);

  const faqs = dbFaqs.length > 0 ? dbFaqs : defaultFaqs;

  return (
    <main id="top">
      <SiteHeader />

      {/* HERO */}
      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="font-mono text-xs tracking-[.18em] text-slate-500 uppercase">{hero.eyebrow || 'GLOBAL CAPABILITY CENTER'}</p>
          <h1 className="mt-4 max-w-lg font-serif text-6xl leading-[1.02] tracking-[-.045em] text-ink sm:text-7xl">
            {hero.heading || 'Empowering Global Enterprises to Scale in India.'}
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-600 lg:text-lg">
            {hero.subheading || "Navigate the complexities of establishing and scaling your Global Capability Center with our integrated advisory, legal, and operational expertise. We architect structural integrity for your international expansion."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="bg-ink px-5 py-3 text-center text-xs font-bold tracking-wide text-white transition hover:bg-slate-800">
              TALK TO AN ADVISOR
            </Link>
            <a href="#services" className="border border-ink px-5 py-3 text-center text-xs font-bold tracking-wide transition hover:bg-slate-100">
              EXPLORE OUR MODEL
            </a>
          </div>
          <p className="mt-10 font-mono text-[11px] tracking-[.18em] text-slate-400 uppercase">
            Trusted by global organisations establishing operations across India
          </p>
        </div>
        <img
          className="h-[380px] w-full object-cover lg:h-[480px]"
          src={hero.imageUrl || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=85'}
          alt="GCC office"
        />
      </section>

      {/* WHY INDIA / STATS */}
      <section className="mx-auto grid max-w-7xl gap-10 border-t border-slate-200 px-6 py-20 lg:grid-cols-[1fr_1.4fr] lg:px-10">
        <div>
          <h2 className="font-serif text-4xl leading-[1.05] text-ink lg:text-5xl">
            Why India Has Become The Global Capability Hub.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-600 lg:text-base">
            A convergence of premier talent, robust digital infrastructure, and a maturing regulatory environment has positioned India as the definitive destination for enterprise capability centers.
          </p>
        </div>
        <div className="grid grid-cols-3 divide-x divide-slate-200 border-l border-slate-200">
          {stats.map(([value, label]) => (
            <div key={label} className="px-6">
              <p className="font-serif text-5xl text-ink lg:text-6xl">{value}</p>
              <p className="mt-3 font-mono text-[11px] leading-4 tracking-[.14em] text-slate-500 uppercase">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPLEXITY CHALLENGE */}
      <section className="bg-ink px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-center font-mono text-xs tracking-[.18em] text-slate-400 uppercase">
            Establishing Global Operations
          </p>
          <h2 className="mt-4 text-center font-serif text-5xl text-white lg:text-6xl">The Complexity Challenge</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-6 text-slate-400 lg:text-base">
            Establishing operations in India presents profound systemic challenges for global organizations without localized structural expertise.
          </p>
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {complexities.map(([Icon, title, copy]) => (
              <div key={title} className="border-t border-slate-700 pt-6">
                <Icon size={22} className="text-slate-300" />
                <h3 className="mt-4 font-serif text-xl text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STRUCTURAL INTEGRITY */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-10">
        <img
          className="h-[420px] w-full object-cover grayscale"
          src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1000&q=85"
          alt="Modern architecture"
        />
        <div>
          <p className="font-mono text-xs tracking-[.18em] text-slate-500 uppercase">The PSC Advantage</p>
          <h2 className="mt-4 font-serif text-4xl leading-[1.05] text-ink lg:text-5xl">
            Architecting Structural Integrity
          </h2>
          <p className="mt-6 text-sm leading-7 text-slate-600 lg:text-base">
            Global leaders partner with PSC Global to mitigate risk and accelerate their India entry. We provide a singular, comprehensive advisory shield that replaces the traditional fragmented approach of engaging disparate legal, accounting, and operational consultants.
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-600 lg:text-base">
            Our senior partners bring decades of institutional knowledge, navigating the intricacies of the Indian business landscape to build GCCs that are compliant by design, structurally sound, and scaled for long-term dominance.
          </p>
          <Link href="/team" className="mt-6 inline-block border-b border-ink text-xs font-bold tracking-wide text-ink">
            MEET OUR LEADERSHIP TEAM
          </Link>
        </div>
      </section>

      {/* INTEGRATED ADVISORY MODEL */}
      <section className="bg-slate-50 px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-serif text-4xl text-ink lg:text-5xl">The Integrated Advisory Model</h2>
          <p className="mt-4 text-center text-sm text-slate-600 lg:text-base">
            A unified methodology contrasting the risk of fragmented execution.
          </p>
          <div className="relative isolate mt-16 grid gap-6 sm:grid-cols-2">
            <div className="absolute top-1/2 left-1/2 z-20 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink font-serif text-xs tracking-wide text-white shadow-lg sm:flex">
              PSC
            </div>
            {advisoryModel.map(([title, copy]) => (
              <div key={title} className="relative z-0 border border-slate-200 bg-white p-8">
                <h3 className="font-serif text-2xl text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITY ARCHITECTURE */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <h2 className="font-serif text-4xl text-ink lg:text-5xl">
          Comprehensive Capability
          <br />
          Architecture
        </h2>
        <div className="mt-12 grid gap-1 md:grid-cols-2">
          {capabilityBlocks.map((block) => (
            <div
              key={block.title}
              className={`flex min-h-[220px] flex-col justify-end p-8 ${
                block.theme === 'dark'
                  ? 'bg-ink text-white'
                  : block.theme === 'blue'
                  ? 'bg-sky-100 text-ink'
                  : 'bg-slate-100 text-ink'
              }`}
            >
              <h3 className="font-serif text-2xl">{block.title}</h3>
              <p className={`mt-3 max-w-sm text-sm leading-6 ${block.theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                {block.copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* IMPLEMENTATION JOURNEY */}
      <section className="border-t border-slate-200 px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-4xl text-ink lg:text-5xl">The Implementation Journey</h2>
          <div className="mt-16 grid grid-cols-2 items-start gap-8 border-t border-dashed border-slate-300 pt-8 sm:grid-cols-3 lg:grid-cols-5">
            {journeySteps.map((step, i) => (
              <div key={step} className="text-center">
                <p className="font-serif text-5xl text-slate-200 lg:text-6xl">{String(i + 1).padStart(2, '0')}</p>
                <p className="mt-3 font-mono text-[11px] tracking-[.14em] text-slate-500 uppercase">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GLOBAL REACH */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 border-t border-slate-200 px-6 py-24 lg:grid-cols-2 lg:px-10">
        <div>
          <h2 className="font-serif text-4xl leading-[1.05] text-ink lg:text-5xl">
            Global Reach.
            <br />
            Local Depth.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-slate-600 lg:text-base">
            We bridge the operational gap between your global headquarters and Indian operations. Our frameworks are designed to satisfy rigorous international compliance standards while executing flawlessly within local regulatory environments.
          </p>
          <ul className="mt-6 space-y-3">
            {globalReachPoints.map((point) => (
              <li key={point} className="flex items-center gap-3 text-sm text-slate-700">
                <span className="h-1.5 w-1.5 shrink-0 bg-ink" />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <Suspense
          fallback={
            <div className="flex h-72 items-center justify-center bg-slate-100 lg:h-96">
              <p className="font-mono text-xs tracking-[.14em] text-slate-400 uppercase">Loading Global Operations Map</p>
            </div>
          }
        >
          <OfficeMap
            offices={gccOffices}
            coordinates={gccOfficeCoordinates}
            label="OUR GLOBAL FOOTPRINT"
          />
        </Suspense>
      </section>

      {/* STRATEGIC INSIGHTS */}
      <section className="mx-auto max-w-7xl border-t border-slate-200 px-6 py-24 lg:px-10">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-4xl text-ink lg:text-5xl">Strategic Insights</h2>
          <Link href="/insights" className="hidden items-center gap-1 text-xs font-bold tracking-wide text-ink sm:flex">
            VIEW ALL INSIGHTS <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {insights.map((post) => (
            <div key={post.title}>
              <img className="h-48 w-full object-cover" src={post.image} alt={post.title} />
              <p className="mt-4 font-mono text-[11px] tracking-[.14em] text-slate-500 uppercase">{post.tag}</p>
              <h3 className="mt-2 font-serif text-xl text-ink">{post.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{post.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center border-t border-slate-200 px-6 py-20 lg:px-10">
        <h2 className="text-center font-serif text-5xl text-ink lg:text-6xl">GCC Advisory &amp; Support Services</h2>
        <div className="mt-12 space-y-12">
          {services.map(([title, copy, image, align]) => (
            <div
              className={`flex flex-col gap-8 md:items-center ${
                align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'
              }`}
              key={title}
            >
              <img className="h-64 w-full object-cover md:h-80 md:w-1/2" src={image} alt={title} />
              <div className="md:w-1/2">
                <h3 className="font-serif text-3xl text-ink lg:text-4xl">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600 lg:text-base">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sky-50 px-6 py-24 text-center lg:px-10">
        <h2 className="font-serif text-5xl leading-[1.05] text-ink lg:text-6xl">
          Let&apos;s Build Your India
          <br />
          Capability Center.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-600 lg:text-base">
          Engage our senior advisory team to architect a robust, compliant, and scalable foundation for your global operations.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="bg-ink px-5 py-3 text-center text-xs font-bold tracking-wide text-white transition hover:bg-slate-800">
            SCHEDULE CONSULTATION
          </Link>
          <Link href="/case-studies" className="border border-ink px-5 py-3 text-center text-xs font-bold tracking-wide transition hover:bg-white">
            VIEW CASE STUDIES
          </Link>
        </div>
      </section>

      {/* FAQS */}
      {faqs.length > 0 && (
        <section className="border-t border-slate-200 bg-[#fdf9f8] px-6 py-16 lg:px-10">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center font-serif text-5xl text-ink lg:text-6xl">GCC Frequently Asked Questions</h2>
            <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
              {faqs.map((faq) => (
                <details className="group py-6" key={faq.id}>
                  <summary className="flex cursor-pointer list-none items-center justify-between font-serif text-xl italic text-ink lg:text-2xl">
                    {faq.question}
                    <span className="text-slate-400 transition-transform group-open:rotate-180">⌄</span>
                  </summary>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 lg:text-base">{faq.answer}</p>
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