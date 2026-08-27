import {
  ArrowRight,
  ArrowUpRight,
  Landmark,
  MessageSquare,
  Scale,
  Share2,
  Shield,
  ShieldCheck,
  TrendingUp,
  Users,
  Globe,
  Check,
} from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import RevealProvider from '../components/RevealProvider';
import Stats from '../components/Stats';
import Link from 'next/link';
import { ALLOWED_ICONS } from '@/app/admin/(dashboard)/components/IconPicker';
import {
  getPublicHeroSection,
  getPublicPracticeAreas,
} from '@/lib/queries/public';

const connectedCards = [
  ['One Engagement', 'A single point of accountability for multiple service lines, reducing friction and ensuring consistency.'],
  ['Connected Expertise', 'Cross-practice squads that meet daily to align strategy across tax, legal, and operational domains.'],
  ['End-to-End Perspective', 'From initial market entry feasibility to ongoing payroll and global statutory compliance.'],
];

const gccFeatures: Array<[React.ElementType, string, string]> = [
  [Globe, 'Cross-Border Hubs', 'Seamlessly connecting your headquarters with regional capability centers.'],
  [ShieldCheck, 'Regulatory Shield', 'Ensuring your global operations meet all local fiscal and legal mandates.'],
  [Users, 'Talent Architecture', 'Designing the organizational structures that attract and retain elite performers.'],
];

// Fallback scenarios — hardcoded for now, always used regardless of DB/CMS content.
// TODO: wire this up to a real CMS-backed source (e.g. getPublicScenarios()) once
// the database has scenario entries populated. Until then, do not make this
// conditional on any fetched data — always render these three.
const defaultScenarios = [
  {
    id: 'scenario-1',
    label: 'SCENARIO 01',
    title: 'Entering the Indian Market',
    description:
      "How our Legal, Tax, and Business Advisory teams work together to ensure a friction-free market entry for a Fortune 500 tech firm.",
  },
  {
    id: 'scenario-2',
    label: 'SCENARIO 02',
    title: 'Scaling Global Operations',
    description:
      'The integration of ERP implementation, process outsourcing, and risk assurance for a rapidly expanding manufacturing giant.',
  },
  {
    id: 'scenario-3',
    label: 'SCENARIO 03',
    title: 'Managing Regulatory Complexity',
    description:
      'How our Tax and Corporate Law teams navigated new global minimum tax rules for a diversified conglomerate.',
  },
];

const challengeSteps = ['Strategy', 'Finance', 'Regulation', 'Legal', 'Operations'];

const defaultPractices = [
  {
    id: '1',
    number: '01',
    name: 'Risk & Assurance',
    heading: 'Rigorous Oversight for Uncompromising Integrity.',
    shortDescription:
      'Our assurance practice goes beyond standard compliance. We provide deep-dive forensic insights that reveal operational vulnerabilities and strengthen governance frameworks.',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=85',
    iconName: null,
    services: [
      { name: 'Statutory Audit' },
      { name: 'Internal Audit & Controls' },
      { name: 'Forensic Audit' },
      { name: 'Risk Assessment' },
    ],
  },
  {
    id: '2',
    number: '02',
    name: 'Tax & Fiscal Advisory',
    heading: 'Strategic Tax Architecture for Global Growth.',
    shortDescription:
      'We navigate the complexities of direct and indirect taxation, ensuring efficiency while maintaining absolute regulatory compliance across multiple jurisdictions.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85',
    iconName: null,
    services: [
      { name: 'Direct Taxation' },
      { name: 'Indirect Tax (GST/VAT)' },
      { name: 'International Taxation' },
      { name: 'Transfer Pricing' },
    ],
  },
  {
    id: '3',
    number: '03',
    name: 'Corporate Law',
    heading: 'Legal Frameworks Built for Certainty.',
    shortDescription:
      'From incorporation to cross-border contracts, our legal practice provides the structural clarity businesses need to operate with confidence.',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1000&q=85',
    iconName: null,
    services: [
      { name: 'Corporate Structuring' },
      { name: 'Contract Advisory' },
      { name: 'Dispute Resolution' },
      { name: 'Regulatory Filings' },
    ],
  },
  {
    id: '4',
    number: '04',
    name: 'Business Advisory',
    heading: 'Growth Strategy Grounded in Data.',
    shortDescription:
      'We combine market intelligence with operational rigor to help leadership teams make confident, defensible decisions.',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=85',
    iconName: null,
    services: [
      { name: 'Market Entry Strategy' },
      { name: 'Feasibility Studies' },
      { name: 'Valuation Advisory' },
      { name: 'Performance Improvement' },
    ],
  },
  {
    id: '5',
    number: '05',
    name: 'Business Process Advisory',
    heading: 'Operational Excellence at Every Layer.',
    shortDescription:
      'We re-engineer core processes — from ERP rollouts to shared services — so operations scale without adding friction.',
    imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=85',
    iconName: null,
    services: [
      { name: 'ERP Implementation' },
      { name: 'Process Outsourcing' },
      { name: 'Shared Services Design' },
      { name: 'Automation & RPA' },
    ],
  },
];

