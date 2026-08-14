'use client';

import { useState, useEffect, useTransition } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { PageHeader } from '../components/PageHeader';
import { DataTable, type Column } from '../components/DataTable';
import { LoadingState } from '../components/LoadingState';
import {
  getContactSubmissions,
  updateContactStatusAction,
} from './actions';
import type { ContactSubmission } from '@/lib/db/schema';
import { Eye, Download, X, Mail, Phone, Building, Calendar, Tag } from 'lucide-react';

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSub, setSelectedSub] = useState<ContactSubmission | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getContactSubmissions({ search, status: statusFilter });
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    startTransition(async () => {
      const updated = await updateContactStatusAction(id, newStatus);
      if (selectedSub && selectedSub.id === id) {
        setSelectedSub(updated);
      }
      loadData();
    });
  };

  const exportCSV = () => {
    if (submissions.length === 0) return;

    const headers = ['FullName', 'Company', 'Email', 'Phone', 'PracticeArea', 'SubmittedAt', 'Status'];
    const rows = submissions.map((s) => [
      `"${(s.fullName || '').replace(/"/g, '""')}"`,
      `"${(s.company || '').replace(/"/g, '""')}"`,
      `"${(s.email || '').replace(/"/g, '""')}"`,
      `"${(s.phone || '').replace(/"/g, '""')}"`,
      `"${(s.practiceArea || '').replace(/"/g, '""')}"`,
      `"${new Date(s.submittedAt).toISOString()}"`,
      `"${s.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `psc_contact_submissions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'new':
        return { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', label: 'NEW LEAD' };
      case 'read':
        return { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', label: 'REVIEWED' };
      case 'responded':
        return { bg: 'rgba(16,185,129,0.15)', color: '#34d399', label: 'RESPONDED' };
      case 'archived':
        return { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8', label: 'ARCHIVED' };
      default:
        return { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8', label: status };
    }
  };

  const columns: Column<ContactSubmission>[] = [
    {
      header: 'Full Name & Company',
      render: (s) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.fullName}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.company || '—'}</div>
        </div>
      ),
    },
    {
      header: 'Contact Email',
      render: (s) => s.email,
    },
    {
      header: 'Practice Area',
      render: (s) => (
        <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 7px', borderRadius: '4px', background: 'rgba(99,102,241,0.1)', color: '#a5b4fc' }}>
          {s.practiceArea || 'General Inquiry'}
        </span>
      ),
    },
    {
      header: 'Submitted Date',
      render: (s) => new Date(s.submittedAt).toLocaleDateString(),
    },
    {
      header: 'Status',
      render: (s) => {
        const badge = getStatusBadgeStyle(s.status);
        return (
          <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: badge.bg, color: badge.color, textTransform: 'uppercase' }}>
            {badge.label}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      width: '100px',
      render: (s) => (
        <button
          type="button"
          onClick={() => setSelectedSub(s)}
          className="btn btn-secondary"
          style={{ padding: '4px 8px', fontSize: '12px' }}
        >
          <Eye size={14} />
          <span>View</span>
        </button>
      ),
    },
  ];

  return (
    <>
      <AdminHeader title="Contact Submissions" />

      <div className="admin-content">
        <PageHeader
          title="Contact Form Submissions"
          description="Review client consultation requests and update follow-up statuses."
          actions={
            <button type="button" onClick={exportCSV} disabled={submissions.length === 0} className="btn btn-secondary">
              <Download size={15} />
              <span>Export CSV</span>
            </button>
          }
        />

        {loading ? (
          <LoadingState message="Loading contact submissions..." />
        ) : (
          <DataTable
            columns={columns}
            data={submissions}
            searchQuery={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search leads by name..."
            filterSlot={
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input"
                style={{ width: '160px', height: '38px', fontSize: '13px' }}
              >
                <option value="all">All Statuses</option>
                <option value="new">New Leads</option>
                <option value="read">Reviewed</option>
                <option value="responded">Responded</option>
                <option value="archived">Archived</option>
              </select>
            }
            emptyMessage="No contact submissions found."
          />
        )}
      </div>

      {/* Submission Detail Modal */}
      {selectedSub && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', padding: '16px' }}>
          <div style={{ width: '100%', maxWidth: '600px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Submission Details</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Received {new Date(selectedSub.submittedAt).toLocaleString()}</p>
              </div>
              <button type="button" onClick={() => setSelectedSub(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <Building size={16} style={{ color: '#60a5fa' }} />
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Full Name & Company</div>
                  <div style={{ fontWeight: 600 }}>{selectedSub.fullName} ({selectedSub.company || 'N/A'})</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <Mail size={16} style={{ color: '#60a5fa' }} />
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Email Address</div>
                  <div style={{ fontWeight: 600 }}>{selectedSub.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <Phone size={16} style={{ color: '#60a5fa' }} />
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Phone Number</div>
                  <div style={{ fontWeight: 600 }}>{selectedSub.phone || 'Not provided'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <Tag size={16} style={{ color: '#60a5fa' }} />
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Practice Interest</div>
                  <div style={{ fontWeight: 600 }}>{selectedSub.practiceArea || 'General'}</div>
                </div>
              </div>
            </div>

            {/* Message Body (Read Only) */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Client Message (Immutable)</div>
              <div style={{ padding: '14px', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
                {selectedSub.message || 'No message content provided.'}
              </div>
            </div>

            {/* Status Update Control */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Lead Status:</span>
                <select
                  value={selectedSub.status}
                  onChange={(e) => handleStatusChange(selectedSub.id, e.target.value)}
                  disabled={isPending}
                  className="form-input"
                  style={{ width: '150px', height: '36px', fontSize: '13px' }}
                >
                  <option value="new">New Lead</option>
                  <option value="read">Reviewed</option>
                  <option value="responded">Responded</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <button type="button" onClick={() => setSelectedSub(null)} className="btn btn-secondary">
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
