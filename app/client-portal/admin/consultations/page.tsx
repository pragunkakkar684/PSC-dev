'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  getPortalConsultations,
  updatePortalConsultationStatusAction,
  deletePortalConsultationAction,
} from './actions';
import type { ContactSubmission } from '@/lib/db/schema';
import {
  Search,
  Eye,
  Download,
  X,
  Mail,
  Phone,
  Building,
  Calendar,
  Tag,
  Trash2,
  Filter,
  CheckCircle2,
  Clock,
  Archive,
  Inbox,
  UserCheck,
} from 'lucide-react';

export default function PortalAdminConsultationsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [practiceFilter, setPracticeFilter] = useState('all');
  const [selectedSub, setSelectedSub] = useState<ContactSubmission | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getPortalConsultations({
        search,
        status: statusFilter,
        practiceArea: practiceFilter,
      });
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to load consultations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter, practiceFilter]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    startTransition(async () => {
      const updated = await updatePortalConsultationStatusAction(id, newStatus);
      if (selectedSub && selectedSub.id === id) {
        setSelectedSub(updated);
      }
      loadData();
    });
  };

  const handleDelete = async (id: number) => {
    startTransition(async () => {
      await deletePortalConsultationAction(id);
      if (selectedSub && selectedSub.id === id) {
        setSelectedSub(null);
      }
      setDeleteConfirmId(null);
      loadData();
    });
  };

  const exportCSV = () => {
    if (submissions.length === 0) return;

    const headers = ['Full Name', 'Company', 'Business Email', 'Phone', 'Practice Area', 'Submitted At', 'Status'];
    const rows = submissions.map((s) => [
      `"${(s.fullName || '').replace(/"/g, '""')}"`,
      `"${(s.company || '').replace(/"/g, '""')}"`,
      `"${(s.email || '').replace(/"/g, '""')}"`,
      `"${(s.phone || '').replace(/"/g, '""')}"`,
      `"${(s.practiceArea || '').replace(/"/g, '""')}"`,
      `"${new Date(s.createdAt).toISOString()}"`,
      `"${s.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `psc_consultations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics
  const totalCount = submissions.length;
  const newCount = submissions.filter((s) => s.status === 'new').length;
  const respondedCount = submissions.filter((s) => s.status === 'responded').length;
  const archivedCount = submissions.filter((s) => s.status === 'archived').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="inline-flex items-center gap-1 bg-sky-100 px-2.5 py-1 text-[10px] font-bold text-sky-800 rounded">NEW LEAD</span>;
      case 'read':
        return <span className="inline-flex items-center gap-1 bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800 rounded">REVIEWED</span>;
      case 'responded':
        return <span className="inline-flex items-center gap-1 bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800 rounded">RESPONDED</span>;
      case 'archived':
        return <span className="inline-flex items-center gap-1 bg-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-700 rounded">ARCHIVED</span>;
      default:
        return <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 rounded">{status.toUpperCase()}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-3xl tracking-tight text-ink sm:text-4xl">Consultations & Inquiries</h1>
          <p className="mt-1 text-sm text-slate-600">
            Client Portal Operations — Review, search, and manage submitted consultation requests.
          </p>
        </div>
        <button
          onClick={exportCSV}
          disabled={submissions.length === 0}
          className="flex items-center gap-2 border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold tracking-wider text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <Download size={14} /> EXPORT CSV
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-wider text-slate-400">TOTAL SUBMISSIONS</p>
            <Inbox size={18} className="text-slate-400" />
          </div>
          <p className="mt-2 font-serif text-3xl font-bold text-ink">{totalCount}</p>
        </div>
        <div className="border border-sky-200 bg-sky-50/50 p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-wider text-sky-700">NEW LEADS</p>
            <Clock size={18} className="text-sky-600" />
          </div>
          <p className="mt-2 font-serif text-3xl font-bold text-sky-900">{newCount}</p>
        </div>
        <div className="border border-emerald-200 bg-emerald-50/50 p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-wider text-emerald-700">RESPONDED</p>
            <CheckCircle2 size={18} className="text-emerald-600" />
          </div>
          <p className="mt-2 font-serif text-3xl font-bold text-emerald-900">{respondedCount}</p>
        </div>
        <div className="border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-wider text-slate-400">ARCHIVED</p>
            <Archive size={18} className="text-slate-400" />
          </div>
          <p className="mt-2 font-serif text-3xl font-bold text-slate-700">{archivedCount}</p>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="flex flex-col gap-4 border border-slate-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, company, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-xs font-medium focus:border-ink focus:bg-white focus:outline-none"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="new">New Leads</option>
              <option value="read">Reviewed</option>
              <option value="responded">Responded</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <select
            value={practiceFilter}
            onChange={(e) => setPracticeFilter(e.target.value)}
            className="border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Practice Areas</option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Corporate Law">Corporate Law</option>
            <option value="Tax Advisory">Tax Advisory</option>
            <option value="Risk & Assurance">Risk & Assurance</option>
            <option value="Business Advisory">Business Advisory</option>
            <option value="GCC Structuring">CC Capital Structuring</option>
          </select>

          {(search || statusFilter !== 'all' || practiceFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setPracticeFilter('all');
              }}
              className="text-xs font-bold text-red-600 hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="border border-slate-200 bg-white overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">Loading consultation entries...</div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            No consultation entries found matching your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3.5">Full Name & Company</th>
                  <th className="px-5 py-3.5">Contact Email & Phone</th>
                  <th className="px-5 py-3.5">Practice Area</th>
                  <th className="px-5 py-3.5">Submitted Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="transition hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <div className="font-bold text-ink text-sm">{sub.fullName}</div>
                      <div className="text-slate-500 font-medium">{sub.company || 'Individual / Personal'}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800">{sub.email}</div>
                      <div className="text-slate-500">{sub.phone || 'No phone provided'}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-block rounded border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                        {sub.practiceArea || 'General Inquiry'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 font-medium whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">{getStatusBadge(sub.status)}</td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedSub(sub)}
                          className="flex items-center gap-1 border border-slate-200 bg-white px-3 py-1.5 font-bold text-ink hover:bg-slate-100"
                        >
                          <Eye size={13} /> View
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(sub.id)}
                          className="flex items-center gap-1 border border-red-200 bg-red-50 px-2.5 py-1.5 font-bold text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submission Details Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-slate-400">CONSULTATION SUBMISSION DETAILS</span>
                <h3 className="font-serif text-2xl font-bold text-ink">{selectedSub.fullName}</h3>
                <p className="text-xs text-slate-500">
                  Received on {new Date(selectedSub.createdAt).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setSelectedSub(null)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            {/* Info Grid */}
            <div className="my-6 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-md border border-slate-100 bg-slate-50 p-3">
                <Building size={18} className="mt-0.5 text-sky-700 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-500">ORGANIZATION / COMPANY</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedSub.company || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-md border border-slate-100 bg-slate-50 p-3">
                <Mail size={18} className="mt-0.5 text-sky-700 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-500">BUSINESS EMAIL</p>
                  <a href={`mailto:${selectedSub.email}`} className="text-sm font-semibold text-sky-800 hover:underline">
                    {selectedSub.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-md border border-slate-100 bg-slate-50 p-3">
                <Phone size={18} className="mt-0.5 text-sky-700 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-500">PHONE NUMBER</p>
                  {selectedSub.phone ? (
                    <a href={`tel:${selectedSub.phone}`} className="text-sm font-semibold text-sky-800 hover:underline">
                      {selectedSub.phone}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-slate-500">Not provided</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-md border border-slate-100 bg-slate-50 p-3">
                <Tag size={18} className="mt-0.5 text-sky-700 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-500">PRACTICE AREA INTEREST</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedSub.practiceArea || 'General Inquiry'}</p>
                </div>
              </div>
            </div>

            {/* Submitted Message */}
            <div className="mb-6">
              <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-2">SUBMITTED INQUIRY MESSAGE</p>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">
                {selectedSub.message}
              </div>
            </div>

            {/* Status & Actions Bar */}
            <div className="flex flex-col gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Update Status:</span>
                <select
                  value={selectedSub.status}
                  onChange={(e) => handleStatusChange(selectedSub.id, e.target.value)}
                  disabled={isPending}
                  className="border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value="new">New Lead</option>
                  <option value="read">Reviewed</option>
                  <option value="responded">Responded</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDeleteConfirmId(selectedSub.id)}
                  className="flex items-center gap-1.5 border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
                >
                  <Trash2 size={14} /> Delete Entry
                </button>
                <button
                  onClick={() => setSelectedSub(null)}
                  className="border border-slate-300 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-ink">Confirm Deletion</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Are you sure you want to delete this consultation submission record? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isPending}
                className="bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
