import {
  ArrowRight,
  Briefcase,
  Clock,
  Mail,
  Shield,
  UserRound,
  Users,
  Sparkles,
} from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import PublicContactForm from '../components/PublicContactForm';
import { OfficeMap } from '../components/OfficeMap';
import Link from 'next/link';
import {
  getPublicHeroSection,
  getPublicOfficeLocations,
  getPublicFaqs,
  getPublicTeamMembers,
} from '@/lib/queries/public';

const routes: Array<[React.ElementType, string, string]> = [
  [Mail, 'General Enquiries', 'For media, partnerships, and general firm information.'],
  [Briefcase, 'Business Advisory', 'Speak directly with a partner about your organizational challenges.'],
  [UserRound, 'Existing Clients', 'Access your dedicated support team or client portal.'],
  [Users, 'Careers', 'Explore opportunities to join our global network of experts.'],
];

const trustPoints: Array<[React.ElementType, string, string]> = [
  [Shield, 'STRICTLY CONFIDENTIAL', 'All inquiries are handled with the highest level of discretion.'],
  [Clock, 'RESPONSE WITHIN 1 DAY', 'A partner will review your submission and respond promptly.'],
  [Sparkles, 'NO OBLIGATION', 'Initial consultations are exploratory and commitment-free.'],
];

const steps = [
  ['01', 'Understand Business', 'We review your submission to grasp your context and objectives.'],
  ['02', 'Connect Specialists', 'We align the right partners and subject matter experts to your case.'],
  ['03', 'Strategy Discussion', 'An initial consultation to explore potential pathways and impact.'],
  ['04', 'Engagement Plan', 'A structured proposal outlining scope, timeline, and deliverables.'],
];

const defaultOffices = [
  { id: 'london', city: 'London', isHeadquarters: true, fullAddress: '30 St Mary Axe, London, EC3A 8BF, United Kingdom', phone: '+44 20 7946 0958', email: 'london@pscglobal.com' },
  { id: 'newyork', city: 'New York', isHeadquarters: false, fullAddress: '405 Lexington Avenue, New York, NY 10174, USA', phone: '+1 212 555 0148', email: 'newyork@pscglobal.com' },
  { id: 'singapore', city: 'Singapore', isHeadquarters: false, fullAddress: '1 Raffles Place, Singapore 048616', phone: '+65 6408 0500', email: 'singapore@pscglobal.com' },
  { id: 'dubai', city: 'Dubai', isHeadquarters: false, fullAddress: 'DIFC, Gate Building, Dubai, UAE', phone: '+971 4 401 9600', email: 'dubai@pscglobal.com' },
];

// Approximate [longitude, latitude] for each office city shown on the map.
// If your office records already carry lat/long fields, swap this lookup for those values instead.
const officeCoordinates: Record<string, [number, number]> = {
  London: [-0.1276, 51.5072],
  'New York': [-74.006, 40.7128],
  Mumbai: [72.8777, 19.076],
  Singapore: [103.8198, 1.3521],
  Dubai: [55.2708, 25.2048],
};

const defaultFaqs = [
  { id: '1', question: 'How quickly can I expect a response?', answer: 'Our partners typically respond within one business day of receiving your submission.' },
  { id: '2', question: 'Do you offer a free initial consultation?', answer: 'Yes, all exploratory consultations are complimentary and carry no obligation to proceed.' },
  { id: '3', question: 'Which regions do you operate in?', answer: 'We operate across London, New York, Singapore, and Dubai, with a network extending to 15+ countries.' },
  { id: '4', question: 'Are virtual meetings available?', answer: 'Yes, we offer secure video consultations for clients who are unable to meet in person.' },
];

