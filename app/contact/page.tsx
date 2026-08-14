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

export default async function ContactPage() {
  const [hero, dbOffices, dbFaqs, dbTeam] = await Promise.all([
    getPublicHeroSection('contact'),
    getPublicOfficeLocations(),
    getPublicFaqs('contact'),
    getPublicTeamMembers(),
  ]);

  return (
    <main id="top">
      <SiteHeader />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-2 lg:px-10 lg:py-18">
        <div>
          <p className="font-mono text-[10px] tracking-[.18em] text-slate-500 uppercase">{hero.eyebrow || 'CONTACT US'}</p>
          <h1 className="mt-4 max-w-lg font-serif text-5xl leading-[1.02] tracking-[-.04em] text-ink sm:text-6xl">
            {hero.heading || 'Every Great Business Conversation Starts Here.'}
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-slate-600">
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

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        <div className="border border-slate-200 bg-[#fdf9f8]">
          {routes.map(([Icon, title, copy]) => (
            <a
              href="#contact-form"
              className="flex items-center justify-between gap-6 border-b border-slate-200 px-8 py-7 last:border-b-0 transition hover:bg-white"
              key={title}
            >
              <div className="flex items-start gap-5">
                <Icon className="mt-1 shrink-0 text-ink" size={20} strokeWidth={1.5} />
                <div>
                  <h3 className="font-serif text-2xl text-ink">{title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{copy}</p>
                </div>
              </div>
              <ArrowRight className="shrink-0 text-ink" size={18} />
            </a>
          ))}
        </div>
      </section>

      {/* Global Offices */}
      <section className="bg-navy px-6 py-20 text-white lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="max-w-xs text-sm leading-6 text-slate-300">
              Architectural Excellence in Consulting. Redefining the structural integrity of global business since 1988.
            </p>
            <div className="mt-10 flex h-80 w-full items-center justify-center border border-slate-700 lg:h-[420px]">
              <span className="px-6 text-center text-xs tracking-widest text-slate-500">
                [PREMIUM ILLUSTRATED MAP PLACEHOLDER]
              </span>
            </div>
          </div>
          <div>
            <h2 className="font-serif text-4xl leading-tight">Our Global Presence</h2>
            <div className="mt-10 space-y-9">
              {dbOffices.map((o) => (
                <div key={o.id}>
                  <h3 className="font-serif text-2xl flex items-center gap-3">
                    {o.city}
                    {o.isHeadquarters && (
                      <span className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 uppercase">
                        GLOBAL HQ
                      </span>
                    )}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{o.fullAddress}</p>
                  {o.phone && <p className="text-sm leading-6 text-slate-300">{o.phone}</p>}
                  {o.email && (
                    <a className="text-sm leading-6 text-slate-300 underline hover:text-white" href={`mailto:${o.email}`}>
                      {o.email}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Contact Form */}
      <section id="contact-form" className="bg-[#fdf9f8] px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-serif text-4xl leading-tight text-ink">
              Tell Us About Your Business
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-600">
              Engage with our strategic advisory team to outline your challenges and explore
              how PSC Global can architect solutions for your growth.
            </p>
            <div className="mt-8 space-y-6">
              {trustPoints.map(([Icon, title, copy]) => (
                <div key={title}>
                  <div className="flex items-center gap-2">
                    <Icon size={15} className="text-ink" />
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

      {/* Steps */}
      <section className="bg-navy px-6 py-20 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-5xl">What Happens After You Contact PSC?</h2>
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([no, title, copy]) => (
              <div key={no}>
                <div className="flex items-center gap-3">
                  <b className="font-serif text-5xl text-slate-600">{no}</b>
                  <div className="h-px flex-1 bg-slate-700" />
                </div>
                <h3 className="mt-5 font-serif text-2xl leading-tight">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Leadership */}
      <section id="leadership" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <h2 className="text-center font-serif text-4xl text-ink">Speak Directly With Our Leadership</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {dbTeam.slice(0, 3).map((m) => (
            <article key={m.id}>
              <Link href={`/partner/${m.slug}`}>
                <img
                  className="h-80 w-full object-cover grayscale transition hover:grayscale-0"
                  src={m.imageUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85'}
                  alt={m.name}
                />
                <h3 className="mt-5 font-serif text-2xl text-ink hover:text-sky-800 transition-colors">{m.name}</h3>
                <p className="mt-1 text-xs font-bold tracking-wide text-slate-500 uppercase">{m.roleTitle}</p>
                <p className="mt-2 text-sm text-slate-600">{m.focusArea}</p>
              </Link>
              <div className="mt-5 border-t border-slate-200" />
              <a className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold tracking-wide text-ink hover:underline" href="#contact-form">
                SCHEDULE DISCUSSION <ArrowRight size={13} />
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* FAQs */}
      {dbFaqs.length > 0 && (
        <section className="bg-[#fdf9f8] px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-serif text-4xl text-ink">Frequently Asked Questions</h2>
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

      <section className="px-6 py-24 text-center">
        <h2 className="mx-auto max-w-2xl font-serif text-5xl leading-tight text-ink">
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