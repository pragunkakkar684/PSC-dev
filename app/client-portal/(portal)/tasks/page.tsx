import { db } from '@/lib/db';
import { portalTasks, portalEngagements } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getPortalContext } from '@/lib/auth/portalAuth';
import { clientToggleTaskStatusAction } from '@/app/actions/clientPortalActions';

export default async function ClientTasksPage() {
  const portalCtx = await getPortalContext();
  const clientId = portalCtx?.clientId;

  const tasks = clientId
    ? await db
        .select({
          id: portalTasks.id,
          name: portalTasks.name,
          dueDate: portalTasks.dueDate,
          status: portalTasks.status,
          priority: portalTasks.priority,
          engagementTitle: portalEngagements.title,
        })
        .from(portalTasks)
        .leftJoin(portalEngagements, eq(portalTasks.engagementId, portalEngagements.id))
        .where(eq(portalTasks.clientId, clientId))
        .orderBy(portalTasks.dueDate)
    : [];

  return (
    <>
      <h1 className="font-serif text-5xl tracking-tight text-ink">Tasks</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        Review upcoming tasks and mark deliverables completed.
      </p>

      <div className="mt-10 border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wide text-slate-500">
              <th className="px-6 py-4">TASK NAME</th>
              <th className="px-6 py-4">ENGAGEMENT</th>
              <th className="px-6 py-4">DUE DATE</th>
              <th className="px-6 py-4">STATUS</th>
              <th className="px-6 py-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-500">
                  No tasks assigned to your organization.
                </td>
              </tr>
            ) : (
              tasks.map((t) => (
                <tr key={t.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-6 py-5 font-semibold text-ink">{t.name}</td>
                  <td className="px-6 py-5 text-slate-600">{t.engagementTitle || 'General'}</td>
                  <td className="px-6 py-5 text-slate-600">{t.dueDate || 'No due date'}</td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-block px-3 py-1 text-[10px] font-bold ${
                        t.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <form
                      action={async () => {
                        'use server';
                        await clientToggleTaskStatusAction(
                          t.id,
                          t.status === 'COMPLETED' ? 'UPCOMING' : 'COMPLETED'
                        );
                      }}
                    >
                      <button
                        type="submit"
                        className="border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-ink hover:border-ink"
                      >
                        {t.status === 'COMPLETED' ? 'MARK INCOMPLETE' : 'MARK COMPLETED'}
                      </button>
                    </form>
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
