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
  getTestimonials,
  createTestimonialAction,
  updateTestimonialAction,
  deleteTestimonialAction,
  toggleTestimonialPublishAction,
} from './actions';
import type { Testimonial } from '@/lib/db/schema';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, MessageSquare } from 'lucide-react';

export default function TestimonialsPage() {
  const [list, setList] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<Partial<Testimonial> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getTestimonials(search);
      setList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const handleOpenModal = (item?: Testimonial) => {
    setFormError(null);
    if (item) {
      setEditItem(item);
    } else {
      setEditItem({
        quote: '',
        personName: '',
        personTitle: '',
        companyName: '',
        sortOrder: 0,
        isPublished: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem?.quote) return;

    setFormError(null);
    startTransition(async () => {
      try {
        if (editItem.id) {
          await updateTestimonialAction(editItem.id, editItem);
        } else {
          await createTestimonialAction(editItem);
        }
        setIsModalOpen(false);
        loadData();
      } catch (err: any) {
        setFormError(err.message || 'Failed to save testimonial');
      }
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteTestimonialAction(deleteId);
      setDeleteId(null);
      loadData();
    });
  };

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleTestimonialPublishAction(id, !currentStatus);
      loadData();
    });
  };

  const columns: Column<Testimonial>[] = [
    {
      header: 'Quote',
      render: (t) => (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <MessageSquare size={16} style={{ color: '#60a5fa', marginTop: '3px', flexShrink: 0 }} />
          <div>
            <div style={{ fontStyle: 'italic', color: 'var(--text-primary)', fontSize: '13px', lineHeight: 1.5 }}>
              &quot;{t.quote}&quot;
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Author / Person',
      render: (t) => (
        <div>
          <div style={{ fontWeight: 600 }}>{t.personName || 'Anonymous'}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {t.personTitle ? `${t.personTitle}` : ''}{t.companyName ? ` (${t.companyName})` : ''}
          </div>
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
      render: (t) => (
        <StatusBadge status={t.isPublished ? 'published' : 'draft'} />
      ),
    },
    {
      header: 'Actions',
      width: '120px',
      render: (t) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => handleTogglePublish(t.id, t.isPublished)}
            title={t.isPublished ? 'Unpublish' : 'Publish'}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            {t.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button
            type="button"
            onClick={() => handleOpenModal(t)}
            style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', padding: '4px' }}
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => setDeleteId(t.id)}
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
      <AdminHeader title="Testimonials" />

      <div className="admin-content">
        <PageHeader
          title="Client Testimonials"
          description="Manage client quotes, endorsements, and author credentials."
          actions={
            <button type="button" onClick={() => handleOpenModal()} className="btn btn-primary">
              <Plus size={16} />
              <span>Add Testimonial</span>
            </button>
          }
        />

        {loading ? (
          <LoadingState message="Loading testimonials..." />
        ) : (
          <DataTable
            columns={columns}
            data={list}
            searchQuery={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search quote text..."
            emptyMessage="No testimonials found."
          />
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', padding: '16px' }}>
          <div style={{ width: '100%', maxWidth: '540px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{editItem?.id ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
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
              <FormField label="Quote Text" required>
                <textarea
                  rows={4}
                  required
                  className="form-input"
                  placeholder="e.g. PSC Global transformed our cross-border compliance framework..."
                  value={editItem?.quote || ''}
                  onChange={(e) => setEditItem({ ...editItem, quote: e.target.value })}
                />
              </FormField>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormField label="Person Name">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Marcus Sterling"
                    value={editItem?.personName || ''}
                    onChange={(e) => setEditItem({ ...editItem, personName: e.target.value })}
                  />
                </FormField>

                <FormField label="Title / Position">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Chief Financial Officer"
                    value={editItem?.personTitle || ''}
                    onChange={(e) => setEditItem({ ...editItem, personTitle: e.target.value })}
                  />
                </FormField>
              </div>

              <FormField label="Company Name">
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Apex Holdings International"
                  value={editItem?.companyName || ''}
                  onChange={(e) => setEditItem({ ...editItem, companyName: e.target.value })}
                />
              </FormField>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormField label="Sort Order">
                  <input
                    type="number"
                    className="form-input"
                    value={editItem?.sortOrder ?? 0}
                    onChange={(e) => setEditItem({ ...editItem, sortOrder: parseInt(e.target.value, 10) || 0 })}
                  />
                </FormField>

                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={editItem?.isPublished ?? true}
                      onChange={(e) => setEditItem({ ...editItem, isPublished: e.target.checked })}
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
                  {isPending ? 'Saving...' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Testimonial"
        message="Are you sure you want to delete this client testimonial?"
        confirmText="Delete Testimonial"
        isDanger
        isLoading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
