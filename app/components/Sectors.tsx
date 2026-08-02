const sectors = [
  ['Logistics & Manufacturing', 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=700&q=70'],
  ['Financial Services', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=70'],
  ['Technology & Media', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=70'],
  ['Healthcare & Pharma', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=700&q=70'],
];

export default function Sectors() {
  return (
    <section id="sectors" className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-6 py-18 lg:px-10">
        <p className="font-mono text-[10px] tracking-[.18em] text-sky-200">OUR EXPERTISE</p>
        <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <h2 className="font-serif text-4xl">Sectors We Serve</h2>
          <p className="max-w-sm text-sm leading-6 text-slate-300">
            Specialized expertise tailored for industries that define the global economy.
          </p>
        </div>
        <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {sectors.map(([title, image]) => (
            <article
              className="flex h-52 items-end bg-cover bg-center p-5 transition hover:-translate-y-1 hover:brightness-110"
              style={{ backgroundImage: `linear-gradient(0deg,rgba(0,18,38,.95),rgba(0,18,38,.08)),url(${image})` }}
              key={title}
            >
              <span className="font-serif text-xl">{title}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}