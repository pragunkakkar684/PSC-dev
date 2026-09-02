import { ArrowRight, Check, Globe2, Sparkle, ShieldCheck, Infinity as InfinityIcon } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import LegacyScroll from '../components/LegacyScroll';
import { OfficeMap } from '../components/OfficeMap';
import Link from 'next/link';
import { getPublicHeroSection, getPublicTeamMembers, getPublicOfficeLocations } from '@/lib/queries/public';

const values = [
  ['Integrity', 'Uncompromising ethical standards form the bedrock of every decision we make and every partnership we build.'],
  ['Excellence', 'We pursue the highest levels of performance, ensuring that our advisory remains precise, impactful, and unmatched.'],
  ['Client Partnership', 'Your objectives are ours. We foster deep, long-term relationships based on mutual trust and shared vision.'],
  ['Innovation', 'Constant evolution in our methodologies allows us to navigate the complexities of a modern, digitized global economy.'],
  ['Global Perspective', 'Our reach is vast, yet our focus is localized, bridging global expertise with specific regional insights.'],
];

const whyChoose: Array<[string, string, React.ElementType]> = [
  ['Integrated Advisory', 'A holistic approach that synchronizes legal, financial and strategic directives into one unified path forward.', Sparkle],
  ['Regulatory Expertise', 'Deep domain knowledge across multi-jurisdictional frameworks ensures compliance and competitive advantage.', ShieldCheck],
  ['Long Term Partnerships', 'We invest in the long-term success of our clients, evolving our services as their enterprise grows and scales.', InfinityIcon],
];

const awards = [
  ['#1', 'GLOBAL ADVISORY 2023'],
  ['Top 5', 'EMEA RESTRUCTURING'],
  ['Gold', 'GOVERNANCE EXCELLENCE'],
  ['Elite', 'STRATEGIC COUNSEL LIST'],
];

const certifications = [
  'ISO 27001 CERTIFIED',
  'GLOBAL ADVISORY ALLIANCE MEMBER',
  'INTERNATIONAL BAR ASSOCIATION AFFILIATE',
  'IFRS COMPLIANCE ACCREDITED',
];

// Shown when the database has one or fewer members, since a single row may be
// the placeholder member returned by getPublicTeamMembers().
const defaultTeam = [
  {
    id: 'team-1',
    slug: 'marcus-sterling',
    name: 'Marcus Sterling',
    roleTitle: 'Managing Director & CEO',
    shortBio: 'Over 30 years of experience in cross-border capital markets and global regulatory strategy, advising Fortune 500 boards on institutional risk.',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85',
  },
  {
    id: 'team-2',
    slug: 'elena-moretti',
    name: 'Elena Moretti',
    roleTitle: 'Head of Global Regulatory',
    shortBio: 'Formerly a senior advisor at the European Central Bank, specializing in cross-border compliance and systemic risk frameworks.',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=500&q=85',
  },
  {
    id: 'team-3',
    slug: 'david-chen',
    name: 'David Chen',
    roleTitle: 'Chief Investment Officer',
    shortBio: 'Directing global portfolio strategy and macro-economic forecasting for institutional clients across four continents.',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=85',
  },
  {
    id: 'team-4',
    slug: 'sarah-whitaker',
    name: 'Sarah Whitaker',
    roleTitle: 'Global Head of Partners',
    shortBio: 'Expert in multi-stakeholder engagement and international partnership structuring across emerging and developed markets.',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=85',
  },
];

// Shown only when getPublicOfficeLocations() returns no rows.
// Cities intentionally match the officeCoordinates lookup below so the map always has markers.
const defaultOffices = [
  { id: 'office-1', city: 'London', fullAddress: '1 Cornhill, London, EC3V 3ND, UK', isHeadquarters: true },
  { id: 'office-2', city: 'New York', fullAddress: '350 Fifth Avenue, New York, NY 10118, USA', isHeadquarters: false },
  { id: 'office-3', city: 'Singapore', fullAddress: '1 Raffles Place, Singapore 048616', isHeadquarters: false },
  { id: 'office-4', city: 'Dubai', fullAddress: 'DIFC, Gate Village, Dubai, UAE', isHeadquarters: false },
];

// Approximate [longitude, latitude] for each office city shown on the map.
// If your office records already carry lat/long fields, swap this lookup for those values instead.
const officeCoordinates: Record<string, [number, number]> = {
  London: [-0.1276, 51.5072],
  'New York': [-74.006, 40.7128],
  Singapore: [103.8198, 1.3521],
  Dubai: [55.2708, 25.2048],
};

