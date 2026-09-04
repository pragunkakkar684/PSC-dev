'use client';

import { useState } from 'react';
import { PageHeader } from './PageHeader';
import { FormField } from './FormField';
import { updatePageSEO } from '@/app/actions/cmsActions';
import type { PageSeo } from '@/lib/db/schema';
import { Search, Globe, Share2, Eye, Save, Check } from 'lucide-react';

interface SEOEditorProps {
  targetType: string; // 'page' | 'event' | 'insight' | 'practice_area' | 'industry'
  targetIdentifier: string; // e.g. 'about', 'career', 'gcc', 'navigating-indias-regulatory'
  initialSEO?: Partial<PageSeo> | null;
  defaultTitle?: string;
  defaultDescription?: string;
}

export function SEOEditor({
  targetType,
  targetIdentifier,
  initialSEO,
  defaultTitle = 'PSC Global — Strategic Business & Tax Advisory',
  defaultDescription = 'Cross-border corporate tax, legal advisory, and GCC operations expertise.',
}: SEOEditorProps) {
  const [formData, setFormData] = useState<Partial<PageSeo>>({
    metaTitle: initialSEO?.metaTitle || defaultTitle,
    metaDescription: initialSEO?.metaDescription || defaultDescription,
    canonicalUrl: initialSEO?.canonicalUrl || `https://pscglobal.com/${targetIdentifier === 'home' ? '' : targetIdentifier}`,
    ogTitle: initialSEO?.ogTitle || initialSEO?.metaTitle || defaultTitle,
    ogDescription: initialSEO?.ogDescription || initialSEO?.metaDescription || defaultDescription,
    ogImage: initialSEO?.ogImage || '',
    robots: initialSEO?.robots || 'index, follow',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updatePageSEO(targetType, targetIdentifier, formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update SEO configuration');
    } finally {
      setSaving(false);
    }
  };

  const previewTitle = formData.metaTitle || defaultTitle;
  const previewDesc = formData.metaDescription || defaultDescription;
  const previewUrl = formData.canonicalUrl || `https://pscglobal.com/${targetIdentifier}`;

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      <PageHeader
        title="SEO & Search Visibility"
        description={`Manage meta titles, descriptions, canonical URLs, Open Graph social share cards, and search engine indexing for ${targetType}:${targetIdentifier}.`}
      />

      {/* Snippet Preview Card */}
      <div
        style={{
          background: 'var(--bg-surface, #13161f)',
          border: '1px solid var(--border, rgba(255,255,255,0.08))',
          borderRadius: '8px',
          padding: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
          <Search size={14} style={{ color: 'var(--accent)' }} />
          Google Search Result Snippet Preview
        </div>

        <div style={{ fontFamily: 'sans-serif', maxWidth: '600px' }}>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={12} className="text-emerald-400" />
            {previewUrl}
          </div>
          <div style={{ fontSize: '17px', fontWeight: 600, color: '#f3f4f6', marginBottom: '6px', lineHeight: 1.3, cursor: 'pointer' }}>
            {previewTitle}
          </div>
          <div style={{ fontSize: '13px', color: '#9ca3af', lineHeight: 1.5 }}>
            {previewDesc.length > 160 ? `${previewDesc.substring(0, 160)}...` : previewDesc}
          </div>
        </div>

        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span>Meta Title: <strong style={{ color: previewTitle.length > 60 ? '#f43f5e' : '#10b981' }}>{previewTitle.length} / 60 chars</strong></span>
          <span>Meta Description: <strong style={{ color: previewDesc.length > 160 ? '#f43f5e' : '#10b981' }}>{previewDesc.length} / 160 chars</strong></span>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '8px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', borderRadius: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={16} /> SEO settings updated and published successfully!
          </div>
        )}

        {/* Basic Metadata */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px', display: 'grid', gap: '16px' }}>
          <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={16} style={{ color: 'var(--accent)' }} /> Basic Search Meta Tags
          </div>

          <FormField
            label="SEO Meta Title"
            hint="Appears in browser tabs and search engine result titles (Optimal: 50-60 characters)"
          >
            <input
              type="text"
              value={formData.metaTitle || ''}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              className="form-input"
              placeholder="e.g. PSC Global — Strategic Business & Tax Advisory"
            />
          </FormField>

          <FormField
            label="Meta Description"
            hint="Short summary shown below title in search results (Optimal: 120-160 characters)"
          >
            <textarea
              rows={3}
              value={formData.metaDescription || ''}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              className="form-textarea"
              placeholder="Enter a compelling summary for search results..."
            />
          </FormField>

          <FormField
            label="Canonical URL"
            hint="Preferred canonical URL for duplicate content prevention"
          >
            <input
              type="text"
              value={formData.canonicalUrl || ''}
              onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
              className="form-input"
              placeholder="https://pscglobal.com/about"
            />
          </FormField>
        </div>

        {/* Open Graph / Social Sharing */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px', display: 'grid', gap: '16px' }}>
          <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Share2 size={16} style={{ color: 'var(--accent)' }} /> Open Graph & Social Cards
          </div>

          <FormField label="OG Title" hint="Title displayed when shared on LinkedIn, Twitter, Facebook">
            <input
              type="text"
              value={formData.ogTitle || ''}
              onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
              className="form-input"
              placeholder="Social share title"
            />
          </FormField>

          <FormField label="OG Description" hint="Description displayed in social link preview cards">
            <textarea
              rows={2}
              value={formData.ogDescription || ''}
              onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
              className="form-textarea"
              placeholder="Social share description"
            />
          </FormField>

          <FormField label="Social Banner Image URL" hint="Image displayed in link previews (Recommended: 1200x630px)">
            <input
              type="text"
              value={formData.ogImage || ''}
              onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
              className="form-input"
              placeholder="https://res.cloudinary.com/.../og-banner.jpg"
            />
          </FormField>
        </div>

        {/* Search Engine Indexing Controls */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px', display: 'grid', gap: '16px' }}>
          <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={16} style={{ color: 'var(--accent)' }} /> Search Engine Robots Directives
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-primary)' }}>
              <input
                type="checkbox"
                checked={formData.robots?.includes('noindex') || false}
                onChange={(e) => {
                  const noFollow = formData.robots?.includes('nofollow');
                  const newRobots = `${e.target.checked ? 'noindex' : 'index'}, ${noFollow ? 'nofollow' : 'follow'}`;
                  setFormData({ ...formData, robots: newRobots });
                }}
                style={{ width: '16px', height: '16px', accentColor: '#c59b27' }}
              />
              <strong>noindex</strong> (Hide this page from Google search results)
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-primary)' }}>
              <input
                type="checkbox"
                checked={formData.robots?.includes('nofollow') || false}
                onChange={(e) => {
                  const noIndex = formData.robots?.includes('noindex');
                  const newRobots = `${noIndex ? 'noindex' : 'index'}, ${e.target.checked ? 'nofollow' : 'follow'}`;
                  setFormData({ ...formData, robots: newRobots });
                }}
                style={{ width: '16px', height: '16px', accentColor: '#c59b27' }}
              />
              <strong>nofollow</strong> (Instruct robots not to follow links on this page)
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="admin-button primary"
          style={{ width: 'fit-content', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Save size={16} />
          {saving ? 'Saving SEO Settings...' : 'Save & Publish SEO Metadata'}
        </button>
      </form>
    </div>
  );
}
