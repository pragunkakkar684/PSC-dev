'use client';

import { Shield, CheckCircle2 } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useStaggerAnimation } from './useStaggerAnimation';

const advantages = [
  ['Multidisciplinary Talent', 'One-stop shop for tax, legal, and audit under a unified strategy.'],
  ['Uncompromising Integrity', 'Ethical standards that exceed international regulatory requirements.'],
  ['Agile Response', 'Global scale with boutique firm responsiveness and partner involvement.'],
];

export default function About() {
  const listRef = useStaggerAnimation<HTMLOListElement>('li');

  return (
    <AnimatedSection id="about" className="flex min-h-screen items-center bg-navy text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-16 px-6 py-20 lg:grid-cols-[1.1fr_.9fr] lg:px-10">
        <div>
          <p
            className="text-[10px] tracking-[.18em] text-sky-200"
            style={{ fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }}
          >
            THE PSC ADVANTAGE
          </p>
          <h2 className="mt-4 max-w-md font-serif text-5xl leading-tight sm:text-6xl">
            Why Global Leaders Partner With Us
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300">
            At PSC Global, we don&rsquo;t just provide services; we build enduring partnerships. Our firm stands
            at the intersection of local expertise and global reach.
          </p>
          <ol ref={listRef} className="mt-10 space-y-7">
            {advantages.map(([title, copy], i) => (
              <li className="flex gap-4" key={title}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e7f1ff] text-sm font-semibold text-navy">
                  {i + 1}
                </span>
                <div>
                  <b className="block font-serif text-xl font-normal text-white">{title}</b>
                  <span className="mt-1 block text-sm leading-6 text-slate-300">{copy}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="grid grid-cols-2 gap-4 self-center">
          <div className="flex aspect-square flex-col justify-center border border-white/10 bg-white/[0.03] p-8">
            <b className="font-serif text-6xl font-normal">98%</b>
            <span className="mt-3 block text-[10px] tracking-widest text-slate-300 uppercase">
              Client Retention Rate
            </span>
          </div>
          <div className="flex aspect-square flex-col justify-center border border-white/10 bg-white/[0.03] p-8">
            <Shield size={22} className="text-slate-300" />
            <b className="mt-4 block font-serif text-2xl font-normal">Global</b>
            <span className="mt-1 block text-[10px] tracking-widest text-slate-400 uppercase">
              Certified Standards
            </span>
          </div>
          <div className="flex aspect-square flex-col justify-center bg-[#4d6c8a] p-8">
            <b className="font-serif text-6xl font-normal">24/7</b>
            <span className="mt-3 block text-[10px] tracking-widest text-slate-100 uppercase">
              Support Coverage
            </span>
          </div>
          <div className="flex aspect-square flex-col justify-center border border-white/10 bg-white/[0.03] p-8">
            <CheckCircle2 size={22} className="text-slate-300" />
            <b className="mt-4 block font-serif text-2xl font-normal">Elite</b>
            <span className="mt-1 block text-[10px] tracking-widest text-slate-400 uppercase">
              Tier-1 Consultants
            </span>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}