export default async function AboutPage() {
  const [hero, dbTeam, dbOffices] = await Promise.all([
    getPublicHeroSection('about'),
    getPublicTeamMembers(),
    getPublicOfficeLocations(),
  ]);

  const team = dbTeam.length > 1 ? dbTeam : defaultTeam;
  const offices = dbOffices.length > 0 ? dbOffices : defaultOffices;

  return (
    <main id="top">
      <SiteHeader />

      {/* HERO */}
      <AnimatedSection className="mx-auto flex max-w-7xl flex-col justify-center px-6 pb-16 pt-10 lg:px-10">
        <p className="font-mono text-xs tracking-[.18em] text-slate-500 uppercase">{hero.eyebrow || 'ABOUT PSC GLOBAL'}</p>
        <h1 className="mt-4 max-w-5xl font-serif text-6xl leading-[1.02] tracking-[-.045em] sm:text-7xl">
          {hero.heading || 'Building Trust Through Expertise, Integrity and Long Term Partnerships.'}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 lg:text-lg">
          {hero.subheading || 'For over two decades, PSC Global has served as the trusted advisory partner to institutions navigating the most consequential decisions of their global expansion.'}
        </p>
        <img
          className="mt-8 h-[340px] w-full object-cover sm:h-[500px]"
          src={hero.imageUrl || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85'}
          alt="PSC Global office"
        />
      </AnimatedSection>

      {/* WHO WE ARE */}
      <AnimatedSection className="mx-auto grid max-w-7xl items-center gap-12 border-t border-slate-200 px-6 py-20 md:grid-cols-2 lg:px-10">
        <div>
          <p className="font-serif text-4xl lg:text-5xl">Who We Are</p>
          <p className="mt-6 font-serif text-xl italic leading-8 text-slate-700 lg:text-2xl">
            &ldquo;Our commitment is not merely to offer counsel, but to provide a foundational
            architecture for our clients&apos; global ambitions.&rdquo;
          </p>
          <p className="mt-6 text-base leading-8 text-slate-600 lg:text-lg">
            Founded on the principles of absolute precision and unyielding integrity, PSC Global
            has emerged as a preeminent advisory firm for the world&apos;s most sophisticated
            institutions. We operate at the intersection of regulatory complexity and strategic
            opportunity, providing the clarity necessary for long-term success in an ever-shifting
            global landscape.
          </p>
        </div>
        <div className="border border-slate-200 bg-slate-50 p-3">
          <img
            className="h-64 w-full object-cover md:h-[420px]"
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85"
            alt="Board room"
          />
        </div>
      </AnimatedSection>

      <LegacyScroll />

      {/* VISION & VALUES */}
      <AnimatedSection className="mx-auto flex max-w-7xl flex-col justify-center border-t border-slate-200 px-6 py-20 lg:px-10">
        <p className="font-mono text-xs tracking-[.18em] text-slate-500">OUR CORE</p>
        <div className="mt-4 flex items-center justify-between">
          <h2 className="font-serif text-5xl lg:text-6xl">Vision &amp; Values</h2>
          <span className="hidden h-px w-32 bg-slate-300 md:block" />
        </div>
        <div className="mt-14 flex flex-wrap justify-center gap-y-14">
          {values.map(([title, copy], i) => (
            <div
              key={title}
              className={`w-full px-8 sm:w-1/3 ${i % 3 !== 0 ? 'sm:border-l sm:border-slate-200' : ''}`}
            >
              <h3 className="font-serif text-2xl lg:text-3xl">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-slate-600 lg:text-base">{copy}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* WHY CHOOSE */}
      <AnimatedSection className="flex items-center border-t border-slate-200 bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-serif text-5xl lg:text-6xl">Why Businesses Choose PSC</h2>
          <p className="mt-4 text-center text-sm text-slate-500 lg:text-base">
            Providing a distinctive edge through strategic alignment and technical mastery.
          </p>
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {whyChoose.map(([title, copy, Icon]) => (
              <article
                className="group border border-slate-200 bg-white p-8 transition-all duration-300 ease-out hover:-translate-y-2 hover:border-slate-300 hover:shadow-xl"
                key={title as string}
              >
                <span className="flex h-11 w-11 items-center justify-center bg-navy text-white transition-transform duration-300 group-hover:scale-110">
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                <h3 className="mt-6 font-serif text-2xl lg:text-3xl">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-600 lg:text-base">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* AWARDS & RECOGNITIONS */}
      <AnimatedSection className="mx-auto flex max-w-7xl flex-col justify-center border-t border-slate-200 px-6 py-20 lg:px-10">
        <h2 className="text-center font-serif text-5xl lg:text-6xl">Awards &amp; Recognitions</h2>
        <div className="mt-10 grid gap-3 sm:grid-cols-4">
          {awards.map(([big, label]) => (
            <div className="border border-slate-200 p-8 text-center" key={label}>
              <b className="font-serif text-4xl text-slate-300 lg:text-5xl">{big}</b>
              <p className="mt-4 text-xs tracking-widest text-slate-500 lg:text-sm">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 overflow-hidden border-y border-slate-200 py-10">
          <div className="flex w-max animate-marquee gap-16">
            {[...certifications, ...certifications].map((x, i) => (
              <p key={`${x}-${i}`} className="whitespace-nowrap text-lg tracking-widest text-slate-500 lg:text-xl">
                {x}
              </p>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* TEAM */}
      <AnimatedSection className="mx-auto flex max-w-7xl flex-col justify-center border-t border-slate-200 px-6 py-20 lg:px-10">
        <div className="flex items-end justify-between">
          <h2 className="max-w-lg font-serif text-5xl lg:text-6xl">
            Guided by some of the industry&apos;s most respected minds.
          </h2>
          <Link className="hidden text-sm font-bold md:block hover:underline" href="/team">
            VIEW FULL LEADERSHIP TEAM <ArrowRight className="inline" size={16} />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {team.slice(0, 4).map((m) => (
            <article className="profile-card" key={m.id}>
              <Link href={`/partner/${m.slug}`}>
                <img
                  className="h-64 w-full object-cover grayscale transition duration-300 hover:grayscale-0"
                  src={m.imageUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85'}
                  alt={m.name}
                />
                <h3 className="mt-4 font-serif text-2xl hover:text-sky-800 transition-colors">{m.name}</h3>
                <p className="mt-1 text-xs tracking-widest text-slate-500 uppercase">{m.roleTitle}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">{m.shortBio}</p>
              </Link>
            </article>
          ))}
        </div>
      </AnimatedSection>

      {/* GLOBAL PRESENCE */}
      <AnimatedSection className="flex items-center border-t border-slate-700/60 bg-navy text-white" id="offices">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 lg:px-10">
          <div>
            <p className="font-mono text-xs tracking-[.18em] text-sky-200">GLOBAL PRESENCE</p>
            <h2 className="mt-4 font-serif text-5xl lg:text-6xl">A Local Approach. At Scale.</h2>
            <p className="mt-6 max-w-sm text-base leading-7 text-slate-300 lg:text-lg">
              We&apos;re strategically positioned across the world&apos;s most vital financial
              hubs, ensuring that our expertise is always within reach.
            </p>
            {offices.map((o) => (
              <div className="mt-4 flex flex-col border-b border-slate-700/80 pb-3" key={o.id}>
                <div className="flex items-center justify-between text-sm tracking-widest font-bold">
                  <span>{o.city.toUpperCase()} {o.isHeadquarters ? '(HQ)' : ''}</span>
                  <ArrowRight size={16} />
                </div>
                {o.fullAddress && <span className="mt-1 text-sm text-slate-300">{o.fullAddress}</span>}
              </div>
            ))}
          </div>

          <OfficeMap
            offices={offices}
            coordinates={officeCoordinates}
            label="PSC GLOBAL | GLOBAL REACH & CONNECTIVITY"
          />
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="flex flex-col items-center justify-center border-t border-slate-200 px-6 py-24 text-center">
        <h2 className="font-serif text-5xl leading-[1.05] lg:text-6xl">Let&apos;s Build Your Next Chapter Together.</h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-slate-600 lg:text-base">
          Discover how PSC Global&apos;s integrated advisory can transform your strategic position.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/contact" className="bg-ink px-5 py-3 text-xs font-bold text-white transition hover:bg-slate-800">
            BOOK A CONSULTATION
          </Link>
          <Link href="/contact" className="border border-ink px-5 py-3 text-xs font-bold transition hover:bg-slate-100">
            CONTACT US
          </Link>
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  );
}