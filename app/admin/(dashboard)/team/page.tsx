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
  getTeamMembers,
  deleteTeamMemberAction,
  toggleTeamMemberPublishAction,
} from './actions';
import type { TeamMember } from '@/lib/db/schema';
import { Plus, Edit2, Trash2, Eye, EyeOff, User } from 'lucide-react';

export default function TeamListPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getTeamMembers({ search, category });
      setMembers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, category]);

  const handleDelete = async () => {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteTeamMemberAction(deleteId);
      setDeleteId(null);
      loadData();
    });
  };

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleTeamMemberPublishAction(id, !currentStatus);
      loadData();
    });
  };

  const columns: Column<TeamMember>[] = [
    {
      header: 'Member',
      render: (m) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {m.imageUrl ? (
            <img
              src={m.imageUrl}
              alt={m.name}
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(59,130,246,0.1)',
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={18} />
            </div>
          )}
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/{m.slug}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Role Title',
      accessor: 'roleTitle',
      render: (m) => m.roleTitle || '—',
    },
    {
      header: 'Category',
      render: (m) => (
        <span style={{ fontSize: '12px', textTransform: 'capitalize' as const, color: 'var(--text-secondary)' }}>
          {m.category}
        </span>
      ),
    },
    {
      header: 'Location',
      render: (m) => m.location || '—',
    },
    {
      header: 'Sort Order',
      accessor: 'sortOrder',
    },
    {
      header: 'Status',
      render: (m) => (
        <StatusBadge status={m.isPublished ? 'published' : 'draft'} />
      ),
    },
    {
      header: 'Actions',
      width: '120px',
      render: (m) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => handleTogglePublish(m.id, m.isPublished)}
            title={m.isPublished ? 'Unpublish' : 'Publish'}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            {m.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <Link
            href={`/admin/team/${m.id}`}
            style={{ color: '#60a5fa', display: 'inline-flex', padding: '4px' }}
            title="Edit"
          >
            <Edit2 size={16} />
          </Link>
          <button
            type="button"
            onClick={() => setDeleteId(m.id)}
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
      <AdminHeader title="Team Members" />

      <div className="admin-content">
        <PageHeader
          title="Team Directory"
          description="Manage firm leadership, partners, advisors, and mentors for public display and profiles."
          actions={
            <Link href="/admin/team/new" className="btn btn-primary">
              <Plus size={16} />
              <span>Add Team Member</span>
            </Link>
          }
        />

        {loading ? (
          <LoadingState message="Loading team directory..." />
        ) : (
          <DataTable
            columns={columns}
            data={members}
            searchQuery={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by name..."
            filterSlot={
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input"
                style={{ width: '160px', height: '38px', fontSize: '13px' }}
              >
                <option value="all">All Categories</option>
                <option value="leadership">Leadership</option>
                <option value="partner">Partners</option>
                <option value="mentor">Mentors</option>
                <option value="advisor">Advisors</option>
              </select>
            }
            emptyMessage="No team members found."
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Team Member"
        message="Are you sure you want to delete this team member? This action cannot be undone."
        confirmText="Delete Member"
        isDanger
        isLoading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
