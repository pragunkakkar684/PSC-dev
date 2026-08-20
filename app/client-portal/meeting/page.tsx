'use client';

import { useState } from 'react';
import { ChevronDown, Phone, Users, Video } from 'lucide-react';

const formats = [
  ['Video Meeting', Video],
  ['Phone Call', Phone],
  ['In Person', Users],
];

export default function ClientPortalBookMeetingPage() {
  const [format, setFormat] = useState('Video Meeting');
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  return (
    <>
      <h1 className="font-serif text-5xl tracking-tight text-ink">Book a Meeting</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        Schedule time with your PSC Global team to discuss an engagement, advisory requirement
        or any other matter.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <h2 className="border-b border-slate-200 pb-4 font-serif text-3xl text-ink">Schedule a Meeting</h2>

          <div className="mt-8 space-y-8">
            <label className="block">
              <span className="text-[10px] font-bold tracking-wide text-slate-500">MEETING TOPIC</span>
              <input
                className="mt-2 w-full border border-slate-200 px-4 py-3 text-sm outline-none"
                placeholder="What would you like to discuss?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </label>

            <label className="block max-w-md">
              <span className="text-[10px] font-bold tracking-wide text-slate-500">RELATED ENGAGEMENT</span>
              <select className="mt-2 w-full border border-slate-200 px-4 py-3 text-sm text-slate-500 outline-none">
                <option>Select an engagement</option>
              </select>
            </label>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="text-[10px] font-bold tracking-wide text-slate-500">PREFERRED DATE</span>
                <input
                  className="mt-2 w-full border border-slate-200 px-4 py-3 text-sm outline-none"
                  placeholder="MM/DD/YYYY"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-bold tracking-wide text-slate-500">PREFERRED TIME</span>
                <input
                  className="mt-2 w-full border border-slate-200 px-4 py-3 text-sm outline-none"
                  placeholder="--:-- --"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </label>
            </div>

            <div>
              <span className="text-[10px] font-bold tracking-wide text-slate-500">MEETING FORMAT</span>
              <div className="mt-2 grid grid-cols-3 gap-4">
                {formats.map(([label, Icon]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setFormat(label as string)}
                    className={`flex flex-col items-center gap-3 border px-4 py-8 text-sm font-semibold ${
                      format === label ? 'border-ink bg-slate-50' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <Icon size={22} strokeWidth={1.5} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="text-[10px] font-bold tracking-wide text-slate-500">ADDITIONAL NOTES</span>
              <textarea
                className="mt-2 h-28 w-full border border-slate-200 px-4 py-3 text-sm outline-none"
                placeholder="Add any context or questions..."
              />
            </label>

            <div className="flex items-center gap-5 border-t border-slate-200 pt-8">
              <button type="button" className="bg-ink px-6 py-4 text-xs font-bold tracking-wide text-white">
                REQUEST MEETING
              </button>
              <p className="max-w-xs text-xs leading-5 text-slate-500">
                Your PSC Global team will confirm the meeting details.
              </p>
            </div>
          </div>
        </div>

        <aside className="h-fit border border-slate-200 bg-[#fdf9f8] p-6">
          <h3 className="font-serif text-2xl text-ink">Your PSC Global Team</h3>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Connect directly with your dedicated team members. We aim to respond to all meeting
            requests within 24 business hours to confirm availability.
          </p>

          <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
            <div>
              <p className="text-[10px] font-bold tracking-wide text-slate-400">PRIMARY CONTACT</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center bg-navy text-xs font-bold text-white">
                  PS
                </div>
                <div>
                  <p className="font-serif text-lg text-ink">Priya Sharma</p>
                  <p className="text-xs text-slate-500">Tax &amp; Advisory Director</p>
                </div>
              </div>
            </div>
            <ChevronDown size={16} className="shrink-0 text-slate-400" />
          </div>

          <div className="mt-6 space-y-5 border-t border-slate-200 pt-5">
            <p className="text-[10px] font-bold tracking-wide text-slate-400">MEETING FORMATS</p>
            <div className="flex gap-3">
              <Video size={16} className="mt-0.5 shrink-0 text-slate-500" />
              <div>
                <p className="text-sm font-semibold text-ink">Video Conferences</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Links provided via Microsoft Teams upon confirmation.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Users size={16} className="mt-0.5 shrink-0 text-slate-500" />
              <div>
                <p className="text-sm font-semibold text-ink">In-Person Meetings</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Hosted at our London Headquarters unless specified otherwise.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 border border-slate-200 bg-white p-5">
            <p className="text-[10px] font-bold tracking-wide text-slate-400">REQUEST SUMMARY</p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Topic:</span>
                <span className="text-ink">{topic || '--'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span className="text-ink">{date || '--'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time:</span>
                <span className="text-ink">{time || '--'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Format:</span>
                <span className="text-ink">{format || '--'}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}