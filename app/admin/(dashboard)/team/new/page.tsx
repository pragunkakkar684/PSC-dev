'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminHeader } from '../../components/AdminHeader';
import { PageHeader } from '../../components/PageHeader';
import { FormField } from '../../components/FormField';
import { ImageUploadInput } from '../../components/ImageUploadInput';
import { createTeamMemberAction } from '../actions';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewTeamMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    roleTitle: '',
    category: 'partner',
    focusArea: '',
    location: '',
    email: '',
    yearsExperience: '',
    shortBio: '',
    quote: '',
    imageUrl: '',
    sortOrder: 0,
    isPublished: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const created = await createTeamMemberAction(formData);
      router.push(`/admin/team/${created.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create team member');
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="New Team Member" />

      <div className="admin-content">
        <PageHeader
          title="Create Team Member"
          description="Add a new leader, partner, or mentor to the firm directory."
          actions={
            <Link href="/admin/team" className="btn btn-secondary">
              <ArrowLeft size={16} />
              <span>Back to Directory</span>
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
            <FormField label="Full Name" required>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Dr. Julian Vance"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </FormField>

            <FormField label="URL Slug" hint="Auto-generated if left blank">
              <input
                type="text"
                className="form-input"
                placeholder="e.g. julian-vance"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </FormField>

            <FormField label="Role Title">
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Founder & CEO / Senior Partner"
                value={formData.roleTitle}
                onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
              />
            </FormField>

            <FormField label="Category">
              <select
                className="form-input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="leadership">Leadership</option>
                <option value="partner">Partner</option>
                <option value="mentor">Mentor</option>
                <option value="advisor">Advisor</option>
              </select>
            </FormField>

            <FormField label="Location">
              <input
                type="text"
                className="form-input"
                placeholder="e.g. LONDON / NEW YORK"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </FormField>

            <FormField label="Email Address">
              <input
                type="email"
                className="form-input"
                placeholder="e.g. j.vance@pscglobal.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </FormField>

            <FormField label="Years Experience">
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 25+ YEARS EXPERIENCE"
                value={formData.yearsExperience}
                onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
              />
            </FormField>

            <FormField label="Focus Area / Specialty">
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Corporate Law & Cross-border Restructuring"
                value={formData.focusArea}
                onChange={(e) => setFormData({ ...formData, focusArea: e.target.value })}
              />
            </FormField>
          </div>

          <div style={{ marginTop: '20px' }}>
            <FormField label="Profile Photo (Cloudinary)">
              <ImageUploadInput
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                folder="psc-global/team"
                label="Upload Headshot Photo"
              />
            </FormField>
          </div>

          <div style={{ marginTop: '20px' }}>
            <FormField label="Short Bio">
              <textarea
                rows={3}
                className="form-input"
                placeholder="Brief profile summary for cards and lists..."
                value={formData.shortBio}
                onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
              />
            </FormField>
          </div>

          <div style={{ marginTop: '20px' }}>
            <FormField label="Personal Quote / Tagline">
              <input
                type="text"
                className="form-input"
                placeholder='e.g. "Architecting Resilience for Global Enterprises."'
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
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
              Publish profile immediately
            </label>

            <button type="submit" disabled={loading} className="btn btn-primary">
              <Save size={16} />
              <span>{loading ? 'Saving...' : 'Create Team Member'}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
