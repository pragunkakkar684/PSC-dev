'use client';

import { useState, useEffect, useTransition } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { PageHeader } from '../components/PageHeader';
import { FormField } from '../components/FormField';
import { ImageUploadInput } from '../components/ImageUploadInput';
import { LoadingState } from '../components/LoadingState';
import { getHeroSections, updateHeroSectionAction } from './actions';
import type { HeroSection } from '@/lib/db/schema';
import { Layout, Save, Check } from 'lucide-react';

export default function PagesCMSPage() {
  const [heroes, setHeroes] = useState<HeroSection[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<Partial<HeroSection>>({
    eyebrow: '',
    heading: '',
    subheading: '',
    imageUrl: '',
    cta1Text: '',
    cta1Href: '',
    cta2Text: '',
    cta2Href: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getHeroSections();
      setHeroes(data);
      const active = data.find((h) => h.pageSlug === selectedSlug) || data[0];
      if (active) {
        setFormData(active);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectPage = (slug: string) => {
    setSelectedSlug(slug);
    setError(null);
    setSuccess(false);
    const active = heroes.find((h) => h.pageSlug === slug);
    if (active) {
      setFormData(active);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updated = await updateHeroSectionAction(selectedSlug, formData);
      setSuccess(true);
      setHeroes(heroes.map((h) => (h.pageSlug === selectedSlug ? updated : h)));
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save page hero');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader title="Page Heroes" />
        <LoadingState message="Loading page heroes..." />
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Page Content CMS" />

      <div className="admin-content">
        <PageHeader
          title="Page Heroes Management"
          description="Edit hero headings, sub-headings, Cloudinary hero images, and call-to-action buttons for key site pages."
        />

        {/* Page Selector Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', padding: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
          {heroes.map((h) => {
            const isSelected = selectedSlug === h.pageSlug;
            return (
              <button
                key={h.pageSlug}
                type="button"
                onClick={() => handleSelectPage(h.pageSlug)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  background: isSelected ? 'rgba(59,130,246,0.15)' : 'transparent',
                  color: isSelected ? '#60a5fa' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                <Layout size={14} />
                <span>{h.pageSlug.replace('-', ' ')}</span>
              </button>
            );
          })}
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', color: '#f87171', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.1)', color: '#34d399', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Check size={16} />
            <span>Hero section for &quot;{selectedSlug}&quot; saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
          <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#60a5fa' }}>
            Hero Banner Settings: {selectedSlug.toUpperCase()} PAGE
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <FormField label="Eyebrow Text" hint="Small label above heading e.g. GLOBAL ADVISORY">
              <input
                type="text"
                className="form-input"
                value={formData.eyebrow || ''}
                onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
              />
            </FormField>

            <FormField label="Hero Heading">
              <input
                type="text"
                className="form-input"
                value={formData.heading || ''}
                onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
              />
            </FormField>
          </div>

          <div style={{ marginTop: '20px' }}>
            <FormField label="Hero Subheading / Tagline">
              <textarea
                rows={3}
                className="form-input"
                value={formData.subheading || ''}
                onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
              />
            </FormField>
          </div>

          <div style={{ marginTop: '20px' }}>
            <FormField label="Hero Image (Cloudinary)">
              <ImageUploadInput
                value={formData.imageUrl || ''}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                folder="psc-global/pages"
                label="Upload Hero Background Image"
              />
            </FormField>
          </div>

          {/* CTA Buttons Config */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>Call to Action (CTA) Buttons</h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px' }}>
                <h5 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px' }}>Primary Button (CTA 1)</h5>
                <FormField label="Button Text">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. SCHEDULE A DISCUSSION"
                    value={formData.cta1Text || ''}
                    onChange={(e) => setFormData({ ...formData, cta1Text: e.target.value })}
                  />
                </FormField>
                <FormField label="Button Href / Link">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. /contact or #contact"
                    value={formData.cta1Href || ''}
                    onChange={(e) => setFormData({ ...formData, cta1Href: e.target.value })}
                  />
                </FormField>
              </div>

              <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px' }}>
                <h5 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px' }}>Secondary Button (CTA 2)</h5>
                <FormField label="Button Text">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. BOOK A CONSULTATION"
                    value={formData.cta2Text || ''}
                    onChange={(e) => setFormData({ ...formData, cta2Text: e.target.value })}
                  />
                </FormField>
                <FormField label="Button Href / Link">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. /contact"
                    value={formData.cta2Href || ''}
                    onChange={(e) => setFormData({ ...formData, cta2Href: e.target.value })}
                  />
                </FormField>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="submit" disabled={saving} className="btn btn-primary">
              <Save size={16} />
              <span>{saving ? 'Saving...' : `Save ${selectedSlug.toUpperCase()} Hero`}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
