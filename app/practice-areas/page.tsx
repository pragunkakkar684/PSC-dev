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
} from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';

const practices = [
  ['01', 'Risk & Assurance', Shield],
  ['02', 'Tax & Fiscal Advisory', Landmark],
  ['03', 'Corporate Law', Scale],
  ['04', 'Business Advisory', TrendingUp],
  ['05', 'Business Process Advisory', Share2],
];

const connectedCards = [
  ['One Engagement', 'A single point of accountability for multiple service lines, reducing friction and ensuring consistency.'],
  ['Connected Expertise', 'Cross-practice squads that meet daily to align strategy across tax, legal, and operational domains.'],
  ['End-to-End Perspective', 'From initial market entry feasibility to ongoing payroll and global statutory compliance.'],
];

const gccFeatures = [
  [Globe, 'Cross-Border Hubs', 'Seamlessly connecting your headquarters with regional capability centers.'],
  [ShieldCheck, 'Regulatory Shield', 'Ensuring your global operations meet all local fiscal and legal mandates.'],
  [Users, 'Talent Architecture', 'Designing the organizational structures that attract and retain elite performers.'],
];

const scenarios = [
  ['SCENARIO 01', 'Entering the Indian Market', "How our Legal, Tax, and Business Advisory teams work together to ensure a friction-free market entry for a Fortune 500 tech firm."],
  ['SCENARIO 02', 'Scaling Global Operations', 'The integration of ERP implementation, process outsourcing, and risk assurance for a rapidly expanding manufacturing giant.'],
  ['SCENARIO 03', 'Managing Regulatory Complexity', 'How our Tax and Corporate Law teams navigated new global minimum tax rules for a diversified conglomerate.'],
];

const stats = [
  ['22+', 'YEARS OF EXPERTISE'],
  ['1,000+', 'GLOBAL BUSINESSES'],
  ['15+', 'COUNTRIES SERVED'],
  ['250+', 'SENIOR ADVISORS'],
];

