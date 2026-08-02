export default function Insights() {
  return (
    <section id="insights" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 className="font-serif text-2xl">Featured Insights & Reports</h2>
        <a className="text-xs font-semibold" href="#top">
          Browse All Insights →
        </a>
      </div>
      <div className="mt-7 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <article>
          <img
            className="h-64 w-full object-cover"
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=85"
            alt="Analytics desk"
          />
          <small className="mt-5 block text-[10px] tracking-widest text-slate-500">ECONOMIC STRATEGY · MAY 2025</small>
          <h3 className="mt-3 font-serif text-3xl leading-tight">
            The Future of Cross-Border Regulatory Compliance in Emerging Markets
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            We explore policy landscapes in rapidly shifting economies.
          </p>
        </article>
        <div className="space-y-6">
          <article className="border-b border-slate-200 pb-5">
            <small className="text-[10px] tracking-widest text-slate-500">NEW · APR 08, 2025</small>
            <h3 className="mt-3 font-serif text-xl">New IFRS 20 Filing: Strategic Implications for Corporate Tax</h3>
          </article>
          <article className="border-b border-slate-200 pb-5">
            <small className="text-[10px] tracking-widest text-slate-500">INSIGHTS · APR 2025</small>
            <h3 className="mt-3 font-serif text-xl">Digital Asset Regulation: A Guide for FinTech Leaders</h3>
          </article>
          <blockquote className="bg-slate-100 p-6 text-sm leading-6">
            &ldquo;The quality of PSC&rsquo;s insight reports consistently provided our board with the clarity needed for major M&amp;A decisions.&rdquo;
          </blockquote>
        </div>
      </div>
    </section>
  );
}