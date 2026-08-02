import { Quote } from 'lucide-react';

export default function Testimonial() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 text-center">
      <Quote className="mx-auto fill-sky-100 text-sky-100" size={56} />
      <blockquote className="mt-3 text-base font-bold leading-7">
        &ldquo;PSC Global has been instrumental in our expansion across three continents. Their integrated approach simplified a logistical nightmare.&rdquo;
        <cite className="mt-5 block text-xs font-normal not-italic text-slate-500">
          Jonathan Walters
          <br />
          CEO, TechNova Industries
        </cite>
      </blockquote>
    </section>
  );
}