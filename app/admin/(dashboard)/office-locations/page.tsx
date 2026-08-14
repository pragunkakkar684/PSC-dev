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
  getOfficeLocations,
  createOfficeLocationAction,
  updateOfficeLocationAction,
  deleteOfficeLocationAction,
  toggleOfficePublishAction,
} from './actions';
import type { OfficeLocation } from '@/lib/db/schema';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Building2, MapPin } from 'lucide-react';

export default function OfficeLocationsPage() {
  const [offices, setOffices] = useState<OfficeLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editOffice, setEditOffice] = useState<Partial<OfficeLocation> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getOfficeLocations(search);
      setOffices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const handleOpenModal = (office?: OfficeLocation) => {
    setFormError(null);
    if (office) {
      setEditOffice(office);
    } else {
      setEditOffice({
        city: '',
        fullAddress: '',
        phone: '',
        email: '',
        isHeadquarters: false,
        sortOrder: 0,
        isPublished: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editOffice?.city) return;

    setFormError(null);
    startTransition(async () => {
      try {
        if (editOffice.id) {
          await updateOfficeLocationAction(editOffice.id, editOffice);
        } else {
          await createOfficeLocationAction(editOffice);
        }
        setIsModalOpen(false);
        loadData();
      } catch (err: any) {
        setFormError(err.message || 'Failed to save office location');
      }
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteOfficeLocationAction(deleteId);
      setDeleteId(null);
      loadData();
    });
  };

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleOfficePublishAction(id, !currentStatus);
      loadData();
    });
  };

  const columns: Column<OfficeLocation>[] = [
    {
      header: 'City / Office',
      render: (o) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={16} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {o.city}
              {o.isHeadquarters && (
                <span style={{ fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: 'rgba(245,158,11,0.15)', color: '#fbbf24', textTransform: 'uppercase' }}>
                  HQ
                </span>
              )}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{o.phone || 'No phone listed'}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Address',
      render: (o) => (
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '300px' }}>
          {o.fullAddress || '—'}
        </div>
      ),
    },
    {
      header: 'Email',
      render: (o) => o.email || '—',
    },
    {
      header: 'Sort Order',
      accessor: 'sortOrder',
      width: '100px',
    },
    {
      header: 'Status',
      render: (o) => (
        <StatusBadge status={o.isPublished ? 'published' : 'draft'} />
      ),
    },
    {
      header: 'Actions',
      width: '120px',
      render: (o) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => handleTogglePublish(o.id, o.isPublished)}
            title={o.isPublished ? 'Unpublish' : 'Publish'}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            {o.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button
            type="button"
            onClick={() => handleOpenModal(o)}
            style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', padding: '4px' }}
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => setDeleteId(o.id)}
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
      <AdminHeader title="Office Locations" />

      <div className="admin-content">
        <PageHeader
          title="Global Office Locations"
          description="Manage firm office addresses, contact phone numbers, emails, and global headquarters flags."
          actions={
            <button type="button" onClick={() => handleOpenModal()} className="btn btn-primary">
              <Plus size={16} />
              <span>Add Office Location</span>
            </button>
          }
        />

        {loading ? (
          <LoadingState message="Loading office locations..." />
        ) : (
          <DataTable
            columns={columns}
            data={offices}
            searchQuery={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by city name..."
            emptyMessage="No office locations found."
          />
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', padding: '16px' }}>
          <div style={{ width: '100%', maxWidth: '540px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{editOffice?.id ? 'Edit Office Location' : 'Add Office Location'}</h3>
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
              <FormField label="City / Region Name" required>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. London or Mumbai"
                  value={editOffice?.city || ''}
                  onChange={(e) => setEditOffice({ ...editOffice, city: e.target.value })}
                />
              </FormField>

              <FormField label="Full Postal Address">
                <textarea
                  rows={3}
                  className="form-input"
                  placeholder="e.g. 120 Holborn, London EC1N 2TD, United Kingdom"
                  value={editOffice?.fullAddress || ''}
                  onChange={(e) => setEditOffice({ ...editOffice, fullAddress: e.target.value })}
                />
              </FormField>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormField label="Phone Number">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. +44 (0) 20 7123 4567"
                    value={editOffice?.phone || ''}
                    onChange={(e) => setEditOffice({ ...editOffice, phone: e.target.value })}
                  />
                </FormField>

                <FormField label="Office Email">
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. london@pscglobal.com"
                    value={editOffice?.email || ''}
                    onChange={(e) => setEditOffice({ ...editOffice, email: e.target.value })}
                  />
                </FormField>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormField label="Sort Order">
                  <input
                    type="number"
                    className="form-input"
                    value={editOffice?.sortOrder ?? 0}
                    onChange={(e) => setEditOffice({ ...editOffice, sortOrder: parseInt(e.target.value, 10) || 0 })}
                  />
                </FormField>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={editOffice?.isHeadquarters ?? false}
                      onChange={(e) => setEditOffice({ ...editOffice, isHeadquarters: e.target.checked })}
                    />
                    Global Headquarters
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={editOffice?.isPublished ?? true}
                      onChange={(e) => setEditOffice({ ...editOffice, isPublished: e.target.checked })}
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
                  {isPending ? 'Saving...' : 'Save Office'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Office Location"
        message="Are you sure you want to delete this office location?"
        confirmText="Delete Office"
        isDanger
        isLoading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
