import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import {
  portalClients,
  portalEngagements,
  portalTasks,
  portalComplianceItems,
  portalInvoices,
  portalPayments,
  portalDocuments,
  portalReports,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  FileText,
  Receipt,
  Wallet,
  ShieldAlert,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Plus,
} from 'lucide-react';
import {
  createEngagementAction,
  createTaskAction,
  createComplianceItemAction,
  createInvoiceAction,
  recordPaymentAction,
  uploadDocumentAdminAction,
  updateClientStatusAction,
} from '@/app/actions/portalAdminActions';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: PageProps) {
  const { id } = await params;
  const clientId = Number(id);
  if (isNaN(clientId)) notFound();

  const [client] = await db
    .select()
    .from(portalClients)
    .where(eq(portalClients.id, clientId))
    .limit(1);

  if (!client) notFound();

  const engagements = await db
    .select()
    .from(portalEngagements)
    .where(eq(portalEngagements.clientId, clientId));

  const tasks = await db
    .select()
    .from(portalTasks)
    .where(eq(portalTasks.clientId, clientId));

  const complianceItems = await db
    .select()
    .from(portalComplianceItems)
    .where(eq(portalComplianceItems.clientId, clientId));

  const invoices = await db
    .select()
    .from(portalInvoices)
    .where(eq(portalInvoices.clientId, clientId));

  const payments = await db
    .select()
    .from(portalPayments)
    .where(eq(portalPayments.clientId, clientId));

  const documents = await db
    .select()
    .from(portalDocuments)
    .where(eq(portalDocuments.clientId, clientId));

  return (
    <div className="space-y-8">
      <Link
        href="/client-portal/admin/clients"
        className="flex items-center gap-2 text-xs font-bold tracking-wide text-slate-500 hover:text-ink"
      >
        <ArrowLeft size={14} /> BACK TO CLIENT ACCOUNTS
      </Link>

      {/* Header Profile Box */}
      <div className="border border-slate-200 bg-white p-8">
        <div className="flex flex-wrap items-start justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center bg-navy font-serif text-xl font-bold text-white">
              {client.companyName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-3xl text-ink">{client.companyName}</h1>
                <span
                  className={`px-3 py-0.5 text-[10px] font-bold ${
                    client.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {client.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Created {new Date(client.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <form
            action={async () => {
              'use server';
              await updateClientStatusAction(
                client.id,
                client.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
              );
            }}
          >
            <button
              type="submit"
              className="border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold tracking-wide text-slate-700 hover:bg-slate-100"
            >
              TOGGLE STATUS ({client.status === 'ACTIVE' ? 'DEACTIVATE' : 'ACTIVATE'})
            </button>
          </form>
        </div>

        {/* Contact Info Cards */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <User size={16} className="text-slate-400" />
            <div>
              <p className="font-bold text-slate-500">PRIMARY CONTACT</p>
              <p className="font-semibold text-ink">{client.contactName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-slate-400" />
            <div>
              <p className="font-bold text-slate-500">EMAIL LOGIN</p>
              <p className="font-mono text-ink">{client.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={16} className="text-slate-400" />
            <div>
              <p className="font-bold text-slate-500">PHONE</p>
              <p className="text-ink">{client.phone || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-slate-400" />
            <div>
              <p className="font-bold text-slate-500">ADDRESS</p>
              <p className="text-ink">{client.address || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Engagements Section */}
      <div className="border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="font-serif text-2xl text-ink">Active Engagements ({engagements.length})</h2>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {engagements.map((e) => (
            <div key={e.id} className="border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-ink">{e.title}</p>
                <span className="bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                  {e.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{e.serviceCategory || 'Advisory'}</p>
              {e.description && <p className="mt-2 text-xs text-slate-600">{e.description}</p>}
            </div>
          ))}
        </div>

        {/* Add Engagement Form */}
        <form action={createEngagementAction} className="mt-6 border-t border-slate-100 pt-6">
          <input type="hidden" name="clientId" value={client.id} />
          <p className="text-xs font-bold tracking-wider text-slate-500">ADD NEW ENGAGEMENT</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              type="text"
              name="title"
              required
              placeholder="Engagement Title (e.g. Q4 Tax Audit)"
              className="flex-1 min-w-[200px] border border-slate-200 px-3 py-2 text-xs text-ink outline-none"
            />
            <input
              type="text"
              name="serviceCategory"
              placeholder="Category (e.g. Compliance)"
              className="border border-slate-200 px-3 py-2 text-xs text-ink outline-none"
            />
            <button
              type="submit"
              className="bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
            >
              CREATE ENGAGEMENT
            </button>
          </div>
        </form>
      </div>

      {/* 2. Tasks Section */}
      <div className="border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="font-serif text-2xl text-ink">Assigned Tasks ({tasks.length})</h2>
        </div>

        <table className="mt-4 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500">
              <th className="px-4 py-3">TASK NAME</th>
              <th className="px-4 py-3">DUE DATE</th>
              <th className="px-4 py-3">PRIORITY</th>
              <th className="px-4 py-3">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id} className="border-b border-slate-100">
                <td className="px-4 py-3 font-medium text-ink">{t.name}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{t.dueDate || 'No Date'}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{t.priority}</td>
                <td className="px-4 py-3">
                  <span className="bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Task Form */}
        <form action={createTaskAction} className="mt-6 border-t border-slate-100 pt-6">
          <input type="hidden" name="clientId" value={client.id} />
          <p className="text-xs font-bold tracking-wider text-slate-500">ASSIGN NEW TASK</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              type="text"
              name="name"
              required
              placeholder="Task Name (e.g. Submit Q3 Financial Statements)"
              className="flex-1 min-w-[200px] border border-slate-200 px-3 py-2 text-xs text-ink outline-none"
            />
            <input
              type="date"
              name="dueDate"
              className="border border-slate-200 px-3 py-2 text-xs text-ink outline-none"
            />
            <button
              type="submit"
              className="bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
            >
              ASSIGN TASK
            </button>
          </div>
        </form>
      </div>

      {/* 3. Invoices Section */}
      <div className="border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="font-serif text-2xl text-ink">Invoices ({invoices.length})</h2>
        </div>

        <table className="mt-4 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500">
              <th className="px-4 py-3">INVOICE #</th>
              <th className="px-4 py-3">AMOUNT</th>
              <th className="px-4 py-3">DUE DATE</th>
              <th className="px-4 py-3">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-slate-100">
                <td className="px-4 py-3 font-semibold text-ink">{inv.invoiceNumber}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{inv.amount}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{inv.dueDate || 'N/A'}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold ${
                      inv.status === 'PAID'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Invoice Form */}
        <form action={createInvoiceAction} className="mt-6 border-t border-slate-100 pt-6">
          <input type="hidden" name="clientId" value={client.id} />
          <p className="text-xs font-bold tracking-wider text-slate-500">ISSUE NEW INVOICE</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              type="text"
              name="invoiceNumber"
              required
              placeholder="INV-2023-101"
              className="border border-slate-200 px-3 py-2 text-xs text-ink outline-none"
            />
            <input
              type="text"
              name="amount"
              required
              placeholder="$5,000.00"
              className="border border-slate-200 px-3 py-2 text-xs text-ink outline-none"
            />
            <input
              type="date"
              name="dueDate"
              className="border border-slate-200 px-3 py-2 text-xs text-ink outline-none"
            />
            <button
              type="submit"
              className="bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
            >
              ISSUE INVOICE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
