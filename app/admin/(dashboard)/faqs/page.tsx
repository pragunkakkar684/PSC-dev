'use client';

import { useState, useEffect, useTransition } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { PageHeader } from '../components/PageHeader';
import { DataTable, type Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { LoadingState } from '../components/LoadingState';
import { FormField } from '../components/FormField';
import {
  getFaqs,
  createFaqAction,
  updateFaqAction,
  deleteFaqAction,
  toggleFaqPublishAction,
} from './actions';
import type { Faq } from '@/lib/db/schema';
import { Plus, Edit2, Trash2, Eye, EyeOff, X } from 'lucide-react';

export default function FaqsPage() {
  const [faqList, setFaqList] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [contextFilter, setContextFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editFaq, setEditFaq] = useState<Partial<Faq> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getFaqs({ search, pageContext: contextFilter });
      setFaqList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, contextFilter]);

  const handleOpenModal = (faq?: Faq) => {
    setFormError(null);
    if (faq) {
      setEditFaq(faq);
    } else {
      setEditFaq({
        question: '',
        answer: '',
        category: 'general',
        sortOrder: 0,
        isPublished: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFaq?.question || !editFaq?.answer) return;

    setFormError(null);
    startTransition(async () => {
      try {
        if (editFaq.id) {
          await updateFaqAction(editFaq.id, editFaq);
        } else {
          await createFaqAction(editFaq);
        }
        setIsModalOpen(false);
        loadData();
      } catch (err: any) {
        setFormError(err.message || 'Failed to save FAQ');
      }
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteFaqAction(deleteId);
      setDeleteId(null);
      loadData();
    });
  };

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleFaqPublishAction(id, !currentStatus);
      loadData();
    });
  };

  const columns: Column<Faq>[] = [
    {
      header: 'Question',
      render: (f) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{f.question}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {f.answer}
          </div>
        </div>
      ),
    },
    {
      header: 'Page Context',
      render: (f) => (
        <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', textTransform: 'uppercase' }}>
          {f.category}
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
      render: (f) => (
        <StatusBadge status={f.isPublished ? 'published' : 'draft'} />
      ),
    },
    {
      header: 'Actions',
      width: '120px',
      render: (f) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => handleTogglePublish(f.id, f.isPublished)}
            title={f.isPublished ? 'Unpublish' : 'Publish'}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            {f.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button
            type="button"
            onClick={() => handleOpenModal(f)}
            style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', padding: '4px' }}
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => setDeleteId(f.id)}
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
      <AdminHeader title="FAQ Management" />

      <div className="admin-content">
        <PageHeader
          title="Frequently Asked Questions"
          description="Manage questions and answers displayed across Contact, GCC, and general site contexts."
          actions={
            <button type="button" onClick={() => handleOpenModal()} className="btn btn-primary">
              <Plus size={16} />
              <span>Add FAQ</span>
            </button>
          }
        />

        {loading ? (
          <LoadingState message="Loading FAQs..." />
        ) : (
          <DataTable
            columns={columns}
            data={faqList}
            searchQuery={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search questions..."
            filterSlot={
              <select
                value={contextFilter}
                onChange={(e) => setContextFilter(e.target.value)}
                className="form-input"
                style={{ width: '160px', height: '38px', fontSize: '13px' }}
              >
                <option value="all">All Contexts</option>
                <option value="general">General</option>
                <option value="contact">Contact Page</option>
                <option value="gcc">GCC Page</option>
              </select>
            }
            emptyMessage="No FAQs found."
          />
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', padding: '16px' }}>
          <div style={{ width: '100%', maxWidth: '540px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{editFaq?.id ? 'Edit FAQ' : 'Create New FAQ'}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', color: '#f87171', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <FormField label="Page Context" required>
                <select
                  className="form-input"
                  value={editFaq?.category || 'general'}
                  onChange={(e) => setEditFaq({ ...editFaq, category: e.target.value })}
                >
                  <option value="general">General / Shared</option>
                  <option value="contact">Contact Page</option>
                  <option value="gcc">GCC Page</option>
                </select>
              </FormField>

              <FormField label="Question" required>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. How long does it take to establish a GCC?"
                  value={editFaq?.question || ''}
                  onChange={(e) => setEditFaq({ ...editFaq, question: e.target.value })}
                />
              </FormField>

              <FormField label="Answer" required>
                <textarea
                  rows={5}
                  required
                  className="form-input"
                  placeholder="Detailed answer text..."
                  value={editFaq?.answer || ''}
                  onChange={(e) => setEditFaq({ ...editFaq, answer: e.target.value })}
                />
              </FormField>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormField label="Sort Order">
                  <input
                    type="number"
                    className="form-input"
                    value={editFaq?.sortOrder ?? 0}
                    onChange={(e) => setEditFaq({ ...editFaq, sortOrder: parseInt(e.target.value, 10) || 0 })}
                  />
                </FormField>

                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={editFaq?.isPublished ?? true}
                      onChange={(e) => setEditFaq({ ...editFaq, isPublished: e.target.checked })}
                    />
                    Published
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="btn btn-primary">
                  {isPending ? 'Saving...' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete FAQ"
        message="Are you sure you want to delete this question? This action cannot be undone."
        confirmText="Delete FAQ"
        isDanger
        isLoading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
