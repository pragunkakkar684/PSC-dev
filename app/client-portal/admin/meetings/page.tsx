import { db } from '@/lib/db';
import { portalMeetings, portalClients } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { updateMeetingStatusAction } from '@/app/actions/portalAdminActions';

export default async function AdminMeetingsPage() {
  const meetings = await db
    .select({
      id: portalMeetings.id,
      title: portalMeetings.title,
      requestedDate: portalMeetings.requestedDate,
      timeSlot: portalMeetings.timeSlot,
      notes: portalMeetings.notes,
      status: portalMeetings.status,
      meetingUrl: portalMeetings.meetingUrl,
      companyName: portalClients.companyName,
    })
    .from(portalMeetings)
    .innerJoin(portalClients, eq(portalMeetings.clientId, portalClients.id))
    .orderBy(portalMeetings.createdAt);

  return (
    <>
      <h1 className="font-serif text-4xl tracking-tight text-ink">Meeting Requests</h1>
      <p className="mt-2 text-sm text-slate-600">
        Client consultation requests and meeting schedules.
      </p>

      <div className="mt-8 border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500">
              <th className="px-6 py-4">CLIENT COMPANY</th>
              <th className="px-6 py-4">MEETING TOPIC</th>
              <th className="px-6 py-4">REQUESTED DATE</th>
              <th className="px-6 py-4">TIME SLOT</th>
              <th className="px-6 py-4">STATUS</th>
              <th className="px-6 py-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {meetings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-500">
                  No meeting requests received yet.
                </td>
              </tr>
            ) : (
              meetings.map((m) => (
                <tr key={m.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-6 py-5 font-semibold text-ink">{m.companyName}</td>
                  <td className="px-6 py-5 font-medium text-slate-800">{m.title}</td>
                  <td className="px-6 py-5 text-slate-600">{m.requestedDate || 'N/A'}</td>
                  <td className="px-6 py-5 text-slate-600">{m.timeSlot || 'N/A'}</td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 text-[10px] font-bold ${
                        m.status === 'CONFIRMED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : m.status === 'CANCELLED'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {m.status === 'REQUESTED' && (
                      <form
                        action={async () => {
                          'use server';
                          await updateMeetingStatusAction(m.id, 'CONFIRMED');
                        }}
                        className="inline-block"
                      >
                        <button
                          type="submit"
                          className="border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-ink hover:border-ink"
                        >
                          CONFIRM
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
