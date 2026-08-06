import { Clock, Users, Globe2, CheckCircle2 } from 'lucide-react';

const stats = [
  [Clock, '22+', 'YEARS OF EXPERIENCE'],
  [Users, '1,000+', 'GLOBAL PROFESSIONALS'],
  [Globe2, '15+', 'COUNTRIES SERVED'],
  [CheckCircle2, '250+', 'EXPERTS & CONSULTANTS'],
] as const;

export default function Stats() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-6 py-10 sm:grid-cols-4 lg:px-10">
      {stats.map(([Icon, number, label], index) => (
        <div
          className="animate-rise border-slate-200 pl-4 sm:border-r sm:pl-7 sm:last:border-0"
          style={{ animationDelay: `${index * 80}ms` }}
          key={number}
        >
          <Icon size={20} className="text-slate-400" />
          <strong className="mt-3 block font-serif text-3xl">{number}</strong>
          <small className="mt-2 block text-[10px] tracking-wide text-slate-500">{label}</small>
        </div>
      ))}
    </section>
  );
}