'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminHeader } from '../../components/AdminHeader';
import { PageHeader } from '../../components/PageHeader';
import { FormField } from '../../components/FormField';
import { ImageUploadInput } from '../../components/ImageUploadInput';
import { createEventAction } from '../actions';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    eventType: 'WEBINAR',
    description: '',
    date: '',
    timeStart: '',
    timeEnd: '',
    timezone: 'GMT',
    location: 'VIRTUAL',
    platform: 'MICROSOFT TEAMS',
    durationLabel: '90 MINS',
    registrationUrl: '',
    agendaFileUrl: '',
    imageUrl: '',
    isFeatured: false,
    isHighlighted: false,
    isPublished: false,
    status: 'upcoming',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const created = await createEventAction(formData);
      router.push(`/admin/events/${created.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="Create Event" />

      <div className="admin-content">
        <PageHeader
          title="Create New Event"
          description="Schedule a webinar, seminar, conference, or roundtable."
          actions={
            <Link href="/admin/events" className="btn btn-secondary">
              <ArrowLeft size={16} />
              <span>Back to Events</span>
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
            <FormField label="Event Title" required>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Cross-Border Tax Strategies for 2025"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </FormField>

            <FormField label="URL Slug" hint="Auto-generated if left blank">
              <input
                type="text"
                className="form-input"
                placeholder="e.g. cross-border-tax-2025"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </FormField>

            <FormField label="Event Format">
              <select
                className="form-input"
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              >
                <option value="WEBINAR">Webinar</option>
                <option value="SEMINAR">Seminar</option>
                <option value="ROUNDTABLE">Roundtable</option>
                <option value="CONFERENCE">Conference</option>
              </select>
            </FormField>

            <FormField label="Event Status">
              <select
                className="form-input"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="upcoming">Upcoming</option>
                <option value="past">Past / Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </FormField>

            <FormField label="Event Date">
              <input
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </FormField>

            <FormField label="Start Time">
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 10:00 AM"
                value={formData.timeStart}
                onChange={(e) => setFormData({ ...formData, timeStart: e.target.value })}
              />
            </FormField>

            <FormField label="Timezone">
              <input
                type="text"
                className="form-input"
                placeholder="e.g. GMT or EST"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              />
            </FormField>

            <FormField label="Duration Label">
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 90 MINS or 2 HOURS"
                value={formData.durationLabel}
                onChange={(e) => setFormData({ ...formData, durationLabel: e.target.value })}
              />
            </FormField>

            <FormField label="Location / Venue">
              <input
                type="text"
                className="form-input"
                placeholder="e.g. VIRTUAL or LONDON, UK"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </FormField>

            <FormField label="Platform / System">
              <input
                type="text"
                className="form-input"
                placeholder="e.g. MICROSOFT TEAMS"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              />
            </FormField>

            <FormField label="Registration URL">
              <input
                type="url"
                className="form-input"
                placeholder="https://..."
                value={formData.registrationUrl}
                onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
              />
            </FormField>
          </div>

          <div style={{ marginTop: '20px' }}>
            <FormField label="Event Summary / Description">
              <textarea
                rows={3}
                className="form-input"
                placeholder="Overview of agenda topics and key takeaways..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
            <FormField label="Cover Image (Cloudinary)">
              <ImageUploadInput
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                folder="psc-global/events"
                label="Upload Event Banner Image"
              />
            </FormField>

            <FormField label="Agenda PDF Document (Cloudinary)">
              <ImageUploadInput
                value={formData.agendaFileUrl}
                onChange={(url) => setFormData({ ...formData, agendaFileUrl: url })}
                folder="psc-global/documents"
                label="Upload Agenda PDF"
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
              Show as Featured Event on Header & Homepage
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              />
              Publish event immediately
            </label>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
              <Save size={16} />
              <span>{loading ? 'Saving...' : 'Create Event'}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
