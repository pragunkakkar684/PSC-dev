const footerLinks = [
  ['PRACTICE', ['Strategy', 'Analytics', 'Digital', 'M&A']],
  ['COMPANY', ['About', 'Careers', 'Insights', 'Offices']],
];

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
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-slate-700 pt-5 text-[10px] text-slate-500">
        © 2025 Advisory Global. All rights reserved
      </div>
    </footer>
  );
}