'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminHeader } from '../../components/AdminHeader';
import { PageHeader } from '../../components/PageHeader';
import { FormField } from '../../components/FormField';
import { ImageUploadInput } from '../../components/ImageUploadInput';
import { createIndustryAction } from '../actions';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewIndustryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    imageUrl: '',
    sortOrder: 0,
    isPublished: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const created = await createIndustryAction(formData);
      router.push(`/admin/industries/${created.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create industry');
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="Create Industry" />

      <div className="admin-content">
        <PageHeader
          title="Create Industry Sector"
          description="Add an industry sector to the PSC portfolio."
          actions={
            <Link href="/admin/industries" className="btn btn-secondary">
              <ArrowLeft size={16} />
              <span>Back to Industries</span>
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
            <FormField label="Industry Sector Name" required>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Energy & Clean Tech"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </FormField>

            <FormField label="URL Slug" hint="Auto-generated if left blank">
              <input
                type="text"
                className="form-input"
                placeholder="e.g. energy-clean-tech"
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
                placeholder="Overview of advisory focus in this industry..."
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
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
              Publish industry immediately
            </label>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
              <Save size={16} />
              <span>{loading ? 'Saving...' : 'Create Industry'}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
