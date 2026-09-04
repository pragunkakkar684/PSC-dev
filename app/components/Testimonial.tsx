'use client';

import { Quote } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface TestimonialItem {
  id?: number;
  quote: string;
  personName?: string | null;
  personTitle?: string | null;
  companyName?: string | null;
  authorName?: string | null;
  name?: string;
  authorRole?: string | null;
  role?: string;
  authorCompany?: string | null;
  authorAvatarUrl?: string | null;
  avatar?: string;
}

const defaultTestimonials: TestimonialItem[] = [
  {
    quote:
      'PSC Global has been instrumental in our expansion across three continents. Their integrated approach to tax and legal simplified what would have otherwise been a logistical nightmare.',
    name: 'Jonathan Walters',
    role: 'CEO, TechStream Industries',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80',
  },
  {
    quote:
      'The depth of regulatory expertise across every market we entered gave our board the confidence to move fast without cutting corners.',
    name: 'Priya Anand',
    role: 'CFO, Meridian Logistics',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
  },
  {
    quote:
      'PSC Global didn\u2019t just advise us through our merger \u2014 they anticipated every regulatory hurdle before it became a problem.',
    name: 'David Chen',
    role: 'Managing Director, Halcyon Capital',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
  },
];

const INTERVAL_MS = 5000;

export default function Testimonial({ data }: { data?: TestimonialItem[] }) {
  const [index, setIndex] = useState(0);

  const list = data && data.length > 0 ? data : defaultTestimonials;

  useEffect(() => {
    if (list.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % list.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [list.length]);

  const rawActive = list[index] || list[0];
  const active = {
    quote: rawActive.quote,
    name: rawActive.personName || rawActive.authorName || rawActive.name || rawActive.companyName || 'Anonymous',
    role:
      [rawActive.personTitle, rawActive.authorRole, rawActive.companyName, rawActive.authorCompany]
        .filter(Boolean)
        .join(', ') ||
      rawActive.role ||
      '',
    avatar: rawActive.authorAvatarUrl || rawActive.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80',
  };

  return (
    <section className="mx-auto flex min-h-[75vh] max-w-5xl flex-col justify-center px-6 py-24 lg:px-10">
      <Quote className="fill-[#e7f1ff] text-[#e7f1ff]" size={64} />
      <div key={index} className="animate-rise mt-2 text-center">
        <blockquote className="mx-auto max-w-3xl text-2xl leading-relaxed text-navy">
          &ldquo;{active.quote}&rdquo;
        </blockquote>
        <div className="mt-8 flex items-center justify-center gap-3">
          <img
            src={active.avatar}
            alt={active.name}
            className="h-12 w-12 rounded-full object-cover grayscale"
          />
          <div className="text-left">
            <p className="text-sm font-semibold text-ink">{active.name}</p>
            {active.role && <p className="text-sm text-slate-500">{active.role}</p>}
          </div>
        </div>
      </div>
      {list.length > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {list.map((t, i) => {
            const tName = t.authorName || t.name || `Testimonial ${i + 1}`;
            return (
              <button
                key={t.id || i}
                aria-label={`Show testimonial from ${tName}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-5 bg-sky-600' : 'w-2 bg-slate-300'
                }`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}