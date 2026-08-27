export default function PortalAssistanceCTA({ title = 'Need Assistance?', copy }: { title?: string; copy?: string }) {
  return (
    <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border border-slate-200 bg-white px-8 py-8">
      <div className="max-w-sm">
        <h3 className="font-serif text-3xl text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
      </div>
      <div className="flex gap-3">
        <a href="#" className="border border-ink px-5 py-3 text-xs font-bold tracking-wide text-ink">
          RAISE SUPPORT TICKET
        </a>
        <a href="#" className="bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white">
          BOOK A MEETING
        </a>
      </div>
    </div>
  );
}
