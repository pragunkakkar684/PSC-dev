import { ArrowUpRight } from 'lucide-react';

export default function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto mb-14 flex max-w-6xl flex-col justify-between gap-7 bg-blue-50 px-7 py-10 sm:flex-row sm:items-center sm:px-12"
    >
      <div>
        <h2 className="font-serif text-3xl">Ready to re-architect your future?</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
          Schedule a private briefing with our senior partners.
        </p>
      </div>
      <a
        href="#contact"
        className="inline-flex items-center gap-3 bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:shadow-xl"
      >
        Book Consultation
        <ArrowUpRight size={16} />
      </a>
    </section>
  );
}