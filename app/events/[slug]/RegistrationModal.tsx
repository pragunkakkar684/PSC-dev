'use client';

import { CheckCircle2, X } from 'lucide-react';
import { useState } from 'react';

export default function RegistrationModal({ eventTitle }: { eventTitle: string }) {
  const [open, setOpen] = useState(false);
  const [registered, setRegistered] = useState(false);

  function close() {
    setOpen(false);
    setRegistered(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRegistered(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white hover:bg-slate-800"
      >
        REGISTER FOR EVENT
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 py-8"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            className="relative max-h-full w-full max-w-xl overflow-y-auto border border-slate-200 bg-[#fdf9f8] p-6 shadow-2xl sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-title"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close registration form"
              className="absolute right-5 top-5 text-slate-500 transition hover:text-ink"
            >
              <X size={18} />
            </button>

            {registered ? (
              <div className="py-10 text-center">
                <CheckCircle2 size={34} className="mx-auto text-emerald-600" />
                <h2 id="registration-title" className="mt-5 font-serif text-3xl text-ink">Registration Complete</h2>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">
                  Thank you for registering for {eventTitle}. We will send the event details to your email shortly.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-7 border border-ink px-5 py-3 text-xs font-bold tracking-wide text-ink hover:bg-white"
                >
                  CLOSE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="font-mono text-[11px] tracking-[.18em] text-slate-500 uppercase">Event Registration</p>
                <h2 id="registration-title" className="mt-3 pr-8 font-serif text-3xl leading-tight text-ink">{eventTitle}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">Reserve your place and we will share the joining details with you.</p>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[10px] font-bold tracking-wide text-slate-500">FULL NAME *</span>
                    <input type="text" required autoComplete="name" className="mt-2 w-full border border-slate-200 bg-white px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900" placeholder="Jane Doe" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold tracking-wide text-slate-500">BUSINESS EMAIL *</span>
                    <input type="email" required autoComplete="email" className="mt-2 w-full border border-slate-200 bg-white px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900" placeholder="jane@company.com" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold tracking-wide text-slate-500">COMPANY</span>
                    <input type="text" autoComplete="organization" className="mt-2 w-full border border-slate-200 bg-white px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900" placeholder="Organization Name" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold tracking-wide text-slate-500">ATTENDANCE</span>
                    <select defaultValue="Virtual" className="mt-2 w-full border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900">
                      <option>Virtual</option>
                      <option>In person</option>
                    </select>
                  </label>
                </div>

                <button type="submit" className="mt-7 bg-ink px-6 py-3.5 text-xs font-bold tracking-wide text-white transition hover:bg-slate-800">
                  COMPLETE REGISTRATION
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
