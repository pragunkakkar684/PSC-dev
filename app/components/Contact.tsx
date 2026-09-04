import { ArrowUpRight } from 'lucide-react';

export default function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto mb-20 flex max-w-7xl flex-col justify-between gap-8 bg-blue-50 px-8 py-16 sm:flex-row sm:items-center sm:px-14 lg:py-20"
    >
      <div>
        <h2 className="font-serif text-4xl sm:text-5xl">Ready to re-architect your future?</h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
          Schedule a private briefing with our senior partners.
        </p>
      </div>
      <a
        href="/book-consultation"
        className="inline-flex shrink-0 items-center gap-3 bg-ink px-8 py-4 text-base font-semibold text-white transition hover:-translate-y-1 hover:shadow-xl"
      >
        Book Consultation
        <ArrowUpRight size={18} />
      </a>
    </section>
  );
}