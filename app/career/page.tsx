import { ArrowRight, Search } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import Link from 'next/link';

// Replace with a real query (e.g. getPublicOpenRoles()) once careers data lives in the DB.
const openRoles = [
  { id: 'role-1', title: 'Associate — Tax Advisory', location: 'Mumbai', department: 'Tax Advisory', type: 'Full Time' },
  { id: 'role-2', title: 'Senior Associate — Risk & Assurance', location: 'Delhi', department: 'Risk & Assurance', type: 'Full Time' },
  { id: 'role-3', title: 'Manager — Business Advisory', location: 'Bengaluru', department: 'Business Advisory', type: 'Full Time' },
];

const whyPSC = [
  ['01', 'LEARN', 'Engage with complex, high-stakes challenges that demand rigorous analytical thinking and continuous intellectual expansion.'],
  ['02', 'GROW', 'Benefit from structured mentorship and a clear trajectory for advancement within a true meritocracy.'],
  ['03', 'COLLABORATE', 'Work alongside distinguished specialists across disciplines in a culture that values collective intelligence over individual ego.'],
  ['04', 'MAKE AN IMPACT', 'Advise at the highest levels, shaping decisions that define the future of leading organizations and industries.'],
];

const journey = [
  ['01', 'Explore', 'Discover our practice areas and find where your expertise aligns with our mission.'],
  ['02', 'Apply', 'Submit your credentials through our streamlined process for review by our talent team.'],
  ['03', 'Connect', 'Engage in meaningful conversations with our partners to discuss mutual alignment.'],
  ['04', 'Join', 'Begin your impactful career with comprehensive onboarding and mentorship.'],
];

// Static culture testimonials -- swap for a query if these should be editable via CMS.
const voices = [
  {
    id: 'voice-1',
    name: 'Priya Sharma',
    roleTitle: 'Partner, Tax Advisory',
    quote: 'What stands out here is the autonomy. We are trusted to lead complex engagements and build genuine client partnerships from day one.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85',
  },
  {
    id: 'voice-2',
    name: 'Rahul Mehta',
    roleTitle: 'Director, Business Advisory',
    quote: 'The caliber of talent I work with daily constantly pushes me to elevate my strategic thinking and approach to problem-solving.',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=85',
  },
  {
    id: 'voice-3',
    name: 'Aisha Desai',
    roleTitle: 'Senior Manager, Risk',
    quote: 'There is a tangible commitment to continuous learning here. The mentorship I have received has been instrumental to my trajectory.',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=85',
  },
];

