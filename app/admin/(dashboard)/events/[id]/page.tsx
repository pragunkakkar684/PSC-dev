'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../components/AdminHeader';
import { PageHeader } from '../../components/PageHeader';
import { FormField } from '../../components/FormField';
import { ImageUploadInput } from '../../components/ImageUploadInput';
import { LoadingState } from '../../components/LoadingState';
import {
  getEventById,
  updateEventAction,
  saveEventAgendaAction,
  saveEventSpeakersAction,
} from '../actions';
import { getTeamMembers } from '../../team/actions';
import type { TeamMember } from '@/lib/db/schema';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

interface AgendaItem {
  id?: number;
  timeLabel: string;
  title: string;
  description: string;
  isCurrent: boolean;
}

interface SpeakerItem {
  id?: number;
  teamMemberId: number | null;
  externalSpeakerName: string;
  externalSpeakerRole: string;
  externalSpeakerImageUrl: string;
}

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const eventId = parseInt(id, 10);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [teamList, setTeamList] = useState<TeamMember[]>([]);

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

  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [speakerItems, setSpeakerItems] = useState<SpeakerItem[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [eventData, teamsData] = await Promise.all([
          getEventById(eventId),
          getTeamMembers(),
        ]);

        if (!eventData) {
          setError('Event not found');
          return;
        }

        setTeamList(teamsData);

        setFormData({
          title: eventData.title || '',
          slug: eventData.slug || '',
          eventType: eventData.eventType || 'WEBINAR',
          description: eventData.description || '',
          date: eventData.date || '',
          timeStart: eventData.timeStart || '',
          timeEnd: eventData.timeEnd || '',
          timezone: eventData.timezone || 'GMT',
          location: eventData.location || 'VIRTUAL',
          platform: eventData.platform || 'MICROSOFT TEAMS',
          durationLabel: eventData.durationLabel || '90 MINS',
          registrationUrl: eventData.registrationUrl || '',
          agendaFileUrl: eventData.agendaFileUrl || '',
          imageUrl: eventData.imageUrl || '',
          isFeatured: eventData.isFeatured || false,
          isHighlighted: eventData.isHighlighted || false,
          isPublished: eventData.isPublished || false,
          status: eventData.status || 'upcoming',
        });

        if (eventData.agenda) {
          setAgendaItems(
            eventData.agenda.map((a) => ({
              id: a.id,
              timeLabel: a.timeLabel || '',
              title: a.title,
              description: a.description || '',
              isCurrent: a.isCurrent || false,
            }))
          );
        }

        if (eventData.speakers) {
          setSpeakerItems(
            eventData.speakers.map((s) => ({
              id: s.id,
              teamMemberId: s.teamMemberId,
              externalSpeakerName: s.externalSpeakerName || '',
              externalSpeakerRole: s.externalSpeakerRole || '',
              externalSpeakerImageUrl: s.externalSpeakerImageUrl || '',
            }))
          );
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateEventAction(eventId, formData);
      await saveEventAgendaAction(eventId, agendaItems);
      await saveEventSpeakersAction(eventId, speakerItems);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  // Agenda handlers
  const addAgendaItem = () => {
    setAgendaItems([
      ...agendaItems,
      { timeLabel: '10:00 AM', title: '', description: '', isCurrent: false },
    ]);
  };
  const removeAgendaItem = (idx: number) => {
    setAgendaItems(agendaItems.filter((_, i) => i !== idx));
  };
  const updateAgendaItem = (idx: number, field: keyof AgendaItem, val: any) => {
    const updated = [...agendaItems];
    updated[idx] = { ...updated[idx], [field]: val };
    setAgendaItems(updated);
  };

  // Speaker handlers
  const addSpeakerItem = () => {
    setSpeakerItems([
      ...speakerItems,
      { teamMemberId: null, externalSpeakerName: '', externalSpeakerRole: '', externalSpeakerImageUrl: '' },
    ]);
  };
  const removeSpeakerItem = (idx: number) => {
    setSpeakerItems(speakerItems.filter((_, i) => i !== idx));
  };
  const updateSpeakerItem = (idx: number, field: keyof SpeakerItem, val: any) => {
    const updated = [...speakerItems];
    updated[idx] = { ...updated[idx], [field]: val };
    setSpeakerItems(updated);
  };

  if (loading) {
    return (
      <>
        <AdminHeader title="Edit Event" />
        <LoadingState message="Loading event details..." />
      </>
    );
  }

  return (
    <>
      <AdminHeader title={`Edit: ${formData.title}`} />

      <div className="admin-content">
        <PageHeader
          title={`Edit ${formData.title}`}
          description="Update event schedule, registration links, Cloudinary banners, agenda, and speakers."
          actions={
            <Link href="/admin/events" className="btn btn-secondary">
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
            ✓ Event details, agenda items, and speaker assignments saved successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* General Fields */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Event General Information</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <FormField label="Event Title" required>
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
                  value={formData.timeStart}
                  onChange={(e) => setFormData({ ...formData, timeStart: e.target.value })}
                />
              </FormField>

              <FormField label="Timezone">
                <input
                  type="text"
                  className="form-input"
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                />
              </FormField>

              <FormField label="Duration Label">
                <input
                  type="text"
                  className="form-input"
                  value={formData.durationLabel}
                  onChange={(e) => setFormData({ ...formData, durationLabel: e.target.value })}
                />
              </FormField>

              <FormField label="Location / Venue">
                <input
                  type="text"
                  className="form-input"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </FormField>

              <FormField label="Platform">
                <input
                  type="text"
                  className="form-input"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                />
              </FormField>

              <FormField label="Registration URL">
                <input
                  type="url"
                  className="form-input"
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
          </div>

          {/* Agenda Items List */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Event Agenda Items</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Breakdown of sessions, times, and topics.</p>
              </div>
              <button type="button" onClick={addAgendaItem} className="btn btn-secondary">
                <Plus size={15} /> Add Agenda Session
              </button>
            </div>

            {agendaItems.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', border: '1px dashed var(--border)', borderRadius: '8px' }}>
                No agenda sessions added yet. Click &quot;Add Agenda Session&quot; above.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {agendaItems.map((item, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Session #{idx + 1}
                      </span>
                      <button type="button" onClick={() => removeAgendaItem(idx)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px' }}>
                      <FormField label="Time Label">
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. 10:00 AM"
                          value={item.timeLabel}
                          onChange={(e) => updateAgendaItem(idx, 'timeLabel', e.target.value)}
                        />
                      </FormField>
                      <FormField label="Session Title">
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="e.g. KEYNOTE: Macroeconomic Context"
                          value={item.title}
                          onChange={(e) => updateAgendaItem(idx, 'title', e.target.value)}
                        />
                      </FormField>
                    </div>
                    <FormField label="Description">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Brief summary of discussion topic..."
                        value={item.description}
                        onChange={(e) => updateAgendaItem(idx, 'description', e.target.value)}
                      />
                    </FormField>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Speakers List */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Event Speakers</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Assign internal team members or add external guest speakers.</p>
              </div>
              <button type="button" onClick={addSpeakerItem} className="btn btn-secondary">
                <Plus size={15} /> Add Speaker
              </button>
            </div>

            {speakerItems.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', border: '1px dashed var(--border)', borderRadius: '8px' }}>
                No speakers assigned yet. Click &quot;Add Speaker&quot; above.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {speakerItems.map((s, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Speaker #{idx + 1}
                      </span>
                      <button type="button" onClick={() => removeSpeakerItem(idx)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <FormField label="Internal Team Member">
                      <select
                        className="form-input"
                        value={s.teamMemberId ?? ''}
                        onChange={(e) => updateSpeakerItem(idx, 'teamMemberId', e.target.value ? parseInt(e.target.value, 10) : null)}
                      >
                        <option value="">-- Or External Speaker Below --</option>
                        {teamList.map((tm) => (
                          <option key={tm.id} value={tm.id}>
                            {tm.name} ({tm.roleTitle || 'Team Member'})
                          </option>
                        ))}
                      </select>
                    </FormField>

                    {!s.teamMemberId && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                        <FormField label="External Speaker Name">
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. Dr. Aris Thorne"
                            value={s.externalSpeakerName}
                            onChange={(e) => updateSpeakerItem(idx, 'externalSpeakerName', e.target.value)}
                          />
                        </FormField>
                        <FormField label="External Speaker Role">
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. Chief Economist, ECB"
                            value={s.externalSpeakerRole}
                            onChange={(e) => updateSpeakerItem(idx, 'externalSpeakerRole', e.target.value)}
                          />
                        </FormField>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Submit Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                />
                Featured Event
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                />
                Published
              </label>
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary">
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Event Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
