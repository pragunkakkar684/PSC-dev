import { db } from '@/lib/db';
import { portalTasks, portalClients } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function AdminTasksPage() {
  const tasks = await db
    .select({
      id: portalTasks.id,
      name: portalTasks.name,
      dueDate: portalTasks.dueDate,
      status: portalTasks.status,
      priority: portalTasks.priority,
      companyName: portalClients.companyName,
    })
    .from(portalTasks)
    .innerJoin(portalClients, eq(portalTasks.clientId, portalClients.id))
    .orderBy(portalTasks.createdAt);

  return (
    <>
      <h1 className="font-serif text-4xl tracking-tight text-ink">Client Tasks</h1>
      <p className="mt-2 text-sm text-slate-600">
        Task tracking and operational items assigned to client accounts.
      </p>

      <div className="mt-8 border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500">
              <th className="px-6 py-4">CLIENT COMPANY</th>
              <th className="px-6 py-4">TASK NAME</th>
              <th className="px-6 py-4">DUE DATE</th>
              <th className="px-6 py-4">PRIORITY</th>
              <th className="px-6 py-4">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-500">
                  No tasks assigned yet.
                </td>
              </tr>
            ) : (
              tasks.map((t) => (
                <tr key={t.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-6 py-5 font-semibold text-ink">{t.companyName}</td>
                  <td className="px-6 py-5 font-medium text-slate-800">{t.name}</td>
                  <td className="px-6 py-5 text-slate-600">{t.dueDate || 'No date'}</td>
                  <td className="px-6 py-5 text-xs text-slate-600">{t.priority}</td>
                  <td className="px-6 py-5">
                    <span className="bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600">
                      {t.status}
                    </span>
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
