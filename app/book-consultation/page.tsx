import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';

export default function BookConsultationPage() {
  return (
    <main id="top">
      <SiteHeader />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10 lg:py-20">
        <div>
          <p className="font-mono text-xs uppercase tracking-[.18em] text-slate-500">
            BOOK A CONSULTATION
          </p>
          <h1 className="mt-4 font-serif text-3xl leading-snug text-ink sm:text-4xl">
            A Better Conversation Starts Here.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
            Our online consultation experience is currently being prepared. In the meantime,
            our team is available to help you discuss your business requirements and connect
            you with the right PSC Global specialist.
          </p>

          <div className="mt-8 border border-slate-200 bg-white p-8">
            <h2 className="font-serif text-2xl text-ink">Online Consultation Booking</h2>
            <span className="mt-4 inline-block bg-sky-100 px-4 py-2 text-sm font-bold uppercase tracking-wide text-ink">
              Coming Soon
            </span>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              We are preparing a streamlined digital consultation experience to make connecting
              with our specialists even simpler.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="flex items-center gap-2 bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white transition hover:bg-slate-800"
            >
              CONTACT OUR TEAM <ArrowRight size={14} />
            </Link>
            <Link
              href="/"
              className="border border-ink px-5 py-3 text-xs font-bold tracking-wide transition hover:bg-slate-100"
            >
              BACK TO HOME
            </Link>
          </div>

          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 text-sm text-ink underline underline-offset-4"
          >
            Need to speak with us now? Contact our team <ArrowRight size={14} />
          </Link>
        </div>

        <div className="relative">
          <img
            className="h-[420px] w-full object-cover grayscale lg:h-[660px]"
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85"
            alt="PSC Global boardroom"
          />
          <div className="pointer-events-none absolute inset-3 border border-white/40" />
        </div>
      </section>

      <Footer />
    </main>
  );
}