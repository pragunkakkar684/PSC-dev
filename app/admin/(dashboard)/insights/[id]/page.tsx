'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../components/AdminHeader';
import { PageHeader } from '../../components/PageHeader';
import { FormField } from '../../components/FormField';
import { ImageUploadInput } from '../../components/ImageUploadInput';
import { LoadingState } from '../../components/LoadingState';
import {
  getInsightById,
  updateInsightAction,
} from '../actions';
import { getTeamMembers } from '../../team/actions';
import type { TeamMember } from '@/lib/db/schema';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditInsightPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const insightId = parseInt(id, 10);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [teamList, setTeamList] = useState<TeamMember[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    contentType: 'article',
    tag: 'TAX POLICY',
    summary: '',
    body: '',
    imageUrl: '',
    fileUrl: '',
    readTimeMins: 5,
    authorityTag: '',
    courtName: '',
    publishedAt: '',
    isFeatured: false,
    isPublished: false,
    authorId: null as number | null,
  });

  useEffect(() => {
    async function load() {
      try {
        const [insightData, teamsData] = await Promise.all([
          getInsightById(insightId),
          getTeamMembers(),
        ]);

        if (!insightData) {
          setError('Insight not found');
          return;
        }

        setTeamList(teamsData);

        const pubDateStr = insightData.publishedAt
          ? new Date(insightData.publishedAt).toISOString().split('T')[0]
          : '';

        setFormData({
          title: insightData.title || '',
          slug: insightData.slug || '',
          contentType: insightData.contentType || 'article',
          tag: insightData.tag || '',
          summary: insightData.summary || '',
          body: insightData.body || '',
          imageUrl: insightData.imageUrl || '',
          fileUrl: insightData.fileUrl || '',
          readTimeMins: insightData.readTimeMins || 5,
          authorityTag: insightData.authorityTag || '',
          courtName: insightData.courtName || '',
          publishedAt: pubDateStr,
          isFeatured: insightData.isFeatured || false,
          isPublished: insightData.isPublished || false,
          authorId: insightData.authorId || null,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load insight');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [insightId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateInsightAction(insightId, formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update insight');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader title="Edit Insight" />
        <LoadingState message="Loading article..." />
      </>
    );
  }

  return (
    <>
      <AdminHeader title={`Edit: ${formData.title}`} />

      <div className="admin-content">
        <PageHeader
          title={`Edit ${formData.title}`}
          description="Update article content, metadata, author assignment, cover image, and research PDF."
          actions={
            <Link href="/admin/insights" className="btn btn-secondary">
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
            ✓ Insight article saved successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <FormField label="Article Title" required>
              <input
                type="text"
                required
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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

            <FormField label="Content Type">
              <select
                className="form-input"
                value={formData.contentType}
                onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
              >
                <option value="article">Article</option>
                <option value="regulatory_update">Regulatory Update</option>
                <option value="judgement">Court Judgement</option>
                <option value="research">Research Publication</option>
                <option value="webinar">Webinar Summary</option>
              </select>
            </FormField>

            <FormField label="Topic / Tag">
              <input
                type="text"
                className="form-input"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              />
            </FormField>

            <FormField label="Author">
              <select
                className="form-input"
                value={formData.authorId ?? ''}
                onChange={(e) => setFormData({ ...formData, authorId: e.target.value ? parseInt(e.target.value, 10) : null })}
              >
                <option value="">Firm Editorial Team</option>
                {teamList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.roleTitle || 'Team Member'})
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Read Time (Minutes)">
              <input
                type="number"
                className="form-input"
                value={formData.readTimeMins}
                onChange={(e) => setFormData({ ...formData, readTimeMins: parseInt(e.target.value, 10) || 5 })}
              />
            </FormField>

            {/* Conditional Field: Authority Tag for Regulatory Updates */}
            {formData.contentType === 'regulatory_update' && (
              <FormField label="Regulatory Authority (Authority Tag)">
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. SEBI / RBI / GST / OECD"
                  value={formData.authorityTag}
                  onChange={(e) => setFormData({ ...formData, authorityTag: e.target.value })}
                />
              </FormField>
            )}

            {/* Conditional Field: Court Name for Judgements */}
            {formData.contentType === 'judgement' && (
              <FormField label="Court Name">
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Supreme Court of India / High Court"
                  value={formData.courtName}
                  onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
                />
              </FormField>
            )}

            <FormField label="Publication Date">
              <input
                type="date"
                className="form-input"
                value={formData.publishedAt}
                onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
              />
            </FormField>
          </div>

          <div style={{ marginTop: '20px' }}>
            <FormField label="Short Summary / Excerpt">
              <textarea
                rows={3}
                className="form-input"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              />
            </FormField>
          </div>

          <div style={{ marginTop: '20px' }}>
            <FormField label="Full Body Content (Markdown / Text)">
              <textarea
                rows={12}
                className="form-input"
                style={{ fontFamily: 'monospace', fontSize: '13px' }}
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              />
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
            <FormField label="Cover Image (Cloudinary)">
              <ImageUploadInput
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                folder="psc-global/insights"
                label="Upload Article Cover Image"
              />
            </FormField>

            <FormField label="Research / Document PDF (Cloudinary)">
              <ImageUploadInput
                value={formData.fileUrl}
                onChange={(url) => setFormData({ ...formData, fileUrl: url })}
                folder="psc-global/documents"
                label="Upload Research PDF"
                accept="application/pdf"
                isDocument
              />
            </FormField>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              />
              Featured Article
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              />
              Published
            </label>

            <button type="submit" disabled={saving} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Article Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
