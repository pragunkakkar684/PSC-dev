'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  /** e.g. '2024-10-24' */
  targetDate: string;
  /** e.g. '10:00 AM' */
  targetTime?: string;
  /** e.g. 'EST' — display only, not used for calculation */
  timezone?: string;
}

function parseTarget(targetDate: string, targetTime?: string) {
  if (targetTime) {
    const parsed = new Date(`${targetDate} ${targetTime}`);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  return new Date(targetDate);
}

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isPast: diff <= 0,
  };
}

export default function CountdownTimer({ targetDate, targetTime, timezone }: CountdownTimerProps) {
  const target = parseTarget(targetDate, targetTime);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate, targetTime]);

  if (timeLeft.isPast) {
    return (
      <div className="flex items-center gap-2 text-xs font-bold tracking-wide text-emerald-700 uppercase">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600" />
        Live now
      </div>
    );
  }

  const units = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HRS', value: timeLeft.hours },
    { label: 'MIN', value: timeLeft.minutes },
    { label: 'SEC', value: timeLeft.seconds },
  ];

  return (
    <div>
      <p className="font-mono text-[10px] tracking-[.18em] text-slate-500 uppercase">Starts In</p>
      <div className="mt-2 flex gap-2">
        {units.map((u) => (
          <div
            key={u.label}
            className="flex min-w-[52px] flex-col items-center border border-slate-200 bg-white px-2.5 py-2"
          >
            <span className="font-serif text-2xl tabular-nums text-ink">{String(u.value).padStart(2, '0')}</span>
            <span className="mt-0.5 font-mono text-[9px] tracking-[.12em] text-slate-400">{u.label}</span>
          </div>
        ))}
      </div>
      {timezone && <p className="mt-2 font-mono text-[10px] tracking-wide text-slate-400">{timezone}</p>}
    </div>
  );
}