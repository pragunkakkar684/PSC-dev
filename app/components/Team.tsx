'use client';

import { ArrowLeft, ArrowRight, Mail, Share2 } from 'lucide-react';
import type { TeamMember } from '@/lib/db/schema';
import Link from 'next/link';
import { useRef } from 'react';

interface TeamProps {
  data?: TeamMember[] | null;
}

const defaultLeaders = [
  [
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=85',
    'Dr. Julian Vance',
    'MANAGING PARTNER',
    'FOUNDER & CEO',
    'With over three decades of experience in structural economics, Dr. Vance has advised four of the world\u2019s top ten sovereign wealth funds.',
    'vance-spencer',
  ],
  [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=85',
    'Helena Thorne',
    'CHIEF STRATEGY OFFICER',
    'PARTNER, DIGITAL TRANSFORMATION',
    'Helena leads our transformation labs, bridging the gap between legacy infrastructure and emergent AI-driven business models.',
    'helena-thorne',
  ],
  [
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=85',
    'Marcus Oh',
    'HEAD OF OPERATIONS',
    'PRINCIPAL, GLOBAL LOGISTICS',
    'Marcus specializes in complex logistics and supply chain optimization, having managed projects exceeding $4B in annual spend.',
    'marcus-oh',
  ],
];

export default function Team({ data }: TeamProps) {
  // Falls back to the default leaders whenever there are 1 or fewer real records —
  // guards against a single dummy/placeholder row (e.g. "vance-spencer") in the DB
  // being treated as real content. Same threshold used on the /team page.
  const hasDbData = data && data.length > 1;
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild instanceof HTMLElement ? el.firstElementChild.offsetWidth : 320;
    el.scrollBy({ left: direction === 'left' ? -(cardWidth + 28) : cardWidth + 28, behavior: 'smooth' });
  };

  return (
    <section id="team" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <p
        className="text-[10px] tracking-[.18em] text-slate-500"
        style={{ fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }}
      >
        EXECUTIVE STEWARDSHIP
      </p>
      <div className="mt-4 flex items-end justify-between gap-6">
        <h2 className="max-w-3xl font-serif text-5xl sm:text-6xl">The Leadership Behind the Architecture.</h2>
        <div className="flex shrink-0 gap-2">
          <button
            aria-label="Previous"
            onClick={() => scroll('left')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 transition hover:bg-slate-100"
          >
            <ArrowLeft size={15} />
          </button>
          <button
            aria-label="Next"
            onClick={() => scroll('right')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 transition hover:bg-slate-100"
          >
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
      <div
        ref={trackRef}
        className="mt-10 flex snap-x snap-mandatory gap-7 overflow-x-auto scroll-smooth pb-2"
      >
        {hasDbData
          ? data.map((m) => (
              <article
                className="profile-card group w-[85vw] shrink-0 snap-start sm:w-[340px]"
                key={m.id}
              >
                <Link href={`/partner/${m.slug}`}>
                  <div className="relative overflow-hidden">
                    <img
                      className="h-[420px] w-full object-cover grayscale transition duration-300 group-hover:grayscale-0"
                      src={
                        m.imageUrl ||
                        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=85'
                      }
                      alt={m.name}
                    />
                    <span className="absolute top-3 left-3 bg-navy px-2.5 py-1 text-[9px] font-semibold tracking-widest text-white uppercase">
                      {m.category || m.roleTitle}
                    </span>
                  </div>
                  <h3 className="mt-5 font-serif text-2xl transition-colors group-hover:text-sky-800">
                    {m.name}
                  </h3>
                  <small className="text-[10px] tracking-widest text-slate-500 uppercase">{m.roleTitle}</small>
                  <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">{m.shortBio}</p>
                </Link>
                <div className="mt-4 flex gap-4 text-slate-400">
                  <Share2 size={15} className="transition hover:text-ink" />
                  {m.email && (
                    <a href={`mailto:${m.email}`} title={`Email ${m.name}`}>
                      <Mail size={15} className="transition hover:text-ink" />
                    </a>
                  )}
                </div>
              </article>
            ))
          : defaultLeaders.map(([image, name, badge, byline, bio, slug]) => (
              <article
                className="profile-card group w-[85vw] shrink-0 snap-start sm:w-[340px]"
                key={name}
              >
                <Link href={`/partner/${slug}`}>
                  <div className="relative overflow-hidden">
                    <img
                      className="h-[420px] w-full object-cover grayscale transition duration-300 group-hover:grayscale-0"
                      src={image}
                      alt={name}
                    />
                    <span className="absolute top-3 left-3 bg-navy px-2.5 py-1 text-[9px] font-semibold tracking-widest text-white uppercase">
                      {badge}
                    </span>
                  </div>
                  <h3 className="mt-5 font-serif text-2xl transition-colors group-hover:text-sky-800">{name}</h3>
                  <small className="text-[10px] tracking-widest text-slate-500 uppercase">{byline}</small>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{bio}</p>
                </Link>
                <div className="mt-4 flex gap-4 text-slate-400">
                  <Share2 size={15} className="transition hover:text-ink" />
                  <Mail size={15} className="transition hover:text-ink" />
                </div>
              </article>
            ))}
      </div>
    </section>
  );
}