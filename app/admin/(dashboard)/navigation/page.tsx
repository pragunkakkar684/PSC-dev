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
  getNavItems,
  createNavItemAction,
  updateNavItemAction,
  deleteNavItemAction,
  toggleNavItemActiveAction,
} from './actions';
import type { NavItem } from '@/lib/db/schema';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Navigation, ExternalLink } from 'lucide-react';

export default function NavigationCMSPage() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuFilter, setMenuFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<Partial<NavItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getNavItems(menuFilter);
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [menuFilter]);

  const handleOpenModal = (item?: NavItem) => {
    setFormError(null);
    if (item) {
      setEditItem(item);
    } else {
      setEditItem({
        label: '',
        href: '/',
        menuKey: 'primary',
        menuType: 'link',
        sortOrder: 0,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem?.label || !editItem?.href) return;

    if (editItem.href.trim().toLowerCase().startsWith('javascript:')) {
      setFormError('JavaScript protocol is strictly prohibited in navigation links');
      return;
    }

    setFormError(null);
    startTransition(async () => {
      try {
        if (editItem.id) {
          await updateNavItemAction(editItem.id, editItem);
        } else {
          await createNavItemAction(editItem);
        }
        setIsModalOpen(false);
        loadData();
      } catch (err: any) {
        setFormError(err.message || 'Failed to save navigation item');
      }
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteNavItemAction(deleteId);
      setDeleteId(null);
      loadData();
    });
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleNavItemActiveAction(id, !currentStatus);
      loadData();
    });
  };

  const columns: Column<NavItem>[] = [
    {
      header: 'Navigation Label',
      render: (n) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Navigation size={16} style={{ color: '#60a5fa' }} />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{n.label}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{n.href}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Menu Group / Key',
      render: (n) => (
        <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', background: 'rgba(168,85,247,0.1)', color: '#c084fc', textTransform: 'uppercase' }}>
          {n.menuKey || 'primary'}
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
      render: (n) => (
        <StatusBadge status={n.isActive ? 'published' : 'draft'} />
      ),
    },
    {
      header: 'Actions',
      width: '120px',
      render: (n) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => handleToggleActive(n.id, n.isActive)}
            title={n.isActive ? 'Deactivate' : 'Activate'}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            {n.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button
            type="button"
            onClick={() => handleOpenModal(n)}
            style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', padding: '4px' }}
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => setDeleteId(n.id)}
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
      <AdminHeader title="Navigation CMS" />

      <div className="admin-content">
        <PageHeader
          title="Site Navigation Links"
          description="Manage header primary navigation, mega-menu links, and footer navigation structures."
          actions={
            <button type="button" onClick={() => handleOpenModal()} className="btn btn-primary">
              <Plus size={16} />
              <span>Add Nav Link</span>
            </button>
          }
        />

        {loading ? (
          <LoadingState message="Loading navigation links..." />
        ) : (
          <DataTable
            columns={columns}
            data={items}
            filterSlot={
              <select
                value={menuFilter}
                onChange={(e) => setMenuFilter(e.target.value)}
                className="form-input"
                style={{ width: '180px', height: '38px', fontSize: '13px' }}
              >
                <option value="all">All Menu Groups</option>
                <option value="primary">Primary Header</option>
                <option value="about">About Mega-Menu</option>
                <option value="team">Team Links</option>
                <option value="practice">Practice Area Links</option>
                <option value="industry">Industry Links</option>
                <option value="insights">Insights Links</option>
                <option value="footer">Footer / Legal</option>
              </select>
            }
            emptyMessage="No navigation items found."
          />
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', padding: '16px' }}>
          <div style={{ width: '100%', maxWidth: '540px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{editItem?.id ? 'Edit Navigation Item' : 'Add Navigation Item'}</h3>
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
              <FormField label="Menu Group Key" required>
                <select
                  className="form-input"
                  value={editItem?.menuKey || 'primary'}
                  onChange={(e) => setEditItem({ ...editItem, menuKey: e.target.value })}
                >
                  <option value="primary">Primary Header Menu</option>
                  <option value="about">About Submenu</option>
                  <option value="team">Team Submenu</option>
                  <option value="practice">Practice Areas Submenu</option>
                  <option value="industry">Industries Submenu</option>
                  <option value="insights">Insights Submenu</option>
                  <option value="footer">Footer Legal Links</option>
                </select>
              </FormField>

              <FormField label="Link Label" required>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Risk & Assurance"
                  value={editItem?.label || ''}
                  onChange={(e) => setEditItem({ ...editItem, label: e.target.value })}
                />
              </FormField>

              <FormField label="Target Href / URL" required hint="e.g. /practice-areas or https://external.com">
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. /practice-areas"
                  value={editItem?.href || ''}
                  onChange={(e) => setEditItem({ ...editItem, href: e.target.value })}
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
                      checked={editItem?.isActive ?? true}
                      onChange={(e) => setEditItem({ ...editItem, isActive: e.target.checked })}
                    />
                    Active / Visible
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="btn btn-primary">
                  {isPending ? 'Saving...' : 'Save Nav Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Navigation Item"
        message="Are you sure you want to delete this navigation link?"
        confirmText="Delete Link"
        isDanger
        isLoading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
