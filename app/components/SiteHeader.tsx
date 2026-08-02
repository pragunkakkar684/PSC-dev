'use client';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

type Menu = 'about' | 'practice' | 'industries' | 'insights';

const nav: [string, string, Menu?][] = [
  ['About', '#about', 'about'],
  ['Our Team', '#team'],
  ['Practice Areas', '#practice', 'practice'],
  ['Industries', '#sectors', 'industries'],
  ['Insights', '#insights', 'insights'],
  ['Events', '#insights'],
  ['Contact', '#contact'],
  ['Client Portal', '#contact'],
];

const detail: Record<Menu, string[]> = {
  about: ['Company Overview', 'Our Story', 'Leadership', 'Why PSC', 'Global Presence', 'Awards & Recognition'],
  practice: ['Risk & Assurance', 'Tax & Fiscal Advisory', 'Corporate Law', 'Business Advisory', 'Business Process'],
  industries: ['Manufacturing', 'Infrastructure', 'Financial Services', 'Healthcare', 'Technology', 'E-Commerce'],
  insights: ['Reports & Research', 'Case Studies', 'Market Intelligence', 'Events & Webinars'],
};

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Menu | null>(null);

  return (
    <header
      onMouseLeave={() => setActive(null)}
      className="sticky top-0 z-50 flex h-21 items-center gap-6 border-b border-slate-100 bg-white px-6 shadow-sm lg:h-24 lg:px-12"
    >
      <a href="#top" className="flex flex-col font-serif text-3xl leading-[.82] tracking-tight">
        <span>PSC</span>
        <span>Global</span>
      </a>

      <button className="ml-auto lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
        {open ? <X /> : <Menu />}
      </button>

      <nav
        className={`${open ? 'flex' : 'hidden'} absolute left-0 top-full w-full flex-col gap-4 border-b border-slate-100 bg-white p-6 shadow-lg lg:static lg:flex lg:flex-1 lg:flex-row lg:items-center lg:justify-center lg:gap-6 lg:border-0 lg:p-0 lg:shadow-none`}
      >
        {nav.map(([label, href, menu]) => (
          <a
            key={label}
            href={href}
            onMouseEnter={() => setActive(menu || null)}
            onClick={() => setOpen(false)}
            className="text-sm uppercase tracking-wide text-[#31597d] transition hover:font-bold hover:text-ink hover:underline hover:underline-offset-8"
          >
            {label}
          </a>
        ))}
      </nav>

      <a
        href="#contact"
        className="hidden bg-ink px-8 py-4 text-center text-xs uppercase leading-6 tracking-widest text-white transition hover:-translate-y-1 hover:shadow-xl lg:block"
      >
        Book
        <br />
        Consultation
      </a>

      {active && (
        <div className="absolute inset-x-0 top-full hidden border-t border-slate-100 bg-white px-12 py-9 shadow-2xl lg:block">
          <div className="mx-auto grid max-w-6xl grid-cols-[.7fr_1.3fr] gap-16">
            <div>
              <p className="font-mono text-[10px] tracking-[.18em] text-sky-700">EXPLORE PSC</p>
              <h2 className="mt-3 font-serif text-3xl capitalize">{active}</h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
                Discover the expertise, people and insight that make PSC Global a trusted strategic partner.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-10">
              {detail[active].map((item) => (
                <a
                  className="flex items-center justify-between border-b border-slate-100 py-3 text-sm text-slate-700 transition hover:translate-x-1 hover:text-ink"
                  href="#top"
                  key={item}
                >
                  {item}
                  <ArrowRight size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}