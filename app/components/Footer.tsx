'use client';

const footerLinks = [
  ['PRACTICE', ['Strategy', 'Analytics', 'Digital', 'M&A']],
  ['COMPANY', ['About', 'Careers', 'Insights', 'Offices']],
];

const legalLinks = ['Privacy Policy', 'Terms of Service', 'Cookie Policy'];

export default function Footer() {
  return (
    <footer className="bg-[#07110f] px-6 py-14 text-white lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div>
          <h2 className="font-serif text-3xl">PSC Global</h2>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Architectural excellence in consulting, redefining strategy for business.
          </p>
        </div>
        {footerLinks.map(([title, items]) => (
          <div key={title as string}>
            <b className="text-[10px] tracking-widest">{title as string}</b>
            {(items as string[]).map((x) => (
              <a className="mt-3 block text-sm text-slate-400 hover:text-white" href="#top" key={x}>
                {x}
              </a>
            ))}
          </div>
        ))}
        <div>
          <b className="text-[10px] tracking-widest">NEWSLETTER</b>
          <p className="mt-3 text-sm text-slate-400">Receive our quarterly global report.</p>
          <form className="mt-4 flex" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email address"
              className="w-full border border-slate-700 bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 bg-white px-4 py-2 text-xs font-semibold text-ink transition hover:bg-slate-200"
            >
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-slate-700 pt-5 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Advisory Global Firm. All rights reserved</span>
        <div className="flex gap-5">
          {legalLinks.map((x) => (
            <a key={x} href="#top" className="hover:text-white">
              {x}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}