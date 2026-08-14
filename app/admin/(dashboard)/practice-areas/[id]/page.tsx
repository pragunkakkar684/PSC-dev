'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../components/AdminHeader';
import { PageHeader } from '../../components/PageHeader';
import { FormField } from '../../components/FormField';
import { IconPicker } from '../../components/IconPicker';
import { LoadingState } from '../../components/LoadingState';
import {
  getPracticeAreaById,
  updatePracticeAreaAction,
  savePracticeAreaServicesAction,
} from '../actions';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

interface ServiceItem {
  id?: number;
  name: string;
}

export default function EditPracticeAreaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const areaId = parseInt(id, 10);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    number: '01',
    name: '',
    slug: '',
    iconName: 'Shield',
    shortDescription: '',
    longDescription: '',
    styleClass: '',
    sortOrder: 0,
    isPublished: false,
  });

  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPracticeAreaById(areaId);
        if (!data) {
          setError('Practice area not found');
          return;
        }

        setFormData({
          number: data.number || '01',
          name: data.name || '',
          slug: data.slug || '',
          iconName: data.iconName || 'Shield',
          shortDescription: data.shortDescription || '',
          longDescription: data.longDescription || '',
          styleClass: data.styleClass || '',
          sortOrder: data.sortOrder || 0,
          isPublished: data.isPublished || false,
        });

        if (data.services) {
          setServicesList(
            data.services.map((s) => ({
              id: s.id,
              name: s.name,
            }))
          );
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load practice area');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [areaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updatePracticeAreaAction(areaId, formData);
      await savePracticeAreaServicesAction(areaId, servicesList);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update practice area');
    } finally {
      setSaving(false);
    }
  };

  const addServiceItem = () => {
    setServicesList([...servicesList, { name: '' }]);
  };

  const removeServiceItem = (idx: number) => {
    setServicesList(servicesList.filter((_, i) => i !== idx));
  };

  const updateServiceItem = (idx: number, name: string) => {
    const updated = [...servicesList];
    updated[idx] = { ...updated[idx], name };
    setServicesList(updated);
  };

  if (loading) {
    return (
      <>
        <AdminHeader title="Edit Practice Area" />
        <LoadingState message="Loading details..." />
      </>
    );
  }

  return (
    <>
      <AdminHeader title={`Edit: ${formData.name}`} />

      <div className="admin-content">
        <PageHeader
          title={`Edit ${formData.name}`}
          description="Update practice area details, descriptions, Lucide icon, and sub-services."
          actions={
            <Link href="/admin/practice-areas" className="btn btn-secondary">
              <ArrowLeft size={16} />
              <span>Back</span>
            </Link>
          }
        />

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', color: '#f87171', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.1)', color: '#34d399', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
            ✓ Practice area and sub-services saved successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Main Info */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Practice Area Details</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <FormField label="Area Number" required>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                />
              </FormField>

              <FormField label="Practice Area Name" required>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </FormField>

              <FormField label="URL Slug">
                <input
                  type="text"
                  className="form-input"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </FormField>

              <FormField label="Sort Order">
                <input
                  type="number"
                  className="form-input"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 0 })}
                />
              </FormField>
            </div>

            <div style={{ marginTop: '20px' }}>
              <FormField label="Lucide Icon Selection" required>
                <IconPicker
                  value={formData.iconName}
                  onChange={(iconName) => setFormData({ ...formData, iconName })}
                />
              </FormField>
            </div>

            <div style={{ marginTop: '20px' }}>
              <FormField label="Short Summary / Overview">
                <textarea
                  rows={3}
                  className="form-input"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                />
              </FormField>
            </div>

            <div style={{ marginTop: '20px' }}>
              <FormField label="Detailed Description / Scope">
                <textarea
                  rows={6}
                  className="form-input"
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                />
              </FormField>
            </div>
          </div>

          {/* Sub-Services List */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Associated Sub-Services</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Specific capabilities displayed under this practice line.</p>
              </div>
              <button type="button" onClick={addServiceItem} className="btn btn-secondary">
                <Plus size={15} /> Add Sub-Service
              </button>
            </div>

            {servicesList.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', border: '1px dashed var(--border)', borderRadius: '8px' }}>
                No sub-services added yet. Click &quot;Add Sub-Service&quot; above.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {servicesList.map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', width: '30px' }}>#{idx + 1}</span>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. IT Risk Advisory or Transfer Pricing"
                      value={s.name}
                      onChange={(e) => updateServiceItem(idx, e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeServiceItem(idx)}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '6px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Submit Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              />
              Published on firm website
            </label>

            <button type="submit" disabled={saving} className="btn btn-primary">
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Practice Area'}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
