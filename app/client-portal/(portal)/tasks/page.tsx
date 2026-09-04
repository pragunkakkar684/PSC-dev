import { db } from '@/lib/db';
import { portalTasks, portalEngagements } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getPortalContext } from '@/lib/auth/portalAuth';
import { clientToggleTaskStatusAction, clientCreateTaskAction } from '@/app/actions/clientPortalActions';
import { CheckCircle2, Plus, Calendar, Clock } from 'lucide-react';

export default async function ClientTasksPage() {
  const portalCtx = await getPortalContext();
  const clientId = portalCtx?.clientId;

  const activeEngagements = clientId
    ? await db
        .select()
        .from(portalEngagements)
        .where(and(eq(portalEngagements.clientId, clientId), eq(portalEngagements.status, 'ACTIVE')))
    : [];

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
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-5xl tracking-tight text-ink">Tasks</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
          Create operational tasks, track deliverables, and mark completed tasks upon closure.
        </p>
      </div>

      {/* Create Task Form */}
      <div className="border border-slate-200 bg-white p-8">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center bg-navy text-white">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h2 className="font-serif text-2xl text-ink">Create New Task</h2>
            <p className="text-xs text-slate-500">
              Add a new deliverable or action item to your active advisory engagements.
            </p>
          </div>
        </div>

        <form action={clientCreateTaskAction} className="mt-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-600">
                TASK NAME *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Upload Subsidiary Board Minutes Q3"
                className="mt-2 w-full border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-ink outline-none focus:border-ink focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-600">
                LINK TO ENGAGEMENT
              </label>
              <select
                name="engagementId"
                className="mt-2 w-full border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-ink outline-none focus:border-ink focus:bg-white"
              >
                <option value="">General (No specific engagement)</option>
                {activeEngagements.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-600">
                DUE DATE
              </label>
              <input
                type="date"
                name="dueDate"
                className="mt-2 w-full border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-ink outline-none focus:border-ink focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-600">
                PRIORITY
              </label>
              <select
                name="priority"
                className="mt-2 w-full border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-ink outline-none focus:border-ink focus:bg-white"
              >
                <option value="NORMAL">Normal Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent Priority</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-navy px-8 py-3 text-xs font-bold tracking-wider text-white transition hover:bg-slate-800"
          >
            <Plus size={16} /> ADD TASK
          </button>
        </form>
      </div>

      {/* Task List */}
      <div className="border border-slate-200 bg-white">
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
                  No tasks assigned to your organization. Use the form above to add a task.
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
                        className={`px-3 py-1.5 text-xs font-bold transition border ${
                          t.status === 'COMPLETED'
                            ? 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                            : 'border-emerald-600 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        }`}
                      >
                        {t.status === 'COMPLETED' ? 'REOPEN TASK' : '✓ CLOSE & MARK COMPLETED'}
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
