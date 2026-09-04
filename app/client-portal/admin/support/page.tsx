import { db } from '@/lib/db';
import { portalSupportTickets, portalClients, portalTicketReplies, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { LifeBuoy, Send, MessageSquare } from 'lucide-react';
import { adminReplyTicketAction } from '@/app/actions/portalAdminActions';

export default async function AdminSupportInboxPage() {
  const tickets = await db
    .select({
      id: portalSupportTickets.id,
      ticketNumber: portalSupportTickets.ticketNumber,
      subject: portalSupportTickets.subject,
      category: portalSupportTickets.category,
      priority: portalSupportTickets.priority,
      status: portalSupportTickets.status,
      createdAt: portalSupportTickets.createdAt,
      companyName: portalClients.companyName,
    })
    .from(portalSupportTickets)
    .innerJoin(portalClients, eq(portalSupportTickets.clientId, portalClients.id))
    .orderBy(portalSupportTickets.createdAt);

  return (
    <>
      <h1 className="font-serif text-4xl tracking-tight text-ink">Support Inbox</h1>
      <p className="mt-2 text-sm text-slate-600">
        Review client tickets, issue replies, and resolve inquiries.
      </p>

      <div className="mt-8 space-y-6">
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
                    <h2 className="font-serif text-xl text-ink">{t.subject}</h2>
                    <span className="text-xs text-slate-500">({t.companyName})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                      {t.priority}
                    </span>
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold ${
                        t.status === 'OPEN' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>

                {/* Conversation Replies */}
                <div className="mt-4 space-y-3">
                  {replies.map((r) => (
                    <div
                      key={r.id}
                      className={`p-4 text-xs ${
                        r.senderType === 'PORTAL_ADMIN'
                          ? 'border-l-2 border-navy bg-slate-50 text-ink'
                          : 'border-l-2 border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-slate-500">
                        <span>
                          {r.senderType === 'PORTAL_ADMIN' ? 'PSC GLOBAL SUPPORT' : t.companyName}
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
                <form action={adminReplyTicketAction} className="mt-4 flex items-center gap-3">
                  <input type="hidden" name="ticketId" value={t.id} />
                  <input
                    type="text"
                    name="message"
                    required
                    placeholder="Type your response to client..."
                    className="flex-1 border border-slate-200 px-4 py-2.5 text-xs text-ink outline-none focus:border-ink"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 bg-navy px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
                  >
                    <Send size={13} /> REPLY
                  </button>
                </form>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
