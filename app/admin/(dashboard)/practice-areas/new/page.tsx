'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminHeader } from '../../components/AdminHeader';
import { PageHeader } from '../../components/PageHeader';
import { FormField } from '../../components/FormField';
import { IconPicker } from '../../components/IconPicker';
import { createPracticeAreaAction } from '../actions';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewPracticeAreaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const created = await createPracticeAreaAction(formData);
      router.push(`/admin/practice-areas/${created.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create practice area');
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="Create Practice Area" />

      <div className="admin-content">
        <PageHeader
          title="Create Practice Area"
          description="Add a new core advisory service line."
          actions={
            <Link href="/admin/practice-areas" className="btn btn-secondary">
              <ArrowLeft size={16} />
              <span>Back to Practice Areas</span>
            </Link>
          }
        />

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', color: '#f87171', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <FormField label="Area Number" required hint="e.g. 01, 02, 03">
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. 01"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              />
            </FormField>

            <FormField label="Practice Area Name" required>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Risk & Assurance"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </FormField>

            <FormField label="URL Slug" hint="Auto-generated if left blank">
              <input
                type="text"
                className="form-input"
                placeholder="e.g. risk-assurance"
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
                placeholder="Brief summary for card grids and navigation mega menu..."
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
                placeholder="Comprehensive service description..."
                value={formData.longDescription}
                onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              />
            </FormField>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              />
              Publish practice area immediately
            </label>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
              <Save size={16} />
              <span>{loading ? 'Saving...' : 'Create Practice Area'}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
