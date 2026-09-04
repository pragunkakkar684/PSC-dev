'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../components/AdminHeader';
import { PageHeader } from '../../components/PageHeader';
import { FormField } from '../../components/FormField';
import { ImageUploadInput } from '../../components/ImageUploadInput';
import { LoadingState } from '../../components/LoadingState';
import { SEOEditor } from '../../components/SEOEditor';
import {
  getIndustryWithRelations,
  updateIndustryAction,
  createIndustryChallengeAction,
  deleteIndustryChallengeAction,
  createIndustrySolutionAction,
  deleteIndustrySolutionAction,
  addIndustryPracticeAreaAction,
  removeIndustryPracticeAreaAction,
} from '../actions';
import { getPracticeAreas } from '../../practice-areas/actions';
import { ArrowLeft, Save, Plus, Trash2, Layers, Building2, HelpCircle } from 'lucide-react';

type Tab = 'CONTENT' | 'CHALLENGES' | 'SOLUTIONS' | 'PRACTICE_AREAS' | 'SEO' | 'SETTINGS';

export default function EditIndustryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const indId = parseInt(id, 10);

  const [activeTab, setActiveTab] = useState<Tab>('CONTENT');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [industryData, setIndustryData] = useState<any>(null);
  const [availablePracticeAreas, setAvailablePracticeAreas] = useState<any[]>([]);

  // Challenge modal / form
  const [newChallenge, setNewChallenge] = useState({ number: '01.', title: '', description: '' });
  const [addingChallenge, setAddingChallenge] = useState(false);

  // Solution modal / form
  const [newSolution, setNewSolution] = useState({ label: 'NAVIGATE', description: '' });
  const [addingSolution, setAddingSolution] = useState(false);

  // Practice area select
  const [selectedPaId, setSelectedPaId] = useState<number | ''>('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [data, pas] = await Promise.all([
        getIndustryWithRelations(indId),
        getPracticeAreas(),
      ]);

      if (!data) {
        setError('Industry not found');
        return;
      }

      setIndustryData(data);
      setAvailablePracticeAreas(pas);
    } catch (err: any) {
      setError(err.message || 'Failed to load industry data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [indId]);

  const handleFieldChange = (field: string, value: any) => {
    setIndustryData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateIndustryAction(indId, {
        name: industryData.name,
        slug: industryData.slug,
        shortDescription: industryData.shortDescription,
        imageUrl: industryData.imageUrl,
        sortOrder: industryData.sortOrder,
        isPublished: industryData.isPublished,
        // Hero
        heroEyebrow: industryData.heroEyebrow,
        heroHeading: industryData.heroHeading,
        heroDescription: industryData.heroDescription,
        heroImageUrl: industryData.heroImageUrl,
        heroImageAlt: industryData.heroImageAlt,
        heroCta1Text: industryData.heroCta1Text,
        heroCta1Href: industryData.heroCta1Href,
        heroCta2Text: industryData.heroCta2Text,
        heroCta2Href: industryData.heroCta2Href,
        // Overview
        overviewHeading: industryData.overviewHeading,
        overviewQuote: industryData.overviewQuote,
        overviewBody: industryData.overviewBody,
        overviewBody2: industryData.overviewBody2,
        // Challenges & Solutions intros
        challengesIntro: industryData.challengesIntro,
        solutionsHeading: industryData.solutionsHeading,
        solutionsIntro: industryData.solutionsIntro,
        // Final CTA
        finalCtaHeading: industryData.finalCtaHeading,
        finalCtaDescription: industryData.finalCtaDescription,
        finalCta1Text: industryData.finalCta1Text,
        finalCta1Href: industryData.finalCta1Href,
        finalCta2Text: industryData.finalCta2Text,
        finalCta2Href: industryData.finalCta2Href,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save industry');
    } finally {
      setSaving(false);
    }
  };

  const handleAddChallenge = async () => {
    if (!newChallenge.title) return;
    try {
      setAddingChallenge(true);
      await createIndustryChallengeAction({
        industryId: indId,
        number: newChallenge.number,
        title: newChallenge.title,
        description: newChallenge.description,
        sortOrder: (industryData.challenges?.length || 0) + 1,
      });
      setNewChallenge({ number: '01.', title: '', description: '' });
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to add challenge');
    } finally {
      setAddingChallenge(false);
    }
  };

  const handleDeleteChallenge = async (chId: number) => {
    try {
      await deleteIndustryChallengeAction(chId, indId);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete challenge');
    }
  };

  const handleAddSolution = async () => {
    if (!newSolution.label || !newSolution.description) return;
    try {
      setAddingSolution(true);
      await createIndustrySolutionAction({
        industryId: indId,
        label: newSolution.label,
        description: newSolution.description,
        sortOrder: (industryData.solutions?.length || 0) + 1,
      });
      setNewSolution({ label: 'NAVIGATE', description: '' });
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to add solution');
    } finally {
      setAddingSolution(false);
    }
  };

  const handleDeleteSolution = async (solId: number) => {
    try {
      await deleteIndustrySolutionAction(solId, indId);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete solution');
    }
  };

  const handleAddPracticeArea = async () => {
    if (!selectedPaId) return;
    try {
      await addIndustryPracticeAreaAction(indId, Number(selectedPaId));
      setSelectedPaId('');
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to link practice area');
    }
  };

  const handleRemovePracticeArea = async (linkId: number) => {
    try {
      await removeIndustryPracticeAreaAction(linkId, indId);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to remove practice area link');
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader title="Edit Industry" />
        <LoadingState message="Loading industry CMS data..." />
      </>
    );
  }

  if (error && !industryData) {
    return (
      <>
        <AdminHeader title="Edit Industry" />
        <div style={{ padding: '24px' }}>
          <div style={{ padding: '16px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '8px' }}>
            {error}
          </div>
          <Link href="/admin/industries" style={{ display: 'inline-block', marginTop: '16px', color: '#3b82f6' }}>
            Back to Industries
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title={`Edit Industry: ${industryData.name}`} />

      <div style={{ padding: '24px', maxWidth: '1200px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Link
            href="/admin/industries"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-secondary, #94a3b8)',
              textDecoration: 'none',
              fontSize: '13px',
            }}
          >
            <ArrowLeft size={16} /> Back to Industries
          </Link>
        </div>

        <PageHeader
          title={industryData.name}
          description={`Route: /industries/${industryData.slug}`}
          actions={
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link
                href={`/industries/${industryData.slug}`}
                target="_blank"
                style={{
                  padding: '8px 16px',
                  background: 'var(--bg-elevated, #21253a)',
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '13px',
                }}
              >
                View Live Page ↗
              </Link>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '8px 16px',
                  background: 'var(--accent, #3b82f6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Save size={16} /> {saving ? 'Saving...' : 'Save Industry'}
              </button>
            </div>
          }
        />

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '8px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '8px', marginBottom: '20px' }}>
            Industry saved successfully! Public page revalidated.
          </div>
        )}

        {/* TABS HEADER */}
        <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--border, rgba(255,255,255,0.07))', marginBottom: '24px' }}>
          {(['CONTENT', 'CHALLENGES', 'SOLUTIONS', 'PRACTICE_AREAS', 'SEO', 'SETTINGS'] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 16px',
                background: activeTab === tab ? 'var(--bg-surface, #1a1d27)' : 'transparent',
                color: activeTab === tab ? 'var(--accent, #3b82f6)' : 'var(--text-secondary, #94a3b8)',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--accent, #3b82f6)' : '2px solid transparent',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {tab.replace('_', ' ')}
              {tab === 'CHALLENGES' && ` (${industryData.challenges?.length || 0})`}
              {tab === 'SOLUTIONS' && ` (${industryData.solutions?.length || 0})`}
              {tab === 'PRACTICE_AREAS' && ` (${industryData.practiceAreas?.length || 0})`}
            </button>
          ))}
        </div>

        {/* TAB 1: CONTENT */}
        {activeTab === 'CONTENT' && (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Hero Section</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormField label="Hero Eyebrow">
                  <input
                    type="text"
                    value={industryData.heroEyebrow || ''}
                    onChange={(e) => handleFieldChange('heroEyebrow', e.target.value)}
                    placeholder="INDUSTRIES"
                    style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-base, #0f1117)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
                <FormField label="Hero Heading">
                  <input
                    type="text"
                    value={industryData.heroHeading || ''}
                    onChange={(e) => handleFieldChange('heroHeading', e.target.value)}
                    placeholder="Manufacturing Built Around Your Industry Reality"
                    style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-base, #0f1117)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
              </div>
              <div style={{ marginTop: '16px' }}>
                <FormField label="Hero Description">
                  <textarea
                    rows={3}
                    value={industryData.heroDescription || ''}
                    onChange={(e) => handleFieldChange('heroDescription', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-base, #0f1117)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
              </div>
              <div style={{ marginTop: '16px' }}>
                <ImageUploadInput
                  label="Hero Image URL"
                  value={industryData.heroImageUrl || ''}
                  onChange={(url) => handleFieldChange('heroImageUrl', url)}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginTop: '16px' }}>
                <FormField label="CTA 1 Text">
                  <input type="text" value={industryData.heroCta1Text || ''} onChange={(e) => handleFieldChange('heroCta1Text', e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }} />
                </FormField>
                <FormField label="CTA 1 URL">
                  <input type="text" value={industryData.heroCta1Href || ''} onChange={(e) => handleFieldChange('heroCta1Href', e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }} />
                </FormField>
                <FormField label="CTA 2 Text">
                  <input type="text" value={industryData.heroCta2Text || ''} onChange={(e) => handleFieldChange('heroCta2Text', e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }} />
                </FormField>
                <FormField label="CTA 2 URL">
                  <input type="text" value={industryData.heroCta2Href || ''} onChange={(e) => handleFieldChange('heroCta2Href', e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }} />
                </FormField>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Overview Section</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormField label="Overview Heading">
                  <input type="text" value={industryData.overviewHeading || ''} onChange={(e) => handleFieldChange('overviewHeading', e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }} />
                </FormField>
                <FormField label="Featured Quote">
                  <input type="text" value={industryData.overviewQuote || ''} onChange={(e) => handleFieldChange('overviewQuote', e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }} />
                </FormField>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <FormField label="Overview Paragraph 1">
                  <textarea rows={4} value={industryData.overviewBody || ''} onChange={(e) => handleFieldChange('overviewBody', e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }} />
                </FormField>
                <FormField label="Overview Paragraph 2">
                  <textarea rows={4} value={industryData.overviewBody2 || ''} onChange={(e) => handleFieldChange('overviewBody2', e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }} />
                </FormField>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Bottom CTA Section</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormField label="CTA Heading">
                  <input type="text" value={industryData.finalCtaHeading || ''} onChange={(e) => handleFieldChange('finalCtaHeading', e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }} />
                </FormField>
                <FormField label="CTA Description">
                  <input type="text" value={industryData.finalCtaDescription || ''} onChange={(e) => handleFieldChange('finalCtaDescription', e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }} />
                </FormField>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: CHALLENGES */}
        {activeTab === 'CHALLENGES' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Add Challenge Item</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 2fr auto', gap: '12px', alignItems: 'end' }}>
                <FormField label="Number">
                  <input type="text" value={newChallenge.number} onChange={(e) => setNewChallenge({ ...newChallenge, number: e.target.value })} style={{ padding: '8px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }} />
                </FormField>
                <FormField label="Title">
                  <input type="text" value={newChallenge.title} onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })} placeholder="Supply Chain Fragility" style={{ padding: '8px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }} />
                </FormField>
                <FormField label="Description">
                  <input type="text" value={newChallenge.description} onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })} placeholder="Diversifying supplier bases..." style={{ padding: '8px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }} />
                </FormField>
                <button type="button" onClick={handleAddChallenge} disabled={addingChallenge} style={{ padding: '9px 16px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                  <Plus size={16} /> Add
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Existing Challenges</h3>
              {industryData.challenges?.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No challenges added yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {industryData.challenges.map((c: any) => (
                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                      <div>
                        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--accent)', marginRight: '8px' }}>{c.number}</span>
                        <strong style={{ color: 'white', fontSize: '14px' }}>{c.title}</strong>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>{c.description}</p>
                      </div>
                      <button type="button" onClick={() => handleDeleteChallenge(c.id)} style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SOLUTIONS */}
        {activeTab === 'SOLUTIONS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Add Solution Item (&quot;How We Help&quot;)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr auto', gap: '12px', alignItems: 'end' }}>
                <FormField label="Label">
                  <input type="text" value={newSolution.label} onChange={(e) => setNewSolution({ ...newSolution, label: e.target.value })} placeholder="NAVIGATE" style={{ padding: '8px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }} />
                </FormField>
                <FormField label="Description">
                  <input type="text" value={newSolution.description} onChange={(e) => setNewSolution({ ...newSolution, description: e.target.value })} placeholder="Cross-border trade and environmental regulation." style={{ padding: '8px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }} />
                </FormField>
                <button type="button" onClick={handleAddSolution} disabled={addingSolution} style={{ padding: '9px 16px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                  <Plus size={16} /> Add
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Existing Solutions</h3>
              {industryData.solutions?.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No solutions added yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {industryData.solutions.map((s: any) => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent)', marginRight: '8px' }}>{s.label}</span>
                        <span style={{ color: 'white', fontSize: '13px' }}>{s.description}</span>
                      </div>
                      <button type="button" onClick={() => handleDeleteSolution(s.id)} style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PRACTICE AREAS */}
        {activeTab === 'PRACTICE_AREAS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Link Relevant Practice Area</h3>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
                <select
                  value={selectedPaId}
                  onChange={(e) => setSelectedPaId(e.target.value ? Number(e.target.value) : '')}
                  style={{ flex: 1, padding: '9px 12px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                >
                  <option value="">Select Practice Area...</option>
                  {availablePracticeAreas.map((pa) => (
                    <option key={pa.id} value={pa.id}>{pa.name}</option>
                  ))}
                </select>
                <button type="button" onClick={handleAddPracticeArea} style={{ padding: '9px 16px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                  Link
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Linked Practice Areas</h3>
              {industryData.practiceAreas?.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No practice areas linked yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {industryData.practiceAreas.map((link: any) => (
                    <div key={link.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                      <strong style={{ color: 'white', fontSize: '14px' }}>{link.pa.name}</strong>
                      <button type="button" onClick={() => handleRemovePracticeArea(link.id)} style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', cursor: 'pointer' }}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: SEO */}
        {activeTab === 'SEO' && (
          <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <SEOEditor targetType="industry" targetIdentifier={industryData.slug} />
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === 'SETTINGS' && (
          <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Entity Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <FormField label="Industry Name">
                <input type="text" value={industryData.name} onChange={(e) => handleFieldChange('name', e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }} />
              </FormField>
              <FormField label="URL Slug">
                <input type="text" value={industryData.slug} onChange={(e) => handleFieldChange('slug', e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }} />
              </FormField>
            </div>
            <div style={{ marginTop: '16px' }}>
              <FormField label="Short Description (for grid card)">
                <textarea rows={2} value={industryData.shortDescription || ''} onChange={(e) => handleFieldChange('shortDescription', e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }} />
              </FormField>
            </div>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginTop: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={industryData.isPublished} onChange={(e) => handleFieldChange('isPublished', e.target.checked)} style={{ width: '18px', height: '18px' }} />
                <span style={{ fontWeight: 600, color: 'white' }}>Published (Visible on site)</span>
              </label>
              <FormField label="Sort Order">
                <input type="number" value={industryData.sortOrder} onChange={(e) => handleFieldChange('sortOrder', parseInt(e.target.value, 10) || 0)} style={{ width: '100px', padding: '6px 10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }} />
              </FormField>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
