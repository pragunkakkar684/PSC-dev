import { ArrowRight, Check, Globe2, Sparkle, ShieldCheck, Infinity as InfinityIcon } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import LegacyScroll from '../components/LegacyScroll';

const values = [
  ['Integrity', 'Uncompromising ethical standards form the bedrock of every decision we make and every partnership we build.'],
  ['Excellence', 'We pursue the highest levels of performance, ensuring that our advisory remains precise, impactful, and unmatched.'],
  ['Client Partnership', 'Your objectives are ours. We foster deep, long-term relationships based on mutual trust and shared vision.'],
  ['Innovation', 'Constant evolution in our methodologies allows us to navigate the complexities of a modern, digitized global economy.'],
  ['Global Perspective', 'Our reach is vast, yet our focus is localized, bridging global expertise with specific regional insights.'],
];

const leaders = [
  [
    'Marcus Sterling',
    'MANAGING DIRECTOR & CEO',
    'Over 30 years of experience in cross-border capital markets and global restructuring.',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85',
  ],
  [
    'Elena Moretti',
    'PARTNER, GLOBAL REGULATORY',
    'Formerly a senior advisor at the European Central Bank, specializing in compliance frameworks.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=85',
  ],
  [
    'David Chen',
    'CHIEF INVESTMENT OFFICER',
    'Directing global portfolio strategy and macro-economic forecasting for institutional clients.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=85',
  ],
  [
    'Sarah Whitaker',
    'GLOBAL HEAD OF PARTNERS',
    'Expert in multi-stakeholder engagement and international client development.',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=85',
  ],
];

const whyChoose = [
  ['Integrated Advisory', 'A holistic approach that synchronizes legal, financial and strategic directives into one unified path forward.', Sparkle],
  ['Regulatory Expertise', 'Deep domain knowledge across multi-jurisdictional frameworks ensures compliance and competitive advantage.', ShieldCheck],
  ['Long Term Partnerships', 'We invest in the long-term success of our clients, evolving our services as their enterprise grows and scales.', InfinityIcon],
];

const awards = [
  ['1', 'GLOBAL ADVISORY 2023'],
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

const offices = ['LONDON (HQ)', 'NEW YORK', 'SINGAPORE', 'DUBAI'];

export default function AboutPage() {
  return (
    <main id="top">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-10 lg:px-10">
        <p className="font-mono text-[10px] tracking-[.18em] text-slate-500">ABOUT PSC GLOBAL</p>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[1.02] tracking-[-.045em] sm:text-6xl">
          Building Trust Through Expertise, Integrity and Long Term Partnerships.
        </h1>
        <img
          className="mt-8 h-[340px] w-full object-cover sm:h-[500px]"
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85"
          alt="PSC Global office"
        />
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 lg:px-10">
        <div>
          <p className="font-serif text-3xl">Who We Are</p>
          <p className="mt-5 max-w-md font-serif text-lg italic leading-7 text-slate-700">
            &ldquo;Our commitment is not merely to offer counsel, but to provide a foundational
            architecture for our clients&apos; global ambitions.&rdquo;
          </p>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
            Founded on the principles of absolute precision and unyielding integrity, PSC Global
            has emerged as a preeminent advisory firm for the world&apos;s most sophisticated
            institutions. We operate at the intersection of regulatory complexity and strategic
            opportunity, providing the clarity necessary for long-term success in an ever-shifting
            global landscape.
          </p>
        </div>
        <img
          className="h-64 w-full object-cover md:h-full"
          src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85"
          alt="Board room"
        />
      </section>

      <LegacyScroll />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <p className="font-mono text-[10px] tracking-[.18em] text-slate-500">OUR CORE</p>
        <h2 className="mt-4 font-serif text-4xl">Vision &amp; Values</h2>
        <div className="mt-10 grid gap-px bg-slate-200 sm:grid-cols-3">
          {values.map(([title, copy]) => (
            <article className="bg-white p-6" key={title}>
              <h3 className="font-serif text-xl">{title}</h3>
              <p className="mt-3 text-xs leading-5 text-slate-600">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-serif text-4xl">Why Businesses Choose PSC</h2>
          <p className="mt-3 text-center text-xs text-slate-500">
            Providing a distinctive edge through strategic alignment and technical mastery.
          </p>
          <div className="mt-9 grid gap-3 md:grid-cols-3">
            {whyChoose.map(([title, copy, Icon]) => (
              <article className="border border-slate-200 bg-white p-7" key={title as string}>
                <span className="flex h-9 w-9 items-center justify-center bg-navy text-white">
                  <Icon size={16} strokeWidth={1.75} />
                </span>
                <h3 className="mt-6 font-serif text-xl">{title}</h3>
                <p className="mt-3 text-xs leading-5 text-slate-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <h2 className="text-center font-serif text-4xl">Awards &amp; Recognitions</h2>
        <div className="mt-10 grid gap-3 sm:grid-cols-4">
          {awards.map(([big, label]) => (
            <div className="border border-slate-200 p-7 text-center" key={label}>
              <b className="font-serif text-3xl text-slate-300">{big}</b>
              <p className="mt-3 text-[9px] tracking-widest text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center">
          {certifications.map((x) => (
            <p key={x} className="text-[10px] tracking-widest text-slate-500">
              {x}
            </p>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="flex items-end justify-between">
          <h2 className="max-w-lg font-serif text-4xl">
            Guided by some of the industry&apos;s most respected minds.
          </h2>
          <a className="hidden text-xs font-bold md:block" href="#top">
            VIEW FULL LEADERSHIP TEAM <ArrowRight className="inline" size={14} />
          </a>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {leaders.map(([name, role, bio, image]) => (
            <article key={name}>
              <img className="h-64 w-full object-cover grayscale" src={image} alt={name} />
              <h3 className="mt-4 font-serif text-xl">{name}</h3>
              <p className="mt-1 text-[10px] tracking-widest text-slate-500">{role}</p>
              <p className="mt-3 text-xs leading-5 text-slate-600">{bio}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-navy text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 lg:px-10">
          <div>
            <p className="font-mono text-[10px] tracking-[.18em] text-sky-200">GLOBAL PRESENCE</p>
            <h2 className="mt-4 font-serif text-4xl">A Local Approach. At Scale.</h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">
              We&apos;re strategically positioned across the world&apos;s most vital financial
              hubs, ensuring that our expertise is always within reach.
            </p>
            {offices.map((x) => (
              <a className="mt-4 flex border-b border-slate-700 pb-3 text-xs tracking-widest" href="#top" key={x}>
                {x}
                <ArrowRight className="ml-auto" size={14} />
              </a>
            ))}
          </div>
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 bg-slate-200 py-8 text-ink">
            <p className="font-mono text-[9px] tracking-[.18em] text-slate-500">
              PSC GLOBAL | GLOBAL REACH &amp; CONNECTIVITY
            </p>
            <Globe2 size={120} strokeWidth={1} />
          </div>
        </div>
      </section>

      <section className="px-6 py-20 text-center">
        <h2 className="font-serif text-4xl">Let&apos;s Build Your Next Chapter Together.</h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-slate-600">
          Discover how PSC Global&apos;s integrated advisory can transform your strategic position.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <a href="#contact" className="bg-ink px-5 py-3 text-xs font-bold text-white">
            BOOK A CONSULTATION
          </a>
          <a href="#contact" className="border border-ink px-5 py-3 text-xs font-bold">
            CONTACT US
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}