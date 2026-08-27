'use client';

import Image from 'next/image';
import Link from 'next/link';

import logo from '../logo.png';
import PublicNewsletterForm from './PublicNewsletterForm';

const footerLinks = [
  {
    title: 'PRACTICE',
    items: [
      { name: 'Practice Areas', href: '/practice-areas' },
      { name: 'Industries', href: '/industries' },
      { name: 'GCC Advisory', href: '/gcc' },
      { name: 'Events & Seminars', href: '/event' },
    ],
  },
  {
    title: 'COMPANY',
    items: [
      { name: 'About Firm', href: '/about' },
      { name: 'Leadership Team', href: '/team' },
      { name: 'Insights & Research', href: '/insights' },
      { name: 'Contact & Offices', href: '/contact' },
    ],
  },
];

const legalLinks = [
  { name: 'Privacy Policy', href: '#' },
  { name: 'Terms of Service', href: '#' },
  { name: 'Cookie Policy', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-[#07110f] px-6 py-14 text-white lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">

        {/* Logo & Description */}
        <div>
          <Image
            src={logo}
            alt="PSC Global"
            width={130}
            height={130}
            className="h-auto w-24"
          />

          <p className="mt-4 text-sm leading-6 text-slate-400">
            Architectural excellence in strategic advisory, cross-border
            compliance, tax policy, and legal governance.
          </p>
        </div>

        {/* Footer Links */}
        {footerLinks.map((col) => (
          <div key={col.title}>
            <b className="text-[10px] tracking-widest text-slate-300">
              {col.title}
            </b>

            {col.items.map((x) => (
              <Link
                key={x.name}
                href={x.href}
                className="mt-3 block text-sm text-slate-400 transition-colors hover:text-white"
              >
                {x.name}
              </Link>
            ))}
          </div>
        ))}

        {/* Newsletter */}
        <div>
          <b className="text-[10px] tracking-widest text-slate-300">
            GLOBAL NEWSLETTER
          </b>

          <p className="mb-4 mt-3 text-sm text-slate-400">
            Receive our quarterly global regulatory report.
          </p>

          <PublicNewsletterForm />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-slate-700/80 pt-5 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {new Date().getFullYear()} PSC Global Firm. All rights reserved.
        </span>

        <div className="flex gap-5">
          {legalLinks.map((x) => (
            <a
              key={x.name}
              href={x.href}
              className="transition-colors hover:text-white"
            >
              {x.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}