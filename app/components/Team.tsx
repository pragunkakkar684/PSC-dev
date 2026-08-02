const leaders = [
  ['https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=85', 'Dr. Julian Vance', 'FOUNDER & CEO'],
  ['https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=85', 'Helena Thorne', 'PARTNER, TRANSFORMATION'],
  ['https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=85', 'Marcus Oh', 'PRINCIPAL, ECONOMICS'],
];

export default function Team() {
  return (
    <section id="team" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <p className="font-mono text-[10px] tracking-[.18em] text-slate-500">EXECUTIVE LEADERSHIP</p>
      <h2 className="mt-4 max-w-xl font-serif text-4xl">The Leadership Behind the Architecture.</h2>
      <div className="mt-10 grid gap-7 md:grid-cols-3">
        {leaders.map(([image, name, role]) => (
          <article className="group" key={name}>
            <img
              className="h-80 w-full object-cover grayscale transition duration-300 group-hover:grayscale-0"
              src={image}
              alt={name}
            />
            <h3 className="mt-5 font-serif text-xl">{name}</h3>
            <small className="text-[10px] tracking-widest text-slate-500">{role}</small>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Our leaders build the world&apos;s most enduring institutions.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}