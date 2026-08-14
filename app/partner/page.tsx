import { Briefcase, FileText, Globe, Landmark, ShieldCheck, Tags } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';

const journey = [
  [
    'With over two decades of dedicated practice, Dr. Vance has established himself as a preeminent authority in international corporate structuring. His tenure spans key economic hubs, allowing him to cultivate a nuanced understanding of geopolitical impacts on multinational commerce.',
    'Prior to founding PSC Global, he served as Chief Legal Counsel for a major European financial institution, where he orchestrated several of the most significant mergers in the sector\u2019s history during the post-2008 regulatory overhaul.',
  ],
  [
    'His leadership philosophy is grounded in anticipation rather than reaction. He believes that true advisory value lies in identifying systemic vulnerabilities before they manifest as crises, architecting structural resilience into the core of enterprise operations.',
    'When engaging with clients, Dr. Vance demands rigorous analytical integrity, insisting on comprehensive risk modeling paired with actionable, pragmatic execution strategies that align with long-term corporate objectives.',
  ],
];

const expertise: Array<[React.ElementType, string, string]> = [
  [Landmark, 'Corporate Law', 'Structuring sophisticated multinational entities and ensuring robust governance frameworks.'],
  [FileText, 'Tax Advisory', 'Optimizing cross-border tax strategies while ensuring strict compliance with emerging global standards.'],
  [ShieldCheck, 'Risk & Assurance', 'Developing comprehensive risk mitigation protocols for volatile regulatory environments.'],
  [Briefcase, 'Business Advisory', 'Strategic counsel for market entry, expansion, and operational restructuring.'],
  [Globe, 'Cross-border Transactions', 'Navigating complex jurisdictional conflicts in international deal-making.'],
  [Tags, 'M&A', 'End-to-end management of high-value mergers and acquisitions.'],
];

export default function PartnerProfilePage() {
  return (
    <main id="top">
      <SiteHeader />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10">
        <img
          className="h-[560px] w-full object-cover"
          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85"
          alt="Dr. Julian Vance"
        />
        <div>
          <p className="flex items-center gap-2 text-xs font-medium text-slate-500">
            LONDON / NEW YORK <span>|</span> 25+ YEARS EXPERIENCE
          </p>
          <h1 className="mt-4 font-serif text-6xl tracking-[-.03em] text-ink">Dr. Julian Vance</h1>
          <p className="mt-4 text-base font-medium text-slate-600">Founder &amp; CEO / Senior Partner</p>

          <div className="mt-6 max-w-xl border-t border-slate-200" />

          <h2 className="mt-8 font-serif text-3xl leading-tight text-ink">
            &quot;Architecting Resilience for Global Enterprises.&quot;
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
            Dr. Vance specializes in navigating complex regulatory environments and executing
            high-stakes cross-border transactions for Fortune 500 companies. His approach
            combines deep legal acumen with strategic foresight, ensuring clients not only
            comply with current frameworks but are structurally prepared for future shifts.
          </p>

          <div className="mt-8 flex gap-3">
            <a href="#contact" className="bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white">
              SCHEDULE A DISCUSSION
            </a>
            <a href="#contact" className="border border-ink px-5 py-3 text-xs font-bold tracking-wide">
              BOOK A CONSULTATION
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[280px_1fr]">
          <h2 className="font-serif text-4xl leading-tight text-ink">
            Professional Journey &amp; Approach
          </h2>
          <div className="grid gap-10 md:grid-cols-2">
            {journey.map((paragraphs, i) => (
              <div className="space-y-5" key={i}>
                {paragraphs.map((p) => (
                  <p className="text-sm leading-7 text-slate-600" key={p.slice(0, 20)}>
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <h2 className="font-serif text-4xl text-ink">Areas of Expertise</h2>
        <div className="mt-6 border-t border-slate-200" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {expertise.map(([Icon, title, copy]) => (
            <article className="bg-[#fdf9f8] p-8" key={title}>
              <Icon className="text-ink" size={22} strokeWidth={1.5} />
              <h3 className="mt-5 font-serif text-2xl text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="bg-navy px-6 py-24 text-center text-white">
        <h2 className="mx-auto max-w-3xl font-serif text-5xl leading-tight">
          Let&apos;s Discuss Your Business Challenges.
        </h2>
        <div className="mt-9 flex justify-center gap-3">
          <a href="#top" className="bg-white px-5 py-3 text-xs font-bold tracking-wide text-navy">
            SCHEDULE A DISCUSSION
          </a>
          <a href="#top" className="border border-white px-5 py-3 text-xs font-bold tracking-wide">
            CONTACT PSC
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}