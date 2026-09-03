'use client';

import { useEffect, useRef, useState } from 'react';
import { Clock, Users, Globe2, CheckCircle2 } from 'lucide-react';

interface StatData {
  id?: number;
  label: string;
  value: number;
  suffix: string;
  iconName?: string | null;
}

const defaultStats: StatData[] = [
  { id: 1, label: 'YEARS OF EXPERIENCE', value: 22, suffix: '+', iconName: 'Clock' },
  { id: 2, label: 'CLIENTS WORLDWIDE', value: 1000, suffix: '+', iconName: 'Users' },
  { id: 3, label: 'COUNTRIES PRESENT', value: 15, suffix: '+', iconName: 'Globe2' },
  { id: 4, label: 'EXPERTS & CONSULTANTS', value: 250, suffix: '+', iconName: 'CheckCircle2' },
];

const ICON_MAP: Record<string, any> = {
  Clock,
  Users,
  Globe2,
  CheckCircle2,
};

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
  Icon: any;
  target: number;
  suffix: string;
  label: string;
  start: boolean;
  delay: number;
}) {
  const value = useCountUp(target, start);

  return (
    <div
      className="text-center"
      style={{
        transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms ease',
        transform: start ? 'translateY(0)' : 'translateY(24px)',
        opacity: start ? 1 : 0,
        transitionDelay: `${delay}ms`,
      }}
    >
      <Icon size={20} className="mx-auto text-slate-400" />
      <strong className="mt-4 block font-serif font-medium text-5xl text-slate-900 tabular-nums">
        {value.toLocaleString()}
        {suffix}
      </strong>
      <small className="mt-3 block text-[10px] tracking-wide text-slate-500 uppercase">{label}</small>
    </div>
  );
}

export default function Stats({ data }: { data?: StatData[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [start, setStart] = useState(false);

  const items = data && data.length > 0 ? data : defaultStats;

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
      { threshold: 0.4 }
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
        {items.map((stat, index) => {
          const IconComp = (stat.iconName && ICON_MAP[stat.iconName]) || Clock;
          return (
            <StatItem
              key={stat.label || index}
              Icon={IconComp}
              target={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              start={start}
              delay={index * 80}
            />
          );
        })}
      </div>
    </section>
  );
}