const defaultTeam = [
  { id: '1', slug: 'julian-vance', name: 'Dr. Julian Vance', roleTitle: 'Managing Partner', category: 'partner', shortBio: 'With over three decades of experience in structural economics, Dr. Vance has advised four of the world\u2019s top ten sovereign wealth funds.', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85', focusArea: 'Structural Economics & Governance' },
  { id: '2', slug: 'helena-thorne', name: 'Helena Thorne', roleTitle: 'Chief Strategy Officer', category: 'partner', shortBio: 'Helena leads our transformation labs, bridging the gap between legacy infrastructure and emergent AI-driven business models.', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=85', focusArea: 'Digital Transformation' },
  { id: '3', slug: 'marcus-oh', name: 'Marcus Oh', roleTitle: 'Head of Operations', category: 'leadership', shortBio: 'Marcus specializes in complex logistics and supply chain optimization, having managed projects exceeding $4B in annual spend.', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85', focusArea: 'Global Operations' },
  { id: '4', slug: 'sarah-whitaker', name: 'Sarah Whitaker', roleTitle: 'Global Head of Partners', category: 'leadership', shortBio: 'Expert in multi-stakeholder engagement and international partnership development across emerging markets.', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=85', focusArea: 'Partner Relations' },
];

export default async function ContactPage() {
  const [hero, dbOffices, dbFaqs, dbTeam] = await Promise.all([
    getPublicHeroSection('contact'),
    getPublicOfficeLocations(),
    getPublicFaqs('contact'),
    getPublicTeamMembers(),
  ]);

  const offices = dbOffices.length > 0 ? dbOffices : defaultOffices;
  const faqs = dbFaqs.length > 0 ? dbFaqs : defaultFaqs;
  const team = dbTeam.length > 1 ? dbTeam : defaultTeam;

  return (
    <main id="top">
      <SiteHeader />

      {/* HERO */}
      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="font-mono text-xs tracking-[.18em] text-slate-500 uppercase">{hero.eyebrow || 'CONTACT US'}</p>
          <h1 className="mt-4 max-w-lg font-serif text-6xl leading-[1.02] tracking-[-.045em] text-ink sm:text-7xl">
            {hero.heading || 'Every Great Business Conversation Starts Here.'}
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-600 lg:text-lg">
            {hero.subheading || 'Whether you are navigating complex regulatory landscapes, restructuring for global expansion, or seeking strategic counsel, our partners are ready to engage.'}
          </p>
          <div className="mt-8 flex gap-3">
            <a href="#contact-form" className="bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white transition hover:bg-slate-800">
              BOOK A CONSULTATION
            </a>
            <a href="#leadership" className="border border-ink px-5 py-3 text-xs font-bold tracking-wide transition hover:bg-slate-100">
              CONTACT OUR TEAM
            </a>
          </div>
        </div>
        <img
          className="h-[420px] w-full object-cover"
          src={hero.imageUrl || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1100&q=85'}
          alt="Meeting in progress"
        />
      </section>

      {/* ROUTES */}
      <section className="border-t border-slate-200 px-6 py-16 lg:px-10">
        <div className="mx-auto w-full max-w-7xl border border-slate-200 bg-[#fdf9f8]">
          {routes.map(([Icon, title, copy]) => (
            <a
              href="#contact-form"
              className="flex items-center justify-between gap-6 border-b border-slate-200 px-8 py-8 last:border-b-0 transition hover:bg-white"
              key={title}
            >
              <div className="flex items-start gap-5">
                <Icon
                  className="mt-1 shrink-0 text-ink"
                  size={22}
                  strokeWidth={1.5}
                />

                <div>
                  <h3 className="font-serif text-2xl text-ink lg:text-3xl">
                    {title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600 lg:text-base">
                    {copy}
                  </p>
                </div>
              </div>

              <ArrowRight
                className="shrink-0 text-ink"
                size={20}
              />
            </a>
          ))}
        </div>
      </section>

      {/* GLOBAL OFFICES */}
      <section className="border-t border-slate-700/60 bg-navy px-6 py-20 text-white lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="max-w-xs text-base leading-7 text-slate-300">
              Architectural Excellence in Consulting. Redefining the structural integrity of global business since 1988.
            </p>
            <OfficeMap
              offices={offices}
              coordinates={officeCoordinates}
              label="PSC GLOBAL | GLOBAL OFFICES"
            />
          </div>
          <div>
            <h2 className="font-serif text-5xl leading-tight lg:text-6xl">Our Global Presence</h2>
            {offices.map((o) => (
              <div className="mt-4 flex flex-col border-b border-slate-700/80 pb-3" key={o.id}>
                <div className="flex items-center justify-between text-sm tracking-widest font-bold">
                  <span>{o.city.toUpperCase()} {o.isHeadquarters ? '(HQ)' : ''}</span>
                  <ArrowRight size={16} />
                </div>
                {o.fullAddress && <span className="mt-1 block text-sm text-slate-300">{o.fullAddress}</span>}
                {o.phone && <span className="mt-1 block text-sm text-slate-300">{o.phone}</span>}
                {o.email && (
                  <a className="mt-1 inline-block text-sm text-slate-300 underline hover:text-white" href={`mailto:${o.email}`}>
                    {o.email}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contact-form" className="border-t border-slate-200 bg-[#fdf9f8] px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-serif text-5xl leading-tight text-ink lg:text-6xl">
              Tell Us About Your Business
            </h2>
            <p className="mt-5 max-w-sm text-base leading-7 text-slate-600 lg:text-lg">
              Engage with our strategic advisory team to outline your challenges and explore
              how PSC Global can architect solutions for your growth.
            </p>
            <div className="mt-8 space-y-6">
              {trustPoints.map(([Icon, title, copy]) => (
                <div key={title}>
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-ink" />
                    <p className="text-xs font-bold tracking-wide text-ink">{title}</p>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{copy}</p>
                  <div className="mt-5 max-w-sm border-t border-slate-200" />
                </div>
              ))}
            </div>
          </div>

          <PublicContactForm />
        </div>
      </section>

      {/* STEPS */}
      <section className="border-t border-slate-700/60 bg-navy px-6 py-20 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-5xl lg:text-6xl">What Happens After You Contact PSC?</h2>
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([no, title, copy]) => (
              <div key={no}>
                <div className="flex items-center gap-3">
                  <b className="font-serif text-5xl text-slate-600">{no}</b>
                  <div className="h-px flex-1 bg-slate-700" />
                </div>
                <h3 className="mt-5 font-serif text-2xl leading-tight lg:text-3xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400 lg:text-base">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM LEADERSHIP */}
      <section id="leadership" className="mx-auto max-w-7xl border-t border-slate-200 px-6 py-20 lg:px-10">
        <h2 className="text-center font-serif text-5xl text-ink lg:text-6xl">Speak Directly With Our Leadership</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {team.slice(0, 3).map((m) => (
            <article className="profile-card" key={m.id}>
              <Link href={`/partner/${m.slug}`}>
                <img
                  className="h-80 w-full object-cover grayscale transition hover:grayscale-0"
                  src={m.imageUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85'}
                  alt={m.name}
                />
                <h3 className="mt-5 font-serif text-2xl text-ink transition-colors hover:text-sky-800">{m.name}</h3>
                <p className="mt-1 text-xs font-bold tracking-wide text-slate-500 uppercase">{m.roleTitle}</p>
                <p className="mt-2 text-sm text-slate-600">{m.focusArea}</p>
              </Link>
              <div className="mt-5 border-t border-slate-200" />
              <a className="mt-5 inline-flex items-center gap-2 text-xs font-bold tracking-wide text-ink hover:underline" href="#contact-form">
                SCHEDULE DISCUSSION <ArrowRight size={14} />
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* FAQS */}
      {faqs.length > 0 && (
        <section className="border-t border-slate-200 bg-[#fdf9f8] px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-serif text-5xl text-ink lg:text-6xl">Frequently Asked Questions</h2>
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

      {/* CTA */}
      <section className="flex flex-col items-center justify-center border-t border-slate-200 px-6 py-24 text-center">
        <h2 className="mx-auto max-w-2xl font-serif text-5xl leading-tight text-ink lg:text-6xl">
          Let&apos;s Build Something Meaningful Together.
        </h2>
        <div className="mt-9 flex justify-center gap-3">
          <a href="#contact-form" className="bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white transition hover:bg-slate-800">
            BOOK A CONSULTATION
          </a>
          <a href="#leadership" className="border border-ink px-5 py-3 text-xs font-bold tracking-wide transition hover:bg-slate-100">
            CALL OUR TEAM
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}