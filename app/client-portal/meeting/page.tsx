import { db } from '@/lib/db';
import { portalMeetings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getPortalContext } from '@/lib/auth/portalAuth';
import { Calendar, CalendarPlus, Clock, Video } from 'lucide-react';
import { clientBookMeetingAction } from '@/app/actions/clientPortalActions';

export default async function ClientBookMeetingPage() {
  const portalCtx = await getPortalContext();
  const clientId = portalCtx?.clientId;

  const meetings = clientId
    ? await db
        .select()
        .from(portalMeetings)
        .where(eq(portalMeetings.clientId, clientId))
        .orderBy(portalMeetings.createdAt)
    : [];

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h1 className="font-serif text-5xl tracking-tight text-ink">Book Consultation</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
          Schedule a direct meeting with your dedicated PSC Global partner or advisory team.
        </p>
      </div>

      {/* Meeting Request Form */}
      <div className="border border-slate-200 bg-white p-8">
        <h2 className="font-serif text-2xl text-ink">Request a New Meeting</h2>
        <form action={clientBookMeetingAction} className="mt-6 space-y-6">
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-slate-600">
              MEETING TOPIC / REASON *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Q3 Financial Audit Review & Tax Advisory"
              className="mt-2 w-full border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-ink outline-none focus:border-ink focus:bg-white"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-600">
                PREFERRED DATE *
              </label>
              <input
                type="date"
                name="requestedDate"
                required
                className="mt-2 w-full border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-ink outline-none focus:border-ink focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-600">
                TIME SLOT *
              </label>
              <select
                name="timeSlot"
                required
                className="mt-2 w-full border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-ink outline-none focus:border-ink focus:bg-white"
              >
                <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-wider text-slate-600">
              AGENDA & NOTES
            </label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Provide context or documents for discussion..."
              className="mt-2 w-full border border-slate-200 bg-slate-50/50 p-4 text-sm text-ink outline-none focus:border-ink focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-navy px-8 py-3 text-xs font-bold tracking-wider text-white transition hover:bg-slate-800"
          >
            <CalendarPlus size={16} /> REQUEST MEETING
          </button>
        </form>
      </div>

      {/* Meeting History */}
      <div>
        <h2 className="font-serif text-2xl text-ink">Requested & Scheduled Meetings</h2>
        <div className="mt-4 border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wide text-slate-500">
                <th className="px-6 py-4">TOPIC</th>
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4">TIME SLOT</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-right">LINK</th>
              </tr>
            </thead>
            <tbody>
              {meetings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-500">
                    No meeting requests recorded.
                  </td>
                </tr>
              ) : (
                meetings.map((m) => (
                  <tr key={m.id} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-6 py-5 font-semibold text-ink">{m.title}</td>
                    <td className="px-6 py-5 text-slate-600">{m.requestedDate || 'N/A'}</td>
                    <td className="px-6 py-5 text-slate-600 text-xs">{m.timeSlot || 'N/A'}</td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-block px-3 py-1 text-[10px] font-bold ${
                          m.status === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {m.meetingUrl ? (
                        <a
                          href={m.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-ink hover:underline"
                        >
                          <Video size={13} /> JOIN
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">Pending</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}