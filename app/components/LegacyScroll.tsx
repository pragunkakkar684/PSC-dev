'use client';

import { useEffect, useRef, useState } from 'react';

const legacy = [
  ['2002', 'FOUNDATION', 'PSC Global is founded in London with a core focus on complex regulatory advisory and cross-border transactions.'],
  ['2005', 'FIRST MANDATE', 'Secures its first Tier-1 institutional client, advising on a landmark cross-border merger.'],
  ['2008', 'MARKET STABILITY', 'Led major restructuring initiatives for Tier-1 financial institutions during the global credit crisis.'],
  ['2011', 'ASIA ENTRY', 'Opens an advisory desk in Hong Kong to support growing demand across Asian markets.'],
  ['2015', 'GLOBAL EXPANSION', 'Inauguration of Singapore and New York regional headquarters to facilitate 24/7 global coverage.'],
  ['2018', 'DIGITAL ADVISORY', 'Launches a data-driven risk modeling practice, pairing regulatory expertise with analytics.'],
  ['2021', 'MIDDLE EAST DESK', 'Establishes a Dubai office to serve sovereign and private clients across the Gulf region.'],
  ['2025', 'THE FUTURE', 'Launching a new era of connected strategic thinking and predictive advisory technology.'],
];

// Height of the pinned viewport while the horizontal scroll plays out.
const STICKY_HEIGHT = 420;

export default function LegacyScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  useEffect(() => {
    function measure() {
      if (!trackRef.current || !clipRef.current) return;
      const trackWidth = trackRef.current.scrollWidth;
      const clipWidth = clipRef.current.clientWidth;
      const scrollDistance = Math.max(trackWidth - clipWidth, 0);
      setContainerHeight(STICKY_HEIGHT + scrollDistance);
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    function onScroll() {
      if (!containerRef.current || !clipRef.current || !trackRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const trackWidth = trackRef.current.scrollWidth;
      const clipWidth = clipRef.current.clientWidth;
      const scrollDistance = Math.max(trackWidth - clipWidth, 0);
      const totalScrollable = containerRef.current.offsetHeight - STICKY_HEIGHT;
      if (totalScrollable <= 0) {
        setTranslateX(0);
        return;
      }
      const progress = Math.min(Math.max(-rect.top / totalScrollable, 0), 1);
      setTranslateX(-progress * scrollDistance);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [containerHeight]);

  return (
    <div
      ref={containerRef}
      className="relative bg-navy text-white"
      style={{ height: containerHeight ? `${containerHeight}px` : `${STICKY_HEIGHT}px` }}
    >
      <div
        className="sticky top-0 flex flex-col justify-center overflow-hidden"
        style={{ height: `${STICKY_HEIGHT}px` }}
      >
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
          <p className="font-mono text-[10px] tracking-[.18em] text-sky-200">THE LEGACY</p>
          <h2 className="mt-4 font-serif text-4xl">22 Years of Excellence</h2>
        </div>

        <div ref={clipRef} className="mx-auto mt-10 w-full max-w-7xl overflow-hidden px-6 lg:px-10">
          <div
            ref={trackRef}
            className="flex gap-8 will-change-transform"
            style={{ transform: `translateX(${translateX}px)` }}
          >
            {legacy.map(([year, title, copy]) => (
              <article className="w-55 shrink-0" key={year}>
                <div className="flex items-center gap-2 border-t border-slate-600 pt-4">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-200" />
                  <b className="font-serif text-2xl text-sky-200">{year}</b>
                </div>
                <h3 className="mt-5 text-xs tracking-widest">{title}</h3>
                <p className="mt-3 text-xs leading-5 text-slate-300">{copy}</p>
              </article>
            ))}
            <div className="w-1 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}