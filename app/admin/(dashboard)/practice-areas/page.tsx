'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../components/AdminHeader';
import { PageHeader } from '../components/PageHeader';
import { DataTable, type Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { LoadingState } from '../components/LoadingState';
import { ALLOWED_ICONS } from '../components/IconPicker';
import {
  getPracticeAreas,
  deletePracticeAreaAction,
  togglePracticeAreaPublishAction,
} from './actions';
import type { PracticeArea } from '@/lib/db/schema';
import { Plus, Edit2, Trash2, Eye, EyeOff, Layers } from 'lucide-react';

export default function PracticeAreasListPage() {
  const [areas, setAreas] = useState<PracticeArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getPracticeAreas({ search });
      setAreas(data);
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
      await deletePracticeAreaAction(deleteId);
      setDeleteId(null);
      loadData();
    });
  };

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    startTransition(async () => {
      await togglePracticeAreaPublishAction(id, !currentStatus);
      loadData();
    });
  };

  const columns: Column<PracticeArea>[] = [
    {
      header: 'No.',
      accessor: 'number',
      width: '60px',
      render: (pa) => pa.number || '—',
    },
    {
      header: 'Practice Area',
      render: (pa) => {
        const IconComp = (pa.iconName && ALLOWED_ICONS[pa.iconName]) || Layers;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(59,130,246,0.1)',
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconComp size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{pa.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/{pa.slug}</div>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Icon Name',
      render: (pa) => (
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
          {pa.iconName || 'None'}
        </span>
      ),
    },
    {
      header: 'Sort Order',
      accessor: 'sortOrder',
      width: '100px',
    },
    {
      header: 'Status',
      render: (pa) => (
        <StatusBadge status={pa.isPublished ? 'published' : 'draft'} />
      ),
    },
    {
      header: 'Actions',
      width: '120px',
      render: (pa) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => handleTogglePublish(pa.id, pa.isPublished)}
            title={pa.isPublished ? 'Unpublish' : 'Publish'}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            {pa.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <Link
            href={`/admin/practice-areas/${pa.id}`}
            style={{ color: '#60a5fa', display: 'inline-flex', padding: '4px' }}
            title="Edit"
          >
            <Edit2 size={16} />
          </Link>
          <button
            type="button"
            onClick={() => setDeleteId(pa.id)}
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
      <AdminHeader title="Practice Areas" />

      <div className="admin-content">
        <PageHeader
          title="Practice Areas Management"
          description="Manage primary advisory service lines, descriptions, icon identifiers, and sub-services."
          actions={
            <Link href="/admin/practice-areas/new" className="btn btn-primary">
              <Plus size={16} />
              <span>Create Practice Area</span>
            </Link>
          }
        />

        {loading ? (
          <LoadingState message="Loading practice areas..." />
        ) : (
          <DataTable
            columns={columns}
            data={areas}
            searchQuery={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by name..."
            emptyMessage="No practice areas found."
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Practice Area"
        message="Are you sure you want to delete this practice area? Associated sub-services will also be removed."
        confirmText="Delete Practice Area"
        isDanger
        isLoading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
