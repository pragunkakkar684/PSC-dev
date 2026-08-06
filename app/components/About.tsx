import { CheckCircle2, Globe2 } from 'lucide-react';

const advantages = [
  ['Multidisciplinary Talent', 'Legal, financial audit and strategy.'],
  ['Uncompromising Integrity', 'Ethical standards that exceed requirements.'],
  ['Agile Response', 'Global scale with boutique responsiveness.'],
];

export default function About() {
  return (
    <section id="about" className="bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-[1.1fr_.9fr] lg:px-10">
        <div>
          <p className="font-mono text-[10px] tracking-[.18em] text-sky-200">THE PSC ADVANTAGE</p>
          <h2 className="mt-4 font-serif text-4xl">Why Global Leaders Partner With Us</h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300">
            We build enduring partnerships grounded in trust, expertise and global reach.
          </p>
          <ol className="mt-8 space-y-5">
            {advantages.map(([title, copy], i) => (
              <li className="flex gap-3" key={title}>
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[10px] text-ink">
                  {i + 1}
                </span>
                <p>
                  <b className="block text-sm text-white">{title}</b>
                  <span className="text-xs text-slate-300">{copy}</span>
                </p>
              </li>
            ))}
          </ol>
        </div>
        <div className="grid grid-cols-2 gap-3 self-center">
          <div className="bg-[#071f38] p-8">
            <b className="font-serif text-5xl">98%</b>
            <span className="mt-2 block text-[10px] tracking-widest">CLIENT RETENTION</span>
          </div>
          <div className="bg-[#132c48] p-8">
            <Globe2 size={40} />
            <span className="mt-4 block text-[10px] tracking-widest">GLOBAL STANDARDS</span>
          </div>
          <div className="bg-[#456a8d] p-8">
            <b className="font-serif text-5xl">217+</b>
            <span className="mt-2 block text-[10px] tracking-widest">EXPERT COVERAGE</span>
          </div>
          <div className="bg-white/10 p-8">
            <CheckCircle2 size={32} />
            <b className="mt-3 block font-serif text-2xl">Elite</b>
            <span className="mt-1 block text-[10px] tracking-widest">TIER 1 CONSULTANTS</span>
          </div>
        </div>
      </div>
    </section>
  );
}