export default function PracticeAreasPage() {
  return (
    <main id="top">
      <SiteHeader />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1fr_.9fr] lg:px-10 lg:py-18">
        <div>
          <p className="font-mono text-[10px] tracking-[.18em] text-slate-500">OUR EXPERTISE</p>
          <h1 className="mt-4 max-w-xl font-serif text-5xl leading-[1.02] tracking-[-.04em] text-ink sm:text-6xl">
            Expertise Across Every Dimension of Business.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-slate-600">
            We provide a multidimensional approach to global advisory, merging deep local
            knowledge with international standards to navigate complex regulatory and fiscal
            landscapes.
          </p>
          <div className="mt-8 flex gap-3">
            <a href="#capabilities" className="flex items-center gap-2 bg-ink px-5 py-3 text-sm font-medium text-white">
              Explore Our Expertise <ArrowRight size={15} />
            </a>
            <a href="#contact" className="flex items-center gap-2 border border-ink px-5 py-3 text-sm font-medium">
              Speak With an Advisor <MessageSquare size={15} />
            </a>
          </div>
        </div>
        <div className="relative">
          <img
            className="h-[360px] w-full object-cover"
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85"
            alt="Business meeting"
          />
          <div className="absolute bottom-0 right-0 w-64 bg-navy p-5 text-xs leading-5 text-white">
            &quot;Architecture in business is not just about structure; it&apos;s about the
            resilience to withstand global shifts.&quot;
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 px-6 py-16 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[220px_1fr]">
          <p className="font-mono text-[10px] tracking-[.18em] text-slate-500">MULTIDISCIPLINARY EXPERTISE</p>
          <div>
            <h2 className="font-serif text-4xl leading-tight text-ink">
              One Firm. Multiple Disciplines. One Integrated Perspective.
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <p className="text-sm leading-7 text-slate-600">
                In an increasingly interconnected global economy, business challenges rarely
                exist in isolation. A tax implication in one region often triggers a regulatory
                requirement in another, which in turn impacts operational efficiency.
              </p>
              <p className="text-sm leading-7 text-slate-600">
                At Advisory Global, we have structured our practice areas to operate as a
                single, fluid ecosystem. Our partners collaborate across borders and
                disciplines to ensure our clients receive not just a service, but a holistic
                architectural solution for their most complex challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="capabilities" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <p className="font-mono text-[10px] tracking-[.18em] text-slate-500">CORE CAPABILITIES</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-serif text-5xl text-ink">Our Practice Areas</h2>
          <div className="text-right">
            <p className="font-mono text-[10px] tracking-[.14em] text-slate-400">EST. 2002</p>
            <i className="font-serif text-xl text-slate-500">Global Standards</i>
          </div>
        </div>
        <div className="mt-8 grid border-t border-slate-200 md:grid-cols-5">
          {practices.map(([no, name, Icon]) => (
            <article className="min-h-52 border-l border-slate-200 p-5 first:border-l-0" key={name}>
              <small className="text-[10px] tracking-widest text-slate-400">{no}</small>
              <h3 className="mt-5 font-serif text-xl leading-tight text-ink">{name}</h3>
              <Icon className="mt-8 text-ink" size={18} strokeWidth={1.5} />
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:px-10">
        <div>
          <p className="font-mono text-[10px] tracking-[.18em] text-slate-500">01 RISK & ASSURANCE</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-ink">
            Rigorous Oversight for Uncompromising Integrity.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
            Our assurance practice goes beyond standard compliance. We provide deep-dive
            forensic insights that reveal operational vulnerabilities and strengthen governance
            frameworks.
          </p>
          <div className="mt-6 max-w-md border-t border-slate-200" />
          <ul className="mt-7 space-y-5 font-serif text-xl text-ink">
            {['Statutory Audit', 'Internal Audit & Controls', 'Forensic Audit', 'Risk Assessment'].map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <img
          className="h-[420px] w-full object-cover"
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=85"
          alt="Financial audit"
        />
      </section>

      <section className="bg-slate-100">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:px-10">
          <img
            className="h-[370px] w-full object-cover"
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85"
            alt="Modern towers"
          />
          <div>
            <p className="font-mono text-[10px] tracking-[.18em] text-slate-500">02 TAX & FISCAL ADVISORY</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-ink">
              Strategic Tax Architecture for Global Growth.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
              We navigate the complexities of direct and indirect taxation, ensuring efficiency
              while maintaining absolute regulatory compliance across multiple jurisdictions.
            </p>
            <div className="mt-6 max-w-md border-t border-slate-300" />
            <ul className="mt-7 space-y-5 font-serif text-xl text-ink">
              {['Direct Taxation', 'Indirect Tax (GST / VAT)', 'International Taxation', 'Transfer Pricing'].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <h2 className="max-w-xl font-serif text-5xl leading-tight">
            Complex Challenges Rarely Exist in Isolation.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300">
            Our interconnected framework ensures that every strategic move is validated against
            financial, regulatory, and legal perspectives simultaneously.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-3">
            {['Strategy', 'Finance', 'Regulation', 'Legal', 'Operations'].map((x, i) => (
              <div className="flex items-center gap-3" key={x}>
                <div className="border border-slate-700 px-8 py-6 text-xs font-bold tracking-wide">
                  {x.toUpperCase()}
                </div>
                {i < 4 && <ArrowRight size={16} className="text-slate-500" />}
              </div>
            ))}
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {connectedCards.map(([title, copy]) => (
              <article key={title}>
                <div className="h-px w-6 bg-slate-500" />
                <h3 className="mt-4 font-serif text-2xl leading-tight">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-100">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 lg:px-10">
          <div>
            <h2 className="font-serif text-5xl leading-tight text-ink">
              Building Global Capability From India to the World.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-slate-600">
              Our India-based Global Capability Center (GCC) advisory helps multinational
              corporations tap into the world&apos;s most vibrant talent pool while ensuring
              global operational standards.
            </p>
            <div className="mt-9 flex gap-12">
              <div>
                <b className="font-serif text-4xl text-ink">50+</b>
                <p className="mt-1 text-[10px] font-bold tracking-wide text-slate-500">GCCS ESTABLISHED</p>
              </div>
              <div>
                <b className="font-serif text-4xl text-ink">24/7</b>
                <p className="mt-1 text-[10px] font-bold tracking-wide text-slate-500">SUPPORT ECOSYSTEM</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-8">
            <div className="space-y-8">
              {gccFeatures.map(([Icon, title, copy]) => (
                <div className="flex gap-4" key={title}>
                  <Icon className="mt-1 shrink-0 text-ink" size={20} strokeWidth={1.5} />
                  <div>
                    <h3 className="font-serif text-xl text-ink">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-center font-mono text-[10px] tracking-[.18em] text-slate-500">
            SCENARIO-BASED COLLABORATION
          </p>
          <div className="mt-10 grid divide-y divide-slate-200 border-t border-slate-200 md:grid-cols-3 md:divide-x md:divide-y-0">
            {scenarios.map(([tag, title, copy]) => (
              <article className="px-6 py-8 first:pl-0 last:pr-0" key={title}>
                <p className="font-mono text-[10px] tracking-[.14em] text-slate-400">{tag}</p>
                <h3 className="mt-4 font-serif text-2xl italic leading-tight text-ink">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-600">{copy}</p>
                <a className="mt-5 inline-flex items-center gap-1 text-[11px] font-bold tracking-wide text-ink" href="#contact">
                  READ CASE STUDY <ArrowUpRight size={13} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 px-6 py-16 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-4">
          {stats.map(([num, label]) => (
            <div className="text-center" key={label}>
              <b className="font-serif text-6xl text-ink">{num}</b>
              <p className="mt-2 text-[10px] font-bold tracking-wide text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="px-6 py-20 text-center">
        <h2 className="mx-auto max-w-2xl font-serif text-5xl leading-tight text-ink">
          Complex Business Challenges Require Connected Thinking.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-600">
          Let&apos;s discuss how our multidisciplinary team can provide the architectural
          clarity your organization needs to thrive on a global scale.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <a href="#top" className="bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white">
            BOOK A CONSULTATION
          </a>
          <a href="#top" className="border border-ink px-5 py-3 text-xs font-bold tracking-wide">
            CONTACT US
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}