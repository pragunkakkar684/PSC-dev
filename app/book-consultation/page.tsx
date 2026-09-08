import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import PublicContactForm from '../components/PublicContactForm';
import type { Metadata } from 'next';
import { getPublicHeroSection, buildPageMetadata } from '@/lib/queries/public';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('page', 'book-consultation', {
    title: 'Book a Consultation | PSC Global',
    description:
      'Schedule a strategic consultation with PSC Global specialists across Tax, Advisory, Corporate Law, and Risk Management.',
  });
}

export default async function BookConsultationPage() {
  const hero = await getPublicHeroSection('book-consultation');

  return (
    <main id="top">
      <SiteHeader />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10 lg:py-20">
        <div>
          <p className="font-mono text-xs uppercase tracking-[.18em] text-slate-500">
            {hero.eyebrow || 'BOOK A CONSULTATION'}
          </p>
          <h1 className="mt-4 font-serif text-3xl leading-snug text-ink sm:text-4xl">
            {hero.heading || 'A Better Conversation Starts Here.'}
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
            {hero.subheading ||
              'Our team is available to help you discuss your business requirements and connect you with the right PSC Global specialist.'}
          </p>

          <div className="mt-8">
            <h2 className="mb-4 font-serif text-2xl text-ink">Schedule Your Consultation</h2>
            <PublicContactForm />
          </div>
        </div>

        <div className="relative">
          <img
            className="h-[420px] w-full object-cover grayscale lg:h-[660px]"
            src={hero.imageUrl || 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85'}
            alt="PSC Global boardroom"
          />
          <div className="pointer-events-none absolute inset-3 border border-white/40" />
        </div>
      </section>

      <Footer />
    </main>
  );
}