'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminHeader } from '../../components/AdminHeader';
import { PageHeader } from '../../components/PageHeader';
import { FormField } from '../../components/FormField';
import { ImageUploadInput } from '../../components/ImageUploadInput';
import { IconPicker } from '../../components/IconPicker';
import { LoadingState } from '../../components/LoadingState';
import {
  getTeamMemberById,
  updateTeamMemberAction,
  saveExpertiseAction,
} from '../actions';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

interface ExpertiseItem {
  id?: number;
  iconName: string;
  title: string;
  description: string;
}

export default function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const memberId = parseInt(id, 10);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  const [expertiseList, setExpertiseList] = useState<ExpertiseItem[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTeamMemberById(memberId);
        if (!data) {
          setError('Team member not found');
          return;
        }
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          roleTitle: data.roleTitle || '',
          category: data.category || 'partner',
          focusArea: data.focusArea || '',
          location: data.location || '',
          email: data.email || '',
          yearsExperience: data.yearsExperience || '',
          shortBio: data.shortBio || '',
          quote: data.quote || '',
          imageUrl: data.imageUrl || '',
          sortOrder: data.sortOrder || 0,
          isPublished: data.isPublished || false,
        });

        if (data.expertise) {
          setExpertiseList(
            data.expertise.map((item) => ({
              id: item.id,
              iconName: item.iconName || 'Landmark',
              title: item.title,
              description: item.description || '',
            }))
          );
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load team member');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [memberId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateTeamMemberAction(memberId, formData);
      await saveExpertiseAction(memberId, expertiseList);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update team member');
    } finally {
      setSaving(false);
    }
  };

  const addExpertiseItem = () => {
    setExpertiseList([
      ...expertiseList,
      { iconName: 'Landmark', title: '', description: '' },
    ]);
  };

  const removeExpertiseItem = (index: number) => {
    setExpertiseList(expertiseList.filter((_, i) => i !== index));
  };

  const updateExpertiseItem = (index: number, field: keyof ExpertiseItem, val: string) => {
    const updated = [...expertiseList];
    updated[index] = { ...updated[index], [field]: val };
    setExpertiseList(updated);
  };

  if (loading) {
    return (
      <>
        <AdminHeader title="Edit Team Member" />
        <LoadingState message="Loading profile..." />
      </>
    );
  }

  return (
    <>
      <AdminHeader title={`Edit: ${formData.name}`} />

      <div className="admin-content">
        <PageHeader
          title={`Edit ${formData.name}`}
          description="Update profile details, category, Cloudinary photo, and key areas of expertise."
          actions={
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href="/admin/team" className="btn btn-secondary">
                <ArrowLeft size={16} />
                <span>Back</span>
              </Link>
              {formData.slug && (
                <a
                  href={`/partner/${formData.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                >
                  Preview Profile ↗
                </a>
              )}
            </div>
          }
        />

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', color: '#f87171', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.1)', color: '#34d399', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
            ✓ Team member and areas of expertise saved successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Main Info */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Profile General Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <FormField label="Full Name" required>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </FormField>

              <FormField label="URL Slug" hint="Unique URL parameter e.g. julian-vance">
                <input
                  type="text"
                  className="form-input"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </FormField>

              <FormField label="Role Title">
                <input
                  type="text"
                  className="form-input"
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
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </FormField>

              <FormField label="Email Address">
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </FormField>

              <FormField label="Years Experience">
                <input
                  type="text"
                  className="form-input"
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                />
              </FormField>

              <FormField label="Focus Area">
                <input
                  type="text"
                  className="form-input"
                  value={formData.focusArea}
                  onChange={(e) => setFormData({ ...formData, focusArea: e.target.value })}
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
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                />
              </FormField>
            </div>
          </div>

          {/* Areas of Expertise Sub-Items */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Areas of Expertise</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Specialized services shown on individual partner profile pages.</p>
              </div>
              <button type="button" onClick={addExpertiseItem} className="btn btn-secondary">
                <Plus size={15} /> Add Expertise Area
              </button>
            </div>

            {expertiseList.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', border: '1px dashed var(--border)', borderRadius: '8px' }}>
                No expertise items added yet. Click &quot;Add Expertise Area&quot; above.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {expertiseList.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-base)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Area #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeExpertiseItem(idx)}
                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '12px' }}>
                      <FormField label="Title">
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="e.g. Corporate Law"
                          value={item.title}
                          onChange={(e) => updateExpertiseItem(idx, 'title', e.target.value)}
                        />
                      </FormField>

                      <FormField label="Description">
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Structuring sophisticated multinational entities..."
                          value={item.description}
                          onChange={(e) => updateExpertiseItem(idx, 'description', e.target.value)}
                        />
                      </FormField>
                    </div>

                    <FormField label="Icon">
                      <IconPicker
                        value={item.iconName}
                        onChange={(iconName) => updateExpertiseItem(idx, 'iconName', iconName)}
                      />
                    </FormField>
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
              <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
