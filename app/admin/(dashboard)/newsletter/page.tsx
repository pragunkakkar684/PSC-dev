'use client';

import { useState, useEffect, useTransition } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { PageHeader } from '../components/PageHeader';
import { DataTable, type Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { LoadingState } from '../components/LoadingState';
import {
  getNewsletterSubscribers,
  toggleSubscriberActiveAction,
  deleteSubscriberAction,
} from './actions';
import type { NewsletterSubscriber } from '@/lib/db/schema';
import { Download, Trash2, Mail, CheckCircle2, XCircle } from 'lucide-react';

export default function NewsletterSubscribersPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getNewsletterSubscribers({
        search,
        activeOnly: activeFilter === 'active',
      });
      setSubscribers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, activeFilter]);

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleSubscriberActiveAction(id, !currentStatus);
      loadData();
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteSubscriberAction(deleteId);
      setDeleteId(null);
      loadData();
    });
  };

  const exportCSV = () => {
    if (subscribers.length === 0) return;

    const headers = ['Email', 'SubscribedAt', 'Status', 'UnsubscribedAt'];
    const rows = subscribers.map((s) => [
      `"${s.email}"`,
      `"${new Date(s.subscribedAt).toISOString()}"`,
      `"${s.isActive ? 'Active' : 'Inactive'}"`,
      `"${s.unsubscribedAt ? new Date(s.unsubscribedAt).toISOString() : ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `psc_newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: Column<NewsletterSubscriber>[] = [
    {
      header: 'Subscriber Email',
      render: (s) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Mail size={16} style={{ color: s.isActive ? '#34d399' : '#94a3b8' }} />
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.email}</span>
        </div>
      ),
    },
    {
      header: 'Subscribed Date',
      render: (s) => new Date(s.subscribedAt).toLocaleDateString(),
    },
    {
      header: 'Status',
      render: (s) => (
        <StatusBadge status={s.isActive ? 'published' : 'draft'} />
      ),
    },
    {
      header: 'Unsubscribed Date',
      render: (s) => (s.unsubscribedAt ? new Date(s.unsubscribedAt).toLocaleDateString() : '—'),
    },
    {
      header: 'Actions',
      width: '120px',
      render: (s) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => handleToggleActive(s.id, s.isActive)}
            title={s.isActive ? 'Deactivate Subscriber' : 'Reactivate Subscriber'}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            {s.isActive ? <XCircle size={16} style={{ color: '#f87171' }} /> : <CheckCircle2 size={16} style={{ color: '#34d399' }} />}
          </button>
          <button
            type="button"
            onClick={() => setDeleteId(s.id)}
            title="Delete Record"
            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminHeader title="Newsletter Subscribers" />

      <div className="admin-content">
        <PageHeader
          title="Newsletter Subscriber Mailing List"
          description="Manage active email subscribers, handle unsubscribes, and export subscriber data to CSV."
          actions={
            <button type="button" onClick={exportCSV} disabled={subscribers.length === 0} className="btn btn-secondary">
              <Download size={15} />
              <span>Export CSV</span>
            </button>
          }
        />

        {loading ? (
          <LoadingState message="Loading mailing list..." />
        ) : (
          <DataTable
            columns={columns}
            data={subscribers}
            searchQuery={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search email addresses..."
            filterSlot={
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="form-input"
                style={{ width: '160px', height: '38px', fontSize: '13px' }}
              >
                <option value="all">All Subscribers</option>
                <option value="active">Active Only</option>
              </select>
            }
            emptyMessage="No newsletter subscribers found."
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Subscriber Record"
        message="Are you sure you want to permanently delete this email address from the mailing list?"
        confirmText="Delete Subscriber"
        isDanger
        isLoading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
