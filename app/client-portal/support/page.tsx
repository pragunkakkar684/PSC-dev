import { db } from '@/lib/db';
import { portalSupportTickets, portalTicketReplies, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getPortalContext } from '@/lib/auth/portalAuth';
import { LifeBuoy, Send } from 'lucide-react';
import {
  clientRaiseSupportTicketAction,
  clientReplySupportTicketAction,
} from '@/app/actions/clientPortalActions';

export default async function ClientSupportPage() {
  const portalCtx = await getPortalContext();
  const clientId = portalCtx?.clientId;

  const tickets = clientId
    ? await db
        .select()
        .from(portalSupportTickets)
        .where(eq(portalSupportTickets.clientId, clientId))
        .orderBy(portalSupportTickets.createdAt)
    : [];

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h1 className="font-serif text-5xl tracking-tight text-ink">Support & Assistance</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
          Raise technical inquiries, advisory support requests, or audit communications.
        </p>
      </div>

      {/* Raise Ticket Form */}
      <div className="border border-slate-200 bg-white p-8">
        <h2 className="font-serif text-2xl text-ink">Raise Support Ticket</h2>
        <form action={clientRaiseSupportTicketAction} className="mt-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-600">
                SUBJECT *
              </label>
              <input
                type="text"
                name="subject"
                required
                placeholder="Inquiry Subject"
                className="mt-2 w-full border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-ink outline-none focus:border-ink focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-600">
                CATEGORY
              </label>
              <select
                name="category"
                className="mt-2 w-full border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-ink outline-none focus:border-ink focus:bg-white"
              >
                <option value="Tax & Advisory">Tax & Advisory</option>
                <option value="Audit & Compliance">Audit & Compliance</option>
                <option value="Invoicing & Payments">Invoicing & Payments</option>
                <option value="Portal Support">Portal Technical Support</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-wider text-slate-600">
              DESCRIPTION / DETAILS *
            </label>
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Describe your request or question in detail..."
              className="mt-2 w-full border border-slate-200 bg-slate-50/50 p-4 text-sm text-ink outline-none focus:border-ink focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-navy px-8 py-3 text-xs font-bold tracking-wider text-white transition hover:bg-slate-800"
          >
            <LifeBuoy size={16} /> SUBMIT TICKET
          </button>
        </form>
      </div>

      {/* Tickets History & Threads */}
      <div className="space-y-6">
        <h2 className="font-serif text-2xl text-ink">My Support Tickets</h2>

        {tickets.length === 0 ? (
          <div className="border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
            No support tickets raised yet.
          </div>
        ) : (
          tickets.map(async (t) => {
            const replies = await db
              .select({
                id: portalTicketReplies.id,
                message: portalTicketReplies.message,
                senderType: portalTicketReplies.senderType,
                createdAt: portalTicketReplies.createdAt,
                senderName: users.name,
              })
              .from(portalTicketReplies)
              .leftJoin(users, eq(portalTicketReplies.senderId, users.id))
              .where(eq(portalTicketReplies.ticketId, t.id))
              .orderBy(portalTicketReplies.createdAt);

            return (
              <div key={t.id} className="border border-slate-200 bg-white p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-500">{t.ticketNumber}</span>
                    <h3 className="font-serif text-xl text-ink">{t.subject}</h3>
                  </div>
                  <span
                    className={`px-3 py-1 text-[10px] font-bold ${
                      t.status === 'OPEN' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                {/* Conversation Thread */}
                <div className="mt-4 space-y-3">
                  {replies.map((r) => (
                    <div
                      key={r.id}
                      className={`p-4 text-xs ${
                        r.senderType === 'CLIENT'
                          ? 'border-l-2 border-slate-300 bg-slate-50 text-slate-700'
                          : 'border-l-2 border-navy bg-white text-ink'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-slate-500">
                        <span>
                          {r.senderType === 'CLIENT' ? 'YOU' : 'PSC GLOBAL SUPPORT'}
                        </span>
                        <span className="text-[10px] font-normal">
                          {new Date(r.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-2 leading-relaxed">{r.message}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <form action={clientReplySupportTicketAction} className="mt-4 flex items-center gap-3">
                  <input type="hidden" name="ticketId" value={t.id} />
                  <input
                    type="text"
                    name="message"
                    required
                    placeholder="Type a reply to PSC Global support team..."
                    className="flex-1 border border-slate-200 px-4 py-2.5 text-xs text-ink outline-none focus:border-ink"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 bg-navy px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
                  >
                    <Send size={13} /> SEND
                  </button>
                </form>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}