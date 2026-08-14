'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../components/AdminHeader';
import { PageHeader } from '../components/PageHeader';
import { DataTable, type Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { LoadingState } from '../components/LoadingState';
import {
  getIndustries,
  deleteIndustryAction,
  toggleIndustryPublishAction,
} from './actions';
import type { Industry } from '@/lib/db/schema';
import { Plus, Edit2, Trash2, Eye, EyeOff, Building2 } from 'lucide-react';

export default function IndustriesListPage() {
  const [industryList, setIndustryList] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getIndustries({ search });
      setIndustryList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteIndustryAction(deleteId);
      setDeleteId(null);
      loadData();
    });
  };

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleIndustryPublishAction(id, !currentStatus);
      loadData();
    });
  };

  const columns: Column<Industry>[] = [
    {
      header: 'Industry Sector',
      render: (ind) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {ind.imageUrl ? (
            <img
              src={ind.imageUrl}
              alt={ind.name}
              style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                background: 'rgba(59,130,246,0.1)',
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Building2 size={22} />
            </div>
          )}
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ind.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/{ind.slug}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Description',
      render: (ind) => (
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '360px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {ind.shortDescription || '—'}
        </div>
      ),
    },
    {
      header: 'Sort Order',
      accessor: 'sortOrder',
      width: '100px',
    },
    {
      header: 'Status',
      render: (ind) => (
        <StatusBadge status={ind.isPublished ? 'published' : 'draft'} />
      ),
    },
    {
      header: 'Actions',
      width: '120px',
      render: (ind) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => handleTogglePublish(ind.id, ind.isPublished)}
            title={ind.isPublished ? 'Unpublish' : 'Publish'}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            {ind.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <Link
            href={`/admin/industries/${ind.id}`}
            style={{ color: '#60a5fa', display: 'inline-flex', padding: '4px' }}
            title="Edit"
          >
            <Edit2 size={16} />
          </Link>
          <button
            type="button"
            onClick={() => setDeleteId(ind.id)}
            title="Delete"
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
      <AdminHeader title="Industries Portfolio" />

      <div className="admin-content">
        <PageHeader
          title="Industries Management"
          description="Manage key industry sectors, descriptions, and Cloudinary portfolio imagery."
          actions={
            <Link href="/admin/industries/new" className="btn btn-primary">
              <Plus size={16} />
              <span>Create Industry</span>
            </Link>
          }
        />

        {loading ? (
          <LoadingState message="Loading industries..." />
        ) : (
          <DataTable
            columns={columns}
            data={industryList}
            searchQuery={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search industries by name..."
            emptyMessage="No industries found."
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Industry"
        message="Are you sure you want to delete this industry sector?"
        confirmText="Delete Industry"
        isDanger
        isLoading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
