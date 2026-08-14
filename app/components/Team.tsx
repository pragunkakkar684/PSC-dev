import { ArrowLeft, ArrowRight, Mail, Star } from 'lucide-react';
import type { TeamMember } from '@/lib/db/schema';
import Link from 'next/link';

interface TeamProps {
  data?: TeamMember[] | null;
}

const defaultLeaders = [
  [
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=85',
    'Dr. Julian Vance',
    'MANAGING PARTNER',
    'With over three decades of experience in structural economics, Dr. Vance has advised four of the world\u2019s top ten sovereign wealth funds.',
    'vance-spencer',
  ],
  [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=85',
    'Helena Thorne',
    'CHIEF STRATEGY OFFICER',
    'Helena leads our transformation labs, bridging the gap between legacy infrastructure and emergent AI-driven business models.',
    'helena-thorne',
  ],
  [
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=85',
    'Marcus Oh',
    'HEAD OF OPERATIONS',
    'Marcus specializes in complex logistics and supply chain optimization, having managed projects exceeding $4B in annual spend.',
    'marcus-oh',
  ],
];

export default function Team({ data }: TeamProps) {
  const hasDbData = data && data.length > 0;

  return (
    <section id="team" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <p className="font-mono text-[10px] tracking-[.18em] text-slate-500">EXECUTIVE STEWARDSHIP</p>
      <div className="mt-4 flex items-end justify-between">
        <h2 className="max-w-xl font-serif text-4xl">The Leadership Behind the Architecture.</h2>
        <div className="hidden gap-2 sm:flex">
          <button
            aria-label="Previous"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 transition hover:bg-slate-100"
          >
            <ArrowLeft size={15} />
          </button>
          <button
            aria-label="Next"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 transition hover:bg-slate-100"
          >
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
      <div className="mt-10 grid gap-7 md:grid-cols-3">
        {hasDbData
          ? data.map((m) => (
              <article className="group" key={m.id}>
                <Link href={`/partner/${m.slug}`}>
                  <div className="relative overflow-hidden">
                    <img
                      className="h-80 w-full object-cover grayscale transition duration-300 group-hover:grayscale-0"
                      src={m.imageUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=85'}
                      alt={m.name}
                    />
                    <span className="absolute left-3 top-3 bg-navy px-2.5 py-1 text-[9px] font-semibold tracking-widest text-white uppercase">
                      {m.roleTitle || m.category}
                    </span>
                  </div>
                  <h3 className="mt-5 font-serif text-xl group-hover:text-sky-800 transition-colors">{m.name}</h3>
                  <small className="text-[10px] tracking-widest text-slate-500 uppercase">{m.roleTitle}</small>
                  <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">{m.shortBio}</p>
                </Link>
                <div className="mt-3 flex gap-4 text-slate-400">
                  {m.email && (
                    <a href={`mailto:${m.email}`} title={`Email ${m.name}`}>
                      <Mail size={15} className="transition hover:text-ink" />
                    </a>
                  )}
                </div>
              </article>
            ))
          : defaultLeaders.map(([image, name, role, bio, slug]) => (
              <article className="group" key={name}>
                <Link href={`/partner/${slug}`}>
                  <div className="relative overflow-hidden">
                    <img
                      className="h-80 w-full object-cover grayscale transition duration-300 group-hover:grayscale-0"
                      src={image}
                      alt={name}
                    />
                    <span className="absolute left-3 top-3 bg-navy px-2.5 py-1 text-[9px] font-semibold tracking-widest text-white">
                      {role}
                    </span>
                  </div>
                  <h3 className="mt-5 font-serif text-xl group-hover:text-sky-800 transition-colors">{name}</h3>
                  <small className="text-[10px] tracking-widest text-slate-500">{role}</small>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{bio}</p>
                </Link>
                <div className="mt-3 flex gap-4 text-slate-400">
                  <Mail size={15} className="transition hover:text-ink" />
                </div>
              </article>
            ))}
      </div>
    </section>
  );
}