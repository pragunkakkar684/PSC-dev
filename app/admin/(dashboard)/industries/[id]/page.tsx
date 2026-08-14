'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../components/AdminHeader';
import { PageHeader } from '../../components/PageHeader';
import { FormField } from '../../components/FormField';
import { ImageUploadInput } from '../../components/ImageUploadInput';
import { LoadingState } from '../../components/LoadingState';
import {
  getIndustryById,
  updateIndustryAction,
} from '../actions';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditIndustryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const indId = parseInt(id, 10);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    imageUrl: '',
    sortOrder: 0,
    isPublished: false,
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getIndustryById(indId);
        if (!data) {
          setError('Industry not found');
          return;
        }

        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          shortDescription: data.shortDescription || '',
          imageUrl: data.imageUrl || '',
          sortOrder: data.sortOrder || 0,
          isPublished: data.isPublished || false,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load industry');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [indId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateIndustryAction(indId, formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update industry');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader title="Edit Industry" />
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
          description="Update industry sector details, description, and Cloudinary banner photo."
          actions={
            <Link href="/admin/industries" className="btn btn-secondary">
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
            ✓ Industry sector saved successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <FormField label="Industry Sector Name" required>
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
            <FormField label="Sector Cover Image (Cloudinary)">
              <ImageUploadInput
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                folder="psc-global/industries"
                label="Upload Industry Banner Image"
              />
            </FormField>
          </div>

          <div style={{ marginTop: '20px' }}>
            <FormField label="Short Description">
              <textarea
                rows={4}
                className="form-input"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              />
            </FormField>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
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
              <span>{saving ? 'Saving...' : 'Save Industry'}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