export default function CareersPage() {
  return (
    <main id="top">
      <SiteHeader />

      {/* HERO */}
      <AnimatedSection className="relative flex h-[calc(100vh-88px)] items-center overflow-hidden bg-navy">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=85"
          alt="PSC Global team collaborating"
        />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-6 text-center text-white lg:px-10">
          <h1 className="max-w-3xl font-serif text-6xl leading-[1.02] tracking-[-.045em] sm:text-7xl">
            Build a Career With Purpose.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-200 lg:text-lg">
            At PSC Global, we bring together ambitious professionals, specialists and
            problem-solvers who want to build meaningful careers while helping businesses
            navigate complexity and create lasting value.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#open-roles"
              className="inline-flex items-center gap-3 bg-white px-5 py-3 text-xs font-bold text-ink transition hover:bg-slate-100"
            >
              VIEW OPEN POSITIONS
            </a>
            <Link
              href="/careers/life-at-psc"
              className="inline-flex items-center gap-3 border border-white px-5 py-3 text-xs font-bold text-white transition hover:bg-white hover:text-ink"
            >
              LIFE AT PSC
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* FIND YOUR OPPORTUNITY */}
      <AnimatedSection id="open-roles" className="border-t border-slate-200 bg-[#fdf9f8] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-4xl lg:text-5xl">Find Your Opportunity</h2>

          <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Keyword Search..."
                className="w-full border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-ink placeholder:text-slate-400 focus:border-navy focus:outline-none"
              />
            </div>
            <select className="border border-slate-300 bg-white px-4 py-3 text-sm text-ink focus:border-navy focus:outline-none md:w-56">
              <option>All Locations</option>
              <option>Mumbai</option>
              <option>Delhi</option>
              <option>Bengaluru</option>
            </select>
            <select className="border border-slate-300 bg-white px-4 py-3 text-sm text-ink focus:border-navy focus:outline-none md:w-56">
              <option>All Practice Areas</option>
              <option>Tax Advisory</option>
              <option>Risk & Assurance</option>
              <option>Business Advisory</option>
            </select>
            <button className="bg-navy px-6 py-3 text-xs font-bold tracking-wide text-white transition hover:bg-slate-800 md:w-auto">
              SEARCH ROLES
            </button>
          </div>

          <div className="mt-10 divide-y divide-slate-200 border-t border-slate-200">
            {openRoles.map((role) => (
              <div
                key={role.id}
                className="grid grid-cols-2 items-center gap-4 py-6 md:grid-cols-[2fr_1fr_1fr_1fr_auto]"
              >
                <h3 className="font-serif text-2xl leading-tight">{role.title}</h3>
                <span className="text-sm text-slate-600">{role.location}</span>
                <span className="text-sm text-slate-600">{role.department}</span>
                <span className="text-sm text-slate-600">{role.type}</span>
                <Link
                  href={`/careers/${role.id}`}
                  className="col-span-2 flex items-center gap-2 text-xs font-bold tracking-wide text-navy hover:underline md:col-span-1 md:justify-self-end"
                >
                  VIEW ROLE <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* WHY PSC GLOBAL */}
      <AnimatedSection className="border-t border-slate-700/60 bg-navy px-6 py-20 text-white lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center">
          <h2 className="font-serif text-5xl lg:text-6xl">Why PSC Global</h2>
          <span className="mt-4 h-px w-16 bg-amber-400" />
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {whyPSC.map(([num, title, copy]) => (
              <div key={title}>
                <span className="font-mono text-xs tracking-[.18em] text-amber-400">{num}</span>
                <h3 className="mt-3 font-serif text-2xl">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-300">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* YOUR JOURNEY WITH PSC */}
      <AnimatedSection className="border-t border-slate-200 px-6 py-24 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center">
          <h2 className="font-serif text-5xl lg:text-6xl">Your Journey with PSC</h2>
          <span className="mt-4 h-px w-16 bg-amber-400" />
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {journey.map(([num, title, copy]) => (
              <div key={title}>
                <span className="font-mono text-xs tracking-[.18em] text-slate-400">{num}</span>
                <h3 className="mt-3 font-serif text-2xl">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-600">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* MEET THE PEOPLE BEHIND PSC */}
      <AnimatedSection className="border-t border-slate-200 px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-serif text-5xl lg:text-6xl">Meet the People Behind PSC</h2>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {voices.map((v) => (
              <article key={v.id} className="profile-card">
                <img
                  className="h-80 w-full object-cover grayscale"
                  src={v.imageUrl}
                  alt={v.name}
                />
                <h3 className="mt-4 font-serif text-2xl">{v.name}</h3>
                <p className="mt-1 text-xs font-bold tracking-widest text-sky-800 uppercase">{v.roleTitle}</p>
                <p className="mt-3 text-sm italic leading-6 text-slate-600">&ldquo;{v.quote}&rdquo;</p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="flex flex-col items-center justify-center border-t border-slate-200 bg-sky-50 px-6 py-24 text-center">
        <h2 className="max-w-2xl font-serif text-5xl leading-[1.05] lg:text-6xl">
          Your Next Chapter Could Start Here.
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#open-roles"
            className="bg-ink px-5 py-3 text-xs font-bold text-white transition hover:bg-slate-800"
          >
            VIEW OPEN POSITIONS
          </a>
          <Link
            href="/contact"
            className="border border-ink px-5 py-3 text-xs font-bold transition hover:bg-slate-100"
          >
            CONTACT OUR TEAM
          </Link>
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  );
}