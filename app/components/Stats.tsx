'use client';

import { useEffect, useRef, useState } from 'react';
import { Clock, Users, Globe2, CheckCircle2 } from 'lucide-react';

const stats = [
  [Clock, 22, '+', 'YEARS OF EXPERIENCE'],
  [Users, 1000, '+', 'CLIENTS WORLDWIDE'],
  [Globe2, 15, '+', 'COUNTRIES PRESENT'],
  [CheckCircle2, 250, '+', 'EXPERTS & CONSULTANTS'],
] as const;

const DURATION = 1600;

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function useCountUp(target: number, start: boolean) {
  const [value, setValue] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      setValue(Math.round(target * easeOutExpo(progress)));

      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, target]);

  return value;
}

function StatItem({
  Icon,
  target,
  suffix,
  label,
  start,
  delay,
}: {
  Icon: (typeof stats)[number][0];
  target: number;
  suffix: string;
  label: string;
  start: boolean;
  delay: number;
}) {
  const value = useCountUp(target, start);

  return (
    <div
      className="animate-rise flex flex-col items-center border-slate-200 text-center sm:border-r sm:last:border-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Icon size={20} className="text-slate-400" />
      <strong className="mt-4 block font-serif font-medium text-5xl text-slate-900 tabular-nums">
        {value.toLocaleString()}
        {suffix}
      </strong>
      <small className="mt-3 block text-[10px] tracking-wide text-slate-500">{label}</small>
    </div>
  );
}

export default function Stats() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-b border-slate-200 bg-[#fdf9f6] px-6 py-20 lg:px-10"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 sm:grid-cols-4">
        {stats.map(([Icon, target, suffix, label], index) => (
          <StatItem
            key={label}
            Icon={Icon}
            target={target}
            suffix={suffix}
            label={label}
            start={start}
            delay={index * 80}
          />
        ))}
      </div>
    </section>
  );
}