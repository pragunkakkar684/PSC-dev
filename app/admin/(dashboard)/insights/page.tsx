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
  getInsights,
  deleteInsightAction,
  toggleInsightPublishAction,
  toggleInsightFeaturedAction,
} from './actions';
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, FileText } from 'lucide-react';

interface InsightRow {
  id: number;
  slug: string;
  contentType: string;
  tag: string | null;
  title: string;
  summary: string | null;
  imageUrl: string | null;
  fileUrl: string | null;
  readTimeMins: number | null;
  authorityTag: string | null;
  courtName: string | null;
  publishedAt: Date | null;
  isFeatured: boolean;
  isPublished: boolean;
  authorId: number | null;
  createdAt: Date;
  authorName: string | null;
}

export default function InsightsListPage() {
  const [articles, setArticles] = useState<InsightRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [contentType, setContentType] = useState('all');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getInsights({ search, contentType });
      setArticles(data as any);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, contentType]);

  const handleDelete = async () => {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteInsightAction(deleteId);
      setDeleteId(null);
      loadData();
    });
  };

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleInsightPublishAction(id, !currentStatus);
      loadData();
    });
  };

  const handleToggleFeatured = async (id: number, currentFeatured: boolean) => {
    startTransition(async () => {
      await toggleInsightFeaturedAction(id, !currentFeatured);
      loadData();
    });
  };

  const columns: Column<InsightRow>[] = [
    {
      header: 'Article Title',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '6px',
                background: 'rgba(59,130,246,0.1)',
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={20} />
            </div>
          )}
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {item.tag ? `[${item.tag}] ` : ''}/{item.slug}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Content Type',
      render: (item) => (
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: '4px',
            background: 'rgba(168,85,247,0.1)',
            color: '#c084fc',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.04em',
          }}
        >
          {item.contentType.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Author',
      render: (item) => item.authorName || 'Firm Editorial',
    },
    {
      header: 'Published Date',
      render: (item) => (item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : '—'),
    },
    {
      header: 'Featured',
      render: (item) => (
        <button
          type="button"
          onClick={() => handleToggleFeatured(item.id, item.isFeatured)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.isFeatured ? '#fbbf24' : 'var(--text-muted)' }}
          title={item.isFeatured ? 'Unmark Featured' : 'Mark Featured'}
        >
          <Star size={16} fill={item.isFeatured ? '#fbbf24' : 'none'} />
        </button>
      ),
    },
    {
      header: 'Status',
      render: (item) => (
        <StatusBadge status={item.isPublished ? 'published' : 'draft'} />
      ),
    },
    {
      header: 'Actions',
      width: '120px',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => handleTogglePublish(item.id, item.isPublished)}
            title={item.isPublished ? 'Unpublish' : 'Publish'}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            {item.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <Link
            href={`/admin/insights/${item.id}`}
            style={{ color: '#60a5fa', display: 'inline-flex', padding: '4px' }}
            title="Edit"
          >
            <Edit2 size={16} />
          </Link>
          <button
            type="button"
            onClick={() => setDeleteId(item.id)}
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
      <AdminHeader title="Insights & Articles" />

      <div className="admin-content">
        <PageHeader
          title="Insights Repository"
          description="Manage articles, regulatory updates, court judgements, research papers, and webinars."
          actions={
            <Link href="/admin/insights/new" className="btn btn-primary">
              <Plus size={16} />
              <span>Create Insight</span>
            </Link>
          }
        />

        {loading ? (
          <LoadingState message="Loading insights..." />
        ) : (
          <DataTable
            columns={columns}
            data={articles}
            searchQuery={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by title..."
            filterSlot={
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="form-input"
                style={{ width: '180px', height: '38px', fontSize: '13px' }}
              >
                <option value="all">All Content Types</option>
                <option value="article">Articles</option>
                <option value="regulatory_update">Regulatory Updates</option>
                <option value="judgement">Court Judgements</option>
                <option value="research">Research Publications</option>
                <option value="webinar">Webinars</option>
              </select>
            }
            emptyMessage="No insights found."
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Insight Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
        confirmText="Delete Article"
        isDanger
        isLoading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
