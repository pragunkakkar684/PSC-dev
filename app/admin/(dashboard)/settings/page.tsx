'use client';

import { useState, useEffect } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { PageHeader } from '../components/PageHeader';
import { FormField } from '../components/FormField';
import { LoadingState } from '../components/LoadingState';
import { getSiteSettings, updateSiteSettingsAction } from './actions';
import type { SiteSettings } from '@/lib/db/schema';
import { Save, Check, ShieldCheck, Lock } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<Partial<SiteSettings>>({
    siteName: 'PSC Global',
    tagline: '',
    footerDescription: '',
    copyrightText: '',
    contactEmailGeneral: '',
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings();
        if (data) {
          setFormData(data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load site settings. Admin privileges required.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updated = await updateSiteSettingsAction(formData);
      setFormData(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update site settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader title="Site Settings" />
        <LoadingState message="Loading global settings..." />
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Global Site Settings" />

      <div className="admin-content">
        <PageHeader
          title="Global Site Settings"
          description="Configure firm brand identity, footer summary texts, copyright disclosures, and primary contact email."
        />

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', color: '#f87171', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.1)', color: '#34d399', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Check size={16} />
            <span>Global site settings saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border)', color: '#60a5fa', fontSize: '14px', fontWeight: 600 }}>
            <ShieldCheck size={18} />
            <span>Administrator Restricted Configuration</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <FormField label="Site Name" required>
              <input
                type="text"
                required
                className="form-input"
                value={formData.siteName || ''}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              />
            </FormField>

            <FormField label="General Contact Email">
              <input
                type="email"
                className="form-input"
                placeholder="contact@pscglobal.com"
                value={formData.contactEmailGeneral || ''}
                onChange={(e) => setFormData({ ...formData, contactEmailGeneral: e.target.value })}
              />
            </FormField>
          </div>

          <div style={{ marginTop: '20px' }}>
            <FormField label="Brand Tagline / Mission Statement">
              <input
                type="text"
                className="form-input"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              />
            </FormField>
          </div>

          <div style={{ marginTop: '20px' }}>
            <FormField label="Footer Overview Description">
              <textarea
                rows={3}
                className="form-input"
                value={formData.footerDescription || ''}
                onChange={(e) => setFormData({ ...formData, footerDescription: e.target.value })}
              />
            </FormField>
          </div>

          <div style={{ marginTop: '20px' }}>
            <FormField label="Copyright Notice">
              <input
                type="text"
                className="form-input"
                value={formData.copyrightText || ''}
                onChange={(e) => setFormData({ ...formData, copyrightText: e.target.value })}
              />
            </FormField>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <button type="submit" disabled={saving} className="btn btn-primary">
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Global Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
