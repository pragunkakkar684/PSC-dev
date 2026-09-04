'use client';

import type { Industry } from '@/lib/db/schema';
import Link from 'next/link';
import AnimatedSection from './AnimatedSection';
import { useStaggerAnimation } from './useStaggerAnimation';

interface SectorsProps {
  data?: Industry[] | null;
}

const defaultSectors = [
  [
    'Logistics & Manufacturing',
    'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=700&q=70',
  ],
  [
    'Financial Services',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=70',
  ],
  [
    'Technology & Media',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=70',
  ],
  [
    'Healthcare & Pharma',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=700&q=70',
  ],
];

export default function Sectors({ data }: SectorsProps) {
  const hasDbData = data && data.length > 0;
  const cardRef = useStaggerAnimation<HTMLDivElement>('article');

  return (
    <AnimatedSection id="sectors" className="flex min-h-screen items-center bg-navy text-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-10">
        <p
          className="text-[10px] tracking-[.18em] text-sky-200"
          style={{ fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }}
        >
          OUR ECOSYSTEM
        </p>
        <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="font-serif text-5xl sm:text-6xl">Sectors We Serve</h2>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <p className="max-w-sm border-l border-white/20 pl-8 text-[15px] leading-7 text-slate-300">
              Specialized expertise tailored for industries that define the global economy. From heavy
              infrastructure to digital finance, we build bridges between potential and performance.
            </p>
            <Link
              className="text-xs font-semibold text-white underline underline-offset-4"
              href="/industries"
            >
              Browse All Industries
            </Link>
          </div>
        </div>
        <div ref={cardRef} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {hasDbData
            ? data.slice(0, 4).map((ind) => {
                const img =
                  ind.imageUrl ||
                  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=70';
                return (
                  <article
                    className="flex h-[62vh] min-h-[380px] items-end bg-cover bg-center p-5 grayscale transition duration-200 ease-out hover:-translate-y-0.5 hover:grayscale-0"
                    style={{
                      backgroundImage: `linear-gradient(0deg,rgba(0,18,38,.95),rgba(0,18,38,.08)),url(${img})`,
                    }}
                    key={ind.id}
                  >
                    <Link href={`/industries/${ind.slug}`} className="block w-full">
                      <span className="font-serif text-2xl leading-tight sm:text-[28px]">{ind.name}</span>
                    </Link>
                  </article>
                );
              })
            : defaultSectors.map(([title, image]) => (
                <article
                  className="flex h-[62vh] min-h-[380px] items-end bg-cover bg-center p-5 grayscale transition duration-200 ease-out hover:-translate-y-0.5 hover:grayscale-0"
                  style={{
                    backgroundImage: `linear-gradient(0deg,rgba(0,18,38,.95),rgba(0,18,38,.08)),url(${image})`,
                  }}
                  key={title as string}
                >
                  <span className="font-serif text-2xl leading-tight sm:text-[28px]">{title}</span>
                </article>
              ))}
        </div>
      </div>
    </AnimatedSection>
  );
}