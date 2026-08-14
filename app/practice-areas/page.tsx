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
import Link from 'next/link';
import { ALLOWED_ICONS } from '@/app/admin/(dashboard)/components/IconPicker';
import { getPublicHeroSection, getPublicPracticeAreas } from '@/lib/queries/public';

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

export default async function PracticeAreasPage() {
  const [hero, dbPractices] = await Promise.all([
    getPublicHeroSection('practice-areas'),
    getPublicPracticeAreas(),
  ]);

  return (
    <main id="top">
      <SiteHeader />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1fr_.9fr] lg:px-10 lg:py-18">
        <div>
          <p className="font-mono text-[10px] tracking-[.18em] text-slate-500 uppercase">{hero.eyebrow || 'OUR EXPERTISE'}</p>
          <h1 className="mt-4 max-w-xl font-serif text-5xl leading-[1.02] tracking-[-.04em] text-ink sm:text-6xl">
            {hero.heading || 'Expertise Across Every Dimension of Business.'}
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-slate-600">
            {hero.subheading || 'We provide a multidimensional approach to global advisory, merging deep local knowledge with international standards to navigate complex regulatory and fiscal landscapes.'}
          </p>
          <div className="mt-8 flex gap-3">
            <a href="#capabilities" className="flex items-center gap-2 bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
              Explore Our Expertise <ArrowRight size={15} />
            </a>
            <Link href="/contact" className="flex items-center gap-2 border border-ink px-5 py-3 text-sm font-medium transition hover:bg-slate-100">
              Speak With an Advisor <MessageSquare size={15} />
            </Link>
          </div>
        </div>
        <div className="relative">
          <img
            className="h-[360px] w-full object-cover"
            src={hero.imageUrl || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85'}
            alt="Business meeting"
          />
          <div className="absolute bottom-0 right-0 w-64 bg-navy p-5 text-xs leading-5 text-white">
            &quot;Architecture in business is not just about structure; it&apos;s about the resilience to withstand global shifts.&quot;
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

      {/* Dynamic Practice Areas Grid */}
      <section id="capabilities" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <p className="font-mono text-[10px] tracking-[.18em] text-slate-500">CORE CAPABILITIES</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-serif text-5xl text-ink">Our Practice Areas</h2>
          <div className="text-right">
            <p className="font-mono text-[10px] tracking-[.14em] text-slate-400">EST. 2002</p>
            <i className="font-serif text-xl text-slate-500">Global Standards</i>
          </div>
        </div>

        <div className="mt-8 grid border-t border-slate-200 md:grid-cols-3 lg:grid-cols-5">
          {dbPractices.map((pa, idx) => {
            const IconComp = (pa.iconName && ALLOWED_ICONS[pa.iconName]) || Shield;
            return (
              <article className="min-h-52 border-l border-slate-200 p-5 first:border-l-0" key={pa.id}>
                <small className="text-[10px] tracking-widest text-slate-400">{pa.number || `0${idx + 1}`}</small>
                <h3 className="mt-5 font-serif text-xl leading-tight text-ink">{pa.name}</h3>
                <p className="mt-2 text-xs text-slate-500 line-clamp-3">{pa.shortDescription}</p>
                <IconComp className="mt-6 text-ink" size={20} strokeWidth={1.5} />

                {pa.services && pa.services.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <ul className="space-y-1 text-[11px] text-slate-600">
                      {pa.services.map((s) => (
                        <li key={s.name} className="flex items-center gap-1.5">
                          <Check size={11} className="text-sky-600 shrink-0" />
                          <span>{s.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Connected Model Section */}
      <section className="bg-navy px-6 py-20 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] tracking-[.18em] text-sky-200">THE CONNECTED MODEL</p>
          <h2 className="mt-4 font-serif text-4xl">How Our Practice Areas Work Together</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {connectedCards.map(([title, copy]) => (
              <div key={title} className="border border-slate-700 bg-slate-900/50 p-7">
                <h3 className="font-serif text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}