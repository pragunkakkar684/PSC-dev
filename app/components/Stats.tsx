const stats = [
  ['22+', 'YEARS OF EXPERIENCE'],
  ['1,000+', 'GLOBAL PROFESSIONALS'],
  ['15+', 'COUNTRIES SERVED'],
  ['250+', 'EXPERTS & CONSULTANTS'],
];

export default function Stats() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-6 py-10 sm:grid-cols-4 lg:px-10">
      {stats.map(([number, label], index) => (
        <div
          className="animate-rise border-slate-200 pl-4 sm:border-r sm:pl-7 sm:last:border-0"
          style={{ animationDelay: `${index * 80}ms` }}
          key={number}
        >
          <strong className="block font-serif text-3xl">{number}</strong>
          <small className="mt-2 block text-[10px] tracking-wide text-slate-500">{label}</small>
        </div>
      ))}
    </section>
  );
}