export default async function PracticeAreasPage() {
  const [hero, dbPractices] = await Promise.all([
    getPublicHeroSection('practice-areas'),
    getPublicPracticeAreas(),
  ]);

  const practices = dbPractices.length > 0 ? dbPractices : defaultPractices;

  // Scenarios are intentionally NOT sourced from the DB right now — always
  // use the hardcoded fallback until a CMS-backed source is wired up.
  const scenarios = defaultScenarios;

  return (
    <main id="top">
      <SiteHeader />

      {/* HERO */}
      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1fr_.9fr] lg:px-10">
        <div>
          <p className="font-mono text-xs tracking-[.18em] text-slate-500 uppercase">{hero.eyebrow || 'OUR EXPERTISE'}</p>
          <h1 className="mt-4 max-w-xl font-serif text-6xl leading-[1.02] tracking-[-.045em] text-ink sm:text-7xl">
            {hero.heading || 'Expertise Across Every Dimension of Business.'}
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-600 lg:text-lg">
            {hero.subheading || 'We provide a multidimensional approach to global advisory, merging deep local knowledge with international standards to navigate complex regulatory and fiscal landscapes.'}
          </p>
          <div className="mt-8 flex gap-3">
            <a href="#capabilities" className="flex items-center gap-2 bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
              Explore Our Expertise <ArrowRight size={16} />
            </a>
            <Link href="/contact" className="flex items-center gap-2 border border-ink px-5 py-3 text-sm font-medium transition hover:bg-slate-100">
              Speak With an Advisor <MessageSquare size={16} />
            </Link>
          </div>
        </div>
        <div className="relative">
          <img
            className="h-[360px] w-full object-cover lg:h-[460px]"
            src={hero.imageUrl || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85'}
            alt="Business meeting"
          />
          <div className="absolute -bottom-10 left-0 w-64 bg-navy p-5 text-sm leading-6 text-white sm:-left-10">
            &quot;Architecture in business is not just about structure; it&apos;s about the resilience to withstand global shifts.&quot;
          </div>
        </div>
      </section>

      {/* MULTIDISCIPLINARY EXPERTISE */}
      <section className="border-y border-slate-100 px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[220px_1fr]">
          <p className="font-mono text-xs tracking-[.18em] text-slate-500">MULTIDISCIPLINARY EXPERTISE</p>
          <div>
            <h2 className="font-serif text-5xl leading-tight text-ink lg:text-6xl">
              One Firm. Multiple Disciplines. One Integrated Perspective.
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <p className="text-base leading-7 text-slate-600 lg:text-lg">
                In an increasingly interconnected global economy, business challenges rarely
                exist in isolation. A tax implication in one region often triggers a regulatory
                requirement in another, which in turn impacts operational efficiency.
              </p>
              <p className="text-base leading-7 text-slate-600 lg:text-lg">
                At Advisory Global, we have structured our practice areas to operate as a
                single, fluid ecosystem. Our partners collaborate across borders and
                disciplines to ensure our clients receive not just a service, but a holistic
                architectural solution for their most complex challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRACTICE AREAS GRID */}
      <section id="capabilities" className="mx-auto max-w-7xl border-t border-slate-200 px-6 py-20 lg:px-10">
        <p className="font-mono text-xs tracking-[.18em] text-slate-500">CORE CAPABILITIES</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-serif text-5xl text-ink lg:text-6xl">Our Practice Areas</h2>
          <div className="text-right">
            <p className="font-mono text-xs tracking-[.14em] text-slate-400">EST. 2002</p>
            <i className="font-serif text-xl text-slate-500 lg:text-2xl">Global Standards</i>
          </div>
        </div>

        <div className="mt-8 grid border-t border-slate-200 md:grid-cols-3 lg:grid-cols-5">
          {practices.map((pa, idx) => {
            const IconComp = (pa.iconName && ALLOWED_ICONS[pa.iconName]) || Shield;
            return (
              <article className="min-h-52 border-l border-slate-200 p-5 first:border-l-0" key={pa.id}>
                <small className="text-xs tracking-widest text-slate-400">{pa.number || `0${idx + 1}`}</small>
                <h3 className="mt-5 font-serif text-2xl leading-tight text-ink lg:text-3xl">{pa.name}</h3>
                <IconComp className="mt-8 text-ink" size={22} strokeWidth={1.5} />
              </article>
            );
          })}
        </div>
      </section>

      {/* PRACTICE AREA DETAILS */}
      {practices.map((pa, idx) => {
        const reversed = idx % 2 === 1;
        const bg = idx % 2 === 0 ? 'bg-[#fdf8f3]' : 'bg-slate-100';
        const IconComp = (pa.iconName && ALLOWED_ICONS[pa.iconName]) || Shield;
        return (
          <section key={pa.id} className={`${bg} px-6 py-24 lg:px-10`}>
            <div
              className={`mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 ${
                reversed ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={pa.imageUrl || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85'}
                    alt={pa.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <p className="font-mono text-xs tracking-[.18em] text-sky-700">
                    {pa.number || `0${idx + 1}`} {pa.name.toUpperCase()}
                  </p>
                  <h2 className="mt-4 max-w-lg font-serif text-4xl leading-[1.05] text-ink lg:text-5xl">
                    {pa.heading || pa.name}
                  </h2>
                  <p className="mt-6 max-w-md text-base leading-7 text-slate-600">
                    {pa.shortDescription}
                  </p>
                  <div className="mt-8 border-t border-slate-300" />
                  {pa.services?.length > 0 && (
                    <ul className="mt-8 space-y-5">
                      {pa.services.map((s) => (
                        <li key={s.name} className="font-serif text-2xl text-ink lg:text-3xl">
                          {s.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
            </div>
          </section>
        );
      })}

      {/* COMPLEX CHALLENGES / CONNECTED MODEL */}
      <section className="border-t border-slate-700/60 bg-navy px-6 py-24 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
            <h2 className="max-w-2xl font-serif text-5xl leading-[1.05] lg:text-6xl">
              Complex Challenges Rarely Exist in Isolation.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 lg:text-lg">
              Our interconnected framework ensures that every strategic move is validated
              against financial, regulatory, and legal perspectives simultaneously.
            </p>

          <div className="mt-16 flex flex-wrap items-center gap-3">
            {challengeSteps.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                  <div className="flex h-20 w-40 items-center justify-center border border-slate-600 text-center">
                    <span className="font-mono text-xs tracking-[.14em] text-slate-200">
                      {step.toUpperCase()}
                    </span>
                  </div>
                {i < challengeSteps.length - 1 && (
                  <ArrowRight className="hidden text-slate-500 md:block" size={18} />
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {connectedCards.map(([title, copy], i) => (
              <RevealProvider key={title} delay={i * 100}>
                <div>
                  <div className="h-px w-6 bg-slate-500" />
                  <h3 className="mt-6 font-serif text-2xl lg:text-3xl">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300 lg:text-base">{copy}</p>
                </div>
              </RevealProvider>
            ))}
          </div>
        </div>
      </section>

      {/* GLOBAL CAPABILITY CENTERS */}
      <section className="bg-[#dbeafe] px-6 py-24 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="max-w-xl font-serif text-5xl leading-[1.05] text-ink lg:text-6xl">
                Building Global Capability From India to the World.
              </h2>
              <p className="mt-6 max-w-md text-base leading-7 text-slate-700 lg:text-lg">
                Our India-based Global Capability Center (GCC) advisory helps multinational
                corporations tap into the world&apos;s most vibrant talent pool while ensuring
                global operational standards.
              </p>
              <div className="mt-10 flex gap-12">
                <div>
                  <p className="font-serif text-4xl text-ink">50+</p>
                  <p className="mt-1 font-mono text-xs tracking-[.14em] text-slate-600">
                    GCCS ESTABLISHED
                  </p>
                </div>
                <div>
                  <p className="font-serif text-4xl text-ink">24/7</p>
                  <p className="mt-1 font-mono text-xs tracking-[.14em] text-slate-600">
                    SUPPORT ECOSYSTEM
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#eef4fc] p-8 lg:p-10">
              <div className="space-y-8">
                {gccFeatures.map(([Icon, title, copy]) => (
                  <div key={title} className="flex gap-4">
                    <Icon className="mt-1 shrink-0 text-ink" size={20} strokeWidth={1.5} />
                    <div>
                      <h3 className="font-serif text-xl text-ink lg:text-2xl">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </section>

      {/* SCENARIOS */}
      <section className="px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
            <p className="text-center font-mono text-xs tracking-[.18em] text-slate-500">
              SCENARIO-BASED COLLABORATION
            </p>

          <div className="mt-12 grid border-t border-slate-200 md:grid-cols-3">
            {scenarios.map((scenario, i) => (
              <RevealProvider key={scenario.id} delay={i * 100}>
                <div className="border-l border-slate-200 p-6 first:border-l-0 lg:p-8">
                  <p className="font-mono text-xs tracking-[.14em] text-slate-400">{scenario.label}</p>
                  <h3 className="mt-4 font-serif text-2xl italic leading-tight text-ink lg:text-3xl">
                    {scenario.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{scenario.description}</p>
                  <a
                    href="#"
                    className="mt-6 inline-flex items-center gap-2 font-mono text-xs tracking-[.1em] text-ink hover:text-sky-700"
                  >
                    READ CASE STUDY <ArrowUpRight size={14} />
                  </a>
                </div>
              </RevealProvider>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <Stats />

      {/* FINAL CTA */}
      <section className="bg-[#eaf2fb] px-6 py-24 text-center lg:px-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-5xl leading-[1.05] text-ink lg:text-6xl">
              Complex Business Challenges Require Connected Thinking.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-600 lg:text-lg">
              Let&apos;s discuss how our multidisciplinary team can provide the architectural
              clarity your organization needs to thrive on a global scale.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="bg-ink px-6 py-4 font-mono text-xs tracking-[.14em] text-white transition hover:bg-slate-800"
              >
                BOOK A CONSULTATION
              </Link>
              <Link
                href="/contact"
                className="border border-ink px-6 py-4 font-mono text-xs tracking-[.14em] text-ink transition hover:bg-slate-100"
              >
                CONTACT US
              </Link>
            </div>
          </div>
      </section>

      <Footer />
    </main>
  );
}