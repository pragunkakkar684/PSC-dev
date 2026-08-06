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

const routes = [
  [Mail, 'General Enquiries', 'For media, partnerships, and general firm information.'],
  [Briefcase, 'Business Advisory', 'Speak directly with a partner about your organizational challenges.'],
  [UserRound, 'Existing Clients', 'Access your dedicated support team or client portal.'],
  [Users, 'Careers', 'Explore opportunities to join our global network of experts.'],
];

const offices = [
  ['London', '120 Holborn, London EC1N 2TD, United Kingdom', '+44 (0) 20 7123 4567', 'london@pscglobal.com'],
  ['Mumbai', 'Bandra Kurla Complex, Mumbai 400051, India', '+91 22 6123 4567', 'mumbai@pscglobal.com'],
  ['Singapore', 'Marina Bay Financial Centre, Tower 1, Singapore 018981', '+65 6123 4567', 'singapore@pscglobal.com'],
  ['Dubai', 'Dubai International Financial Centre, Dubai, UAE', '+971 4 123 4567', 'dubai@pscglobal.com'],
];

const trustPoints = [
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

const leaders = [
  ['Dr. Julian Vance', 'SENIOR PARTNER', 'Global Strategy & Restructuring', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85'],
  ['Helena Thorne', 'MANAGING DIRECTOR', 'Digital Transformation & Innovation', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=85'],
  ['Marcus Oh', 'PARTNER', 'Mergers, Acquisitions & Integration', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85'],
];

const faqs = [
  ['What are your standard response times?', 'We aim to respond to every inquiry within one business day. Urgent matters routed through Existing Clients are prioritized further.'],
  ['Do you work with international businesses?', 'Yes. With offices across London, Mumbai, Singapore, and Dubai, we regularly advise clients on cross-border and multi-jurisdictional matters.'],
  ['How do you handle confidentiality?', 'Every inquiry is treated as strictly confidential. Formal engagements are further protected under our standard client agreements.'],
  ['Are virtual meetings available?', 'Absolutely. Our partners are equipped to meet via video conference for clients who prefer not to meet in person initially.'],
];

export default function ContactPage() {
  return (
    <main id="top">
      <SiteHeader />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-2 lg:px-10 lg:py-18">
        <div>
          <p className="font-mono text-[10px] tracking-[.18em] text-slate-500">CONTACT US</p>
          <h1 className="mt-4 max-w-lg font-serif text-5xl leading-[1.02] tracking-[-.04em] text-ink sm:text-6xl">
            Every Great Business Conversation Starts Here.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-slate-600">
            Whether you are navigating complex regulatory landscapes, restructuring for global
            expansion, or seeking strategic counsel, our partners are ready to engage.
          </p>
          <div className="mt-8 flex gap-3">
            <a href="#contact-form" className="bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white">
              BOOK A CONSULTATION
            </a>
            <a href="#leadership" className="border border-ink px-5 py-3 text-xs font-bold tracking-wide">
              CONTACT OUR TEAM
            </a>
          </div>
        </div>
        <img
          className="h-[420px] w-full object-cover"
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1100&q=85"
          alt="Meeting in progress"
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        <div className="border border-slate-200 bg-[#fdf9f8]">
          {routes.map(([Icon, title, copy]) => (
            <a
              href="#contact-form"
              className="flex items-center justify-between gap-6 border-b border-slate-200 px-8 py-7 last:border-b-0"
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

      <section className="bg-navy px-6 py-20 text-white lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="max-w-xs text-sm leading-6 text-slate-300">
              Architectural Excellence in Consulting. Redefining the structural integrity of
              global business since 1988.
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
              {offices.map(([city, address, phone, email]) => (
                <div key={city}>
                  <h3 className="font-serif text-2xl">{city}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{address}</p>
                  <p className="text-sm leading-6 text-slate-300">{phone}</p>
                  <a className="text-sm leading-6 text-slate-300 underline" href={`mailto:${email}`}>
                    {email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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

          <form className="border border-slate-200 bg-white p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-[10px] font-bold tracking-wide text-slate-500">FULL NAME</span>
                <input className="mt-2 w-full border border-slate-200 px-3 py-3 text-sm" placeholder="Jane Doe" />
              </label>
              <label className="block">
                <span className="text-[10px] font-bold tracking-wide text-slate-500">COMPANY</span>
                <input className="mt-2 w-full border border-slate-200 px-3 py-3 text-sm" placeholder="Organization Name" />
              </label>
              <label className="block">
                <span className="text-[10px] font-bold tracking-wide text-slate-500">BUSINESS EMAIL</span>
                <input className="mt-2 w-full border border-slate-200 px-3 py-3 text-sm" placeholder="jane@company.com" />
              </label>
              <label className="block">
                <span className="text-[10px] font-bold tracking-wide text-slate-500">PHONE (OPTIONAL)</span>
                <input className="mt-2 w-full border border-slate-200 px-3 py-3 text-sm" placeholder="+1 (555) 000-0000" />
              </label>
            </div>
            <label className="mt-5 block">
              <span className="text-[10px] font-bold tracking-wide text-slate-500">PRACTICE AREA</span>
              <select className="mt-2 w-full border border-slate-200 px-3 py-3 text-sm text-slate-500">
                <option>Select an area of interest</option>
                <option>Corporate Law</option>
                <option>Tax Advisory</option>
                <option>Risk & Assurance</option>
                <option>Business Advisory</option>
              </select>
            </label>
            <label className="mt-5 block">
              <span className="text-[10px] font-bold tracking-wide text-slate-500">MESSAGE</span>
              <textarea
                className="mt-2 h-28 w-full border border-slate-200 px-3 py-3 text-sm"
                placeholder="Briefly describe your objectives..."
              />
            </label>
            <button type="submit" className="mt-6 flex items-center gap-2 bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white">
              BOOK MY CONSULTATION <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </section>

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

      <section id="leadership" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <h2 className="text-center font-serif text-4xl text-ink">Speak Directly With Our Leadership</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {leaders.map(([name, role, focus, img]) => (
            <article key={name}>
              <img className="h-80 w-full object-cover grayscale" src={img} alt={name} />
              <h3 className="mt-5 font-serif text-2xl text-ink">{name}</h3>
              <p className="mt-1 text-xs font-bold tracking-wide text-slate-500">{role}</p>
              <p className="mt-2 text-sm text-slate-600">{focus}</p>
              <div className="mt-5 border-t border-slate-200" />
              <a className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold tracking-wide text-ink" href="#contact-form">
                SCHEDULE DISCUSSION <ArrowRight size={13} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#fdf9f8] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-serif text-4xl text-ink">Frequently Asked Questions</h2>
          <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map(([q, a]) => (
              <details className="group py-6" key={q}>
                <summary className="flex cursor-pointer list-none items-center justify-between font-serif text-xl italic text-ink">
                  {q}
                  <span className="text-slate-400 transition-transform group-open:rotate-180">⌄</span>
                </summary>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 text-center">
        <h2 className="mx-auto max-w-2xl font-serif text-5xl leading-tight text-ink">
          Let&apos;s Build Something Meaningful Together.
        </h2>
        <div className="mt-9 flex justify-center gap-3">
          <a href="#contact-form" className="bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white">
            BOOK A CONSULTATION
          </a>
          <a href="#leadership" className="border border-ink px-5 py-3 text-xs font-bold tracking-wide">
            CALL OUR TEAM
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}