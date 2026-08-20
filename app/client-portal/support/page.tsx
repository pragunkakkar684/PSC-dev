'use client';

import { useState } from 'react';

const categories = ['Document Request', 'Billing Question', 'Technical Issue', 'General Enquiry'];
const priorities = ['Low', 'Medium', 'High'];

const recentTickets = [
  ['Tax Compliance', 'Annual Audit', '18/08/26', 'PROCESSED'],
  ['Tax Compliance', 'Annual Audit', '18/08/26', 'PROCESSED'],
];

export default function ClientPortalSupportPage() {
  const [priority, setPriority] = useState('Medium');

  return (
    <>
      <h1 className="font-serif text-5xl tracking-tight text-ink">Raise a Support Ticket</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        Let us know what you need help with and a member of your PSC Global team will follow up.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="border-b border-slate-200 pb-4 font-serif text-3xl text-ink">Submit a Request</h2>

          <div className="mt-8 space-y-8">
            <label className="block">
              <span className="text-[10px] font-bold tracking-wide text-slate-500">SUBJECT</span>
              <input
                className="mt-2 w-full border border-slate-200 px-4 py-3 text-sm outline-none"
                placeholder="Briefly summarize your request"
              />
            </label>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="text-[10px] font-bold tracking-wide text-slate-500">RELATED ENGAGEMENT</span>
                <select className="mt-2 w-full border border-slate-200 px-4 py-3 text-sm text-slate-500 outline-none">
                  <option>Select an engagement</option>
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] font-bold tracking-wide text-slate-500">CATEGORY</span>
                <select className="mt-2 w-full border border-slate-200 px-4 py-3 text-sm text-slate-500 outline-none">
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <span className="text-[10px] font-bold tracking-wide text-slate-500">PRIORITY</span>
              <div className="mt-2 grid grid-cols-3 gap-4">
                {priorities.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`border px-4 py-3 text-sm font-semibold ${
                      priority === p ? 'border-ink bg-slate-50 text-ink' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="text-[10px] font-bold tracking-wide text-slate-500">DESCRIPTION</span>
              <textarea
                className="mt-2 h-32 w-full border border-slate-200 px-4 py-3 text-sm outline-none"
                placeholder="Describe your issue or request in detail..."
              />
            </label>

            <div className="flex items-center gap-5 border-t border-slate-200 pt-8">
              <button type="button" className="bg-ink px-6 py-4 text-xs font-bold tracking-wide text-white">
                SUBMIT TICKET
              </button>
              <p className="max-w-xs text-xs leading-5 text-slate-500">
                Our team typically responds within 1 business day.
              </p>
            </div>
          </div>
        </div>

        <aside className="h-fit border border-slate-200 bg-[#fdf9f8] p-6">
          <h3 className="font-serif text-2xl text-ink">Need Something Faster?</h3>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            For urgent matters, you can also book a direct meeting with your engagement lead or
            reach out to the knowledge centre for self-serve answers.
          </p>
          <div className="mt-6 space-y-3 border-t border-slate-200 pt-5">
            <a href="/client-portal/book-meeting" className="block border border-ink px-5 py-3 text-center text-xs font-bold tracking-wide text-ink">
              BOOK A MEETING
            </a>
            <a href="/client-portal/knowledge-centre" className="block bg-ink px-5 py-3 text-center text-xs font-bold tracking-wide text-white">
              KNOWLEDGE CENTRE
            </a>
          </div>
        </aside>
      </div>

      <h2 className="mt-16 border-b border-ink pb-3 font-serif text-3xl text-ink" style={{ display: 'inline-block' }}>
        Recent Tickets
      </h2>
      <table className="mt-4 w-full border-t border-slate-200 bg-white text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-[10px] font-bold tracking-wide text-slate-500">
            <th className="px-6 py-4">REQUEST</th>
            <th className="px-6 py-4">ENGAGEMENT</th>
            <th className="px-6 py-4">DATE</th>
            <th className="px-6 py-4">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {recentTickets.map(([request, engagement, date, status], i) => (
            <tr className="border-b border-slate-100 last:border-b-0" key={i}>
              <td className="px-6 py-6 font-semibold text-ink">{request}</td>
              <td className="px-6 py-6 text-slate-600">{engagement}</td>
              <td className="px-6 py-6 font-semibold text-ink">{date}</td>
              <td className="px-6 py-6 text-xs font-bold tracking-wide text-slate-600">{status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}