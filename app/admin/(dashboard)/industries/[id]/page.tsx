'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../components/AdminHeader';
import { PageHeader } from '../../components/PageHeader';
import { FormField } from '../../components/FormField';
import { ImageUploadInput } from '../../components/ImageUploadInput';
import { CTASelector } from '../../components/CTASelector';
import { LoadingState } from '../../components/LoadingState';
import { SEOEditor } from '../../components/SEOEditor';
import {
  getIndustryWithRelations,
  updateIndustryAction,
  createIndustryChallengeAction,
  updateIndustryChallengeAction,
  deleteIndustryChallengeAction,
  createIndustrySolutionAction,
  updateIndustrySolutionAction,
  deleteIndustrySolutionAction,
  addIndustryPracticeAreaAction,
  removeIndustryPracticeAreaAction,
  addIndustryExpertAction,
  removeIndustryExpertAction,
  addIndustryInsightAction,
  removeIndustryInsightAction,
  getIndustryPickerOptions,
} from '../actions';
import { ArrowLeft, Save, Plus, Trash2, Edit3, Eye, EyeOff, ExternalLink, Sparkles, Building2, Shield, Users, BookOpen } from 'lucide-react';

type Tab =
  | 'HERO'
  | 'OVERVIEW'
  | 'CHALLENGES'
  | 'SOLUTIONS'
  | 'PRACTICE_AREAS'
  | 'EXPERTS'
  | 'INSIGHTS'
  | 'FINAL_CTA'
  | 'SEO'
  | 'SETTINGS';

export default function EditIndustryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const indId = parseInt(id, 10);

  const [activeTab, setActiveTab] = useState<Tab>('HERO');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [industryData, setIndustryData] = useState<any>(null);

  // Pickers options
  const [availablePracticeAreas, setAvailablePracticeAreas] = useState<any[]>([]);
  const [availableTeamMembers, setAvailableTeamMembers] = useState<any[]>([]);
  const [availableInsights, setAvailableInsights] = useState<any[]>([]);

  // Challenge modal / form
  const [newChallenge, setNewChallenge] = useState({ number: '01.', title: '', description: '' });
  const [addingChallenge, setAddingChallenge] = useState(false);
  const [editingChallengeId, setEditingChallengeId] = useState<number | null>(null);
  const [editChallengeForm, setEditChallengeForm] = useState({ number: '', title: '', description: '' });

  // Solution modal / form
  const [newSolution, setNewSolution] = useState({ label: 'NAVIGATE', description: '' });
  const [addingSolution, setAddingSolution] = useState(false);
  const [editingSolutionId, setEditingSolutionId] = useState<number | null>(null);
  const [editSolutionForm, setEditSolutionForm] = useState({ label: '', description: '' });

  // Select pickers
  const [selectedPaId, setSelectedPaId] = useState<number | ''>('');
  const [selectedExpertId, setSelectedExpertId] = useState<number | ''>('');
  const [selectedInsightId, setSelectedInsightId] = useState<number | ''>('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [data, options] = await Promise.all([
        getIndustryWithRelations(indId),
        getIndustryPickerOptions(),
      ]);

      if (!data) {
        setError('Industry not found');
        return;
      }

      setIndustryData(data);
      setAvailablePracticeAreas(options.allPracticeAreas || []);
      setAvailableTeamMembers(options.allTeamMembers || []);
      setAvailableInsights(options.allInsightsArticles || []);
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

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
        overviewImageUrl: industryData.overviewImageUrl,
        overviewImageAlt: industryData.overviewImageAlt,
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

  // ─── CHALLENGES ACTIONS ──────────────────────────────────────────────────
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
      setNewChallenge({ number: `0${(industryData.challenges?.length || 0) + 2}.`, title: '', description: '' });
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to add challenge');
    } finally {
      setAddingChallenge(false);
    }
  };

  const handleUpdateChallenge = async (chId: number) => {
    try {
      await updateIndustryChallengeAction(chId, editChallengeForm);
      setEditingChallengeId(null);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to update challenge');
    }
  };

  const handleToggleChallengeVisibility = async (c: any) => {
    try {
      await updateIndustryChallengeAction(c.id, { isVisible: !c.isVisible });
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to toggle visibility');
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

  // ─── SOLUTIONS ACTIONS ───────────────────────────────────────────────────
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

  const handleUpdateSolution = async (solId: number) => {
    try {
      await updateIndustrySolutionAction(solId, editSolutionForm);
      setEditingSolutionId(null);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to update solution');
    }
  };

  const handleToggleSolutionVisibility = async (s: any) => {
    try {
      await updateIndustrySolutionAction(s.id, { isVisible: !s.isVisible });
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to toggle solution visibility');
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

  // ─── RELATIONAL LINK ACTIONS ─────────────────────────────────────────────
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

  const handleAddExpert = async () => {
    if (!selectedExpertId) return;
    try {
      await addIndustryExpertAction(indId, Number(selectedExpertId));
      setSelectedExpertId('');
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to link industry expert');
    }
  };

  const handleRemoveExpert = async (linkId: number) => {
    try {
      await removeIndustryExpertAction(linkId, indId);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to remove expert link');
    }
  };

  const handleAddInsight = async () => {
    if (!selectedInsightId) return;
    try {
      await addIndustryInsightAction(indId, Number(selectedInsightId));
      setSelectedInsightId('');
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to link insight article');
    }
  };

  const handleRemoveInsight = async (linkId: number) => {
    try {
      await removeIndustryInsightAction(linkId, indId);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to remove insight link');
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader title="Edit Industry" />
        <LoadingState message="Loading complete industry CMS data..." />
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
          <Link href="/admin/industries" style={{ display: 'inline-block', marginTop: '16px', color: 'var(--accent, #c59b27)' }}>
            Back to Industries
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title={`Edit Industry: ${industryData.name}`} />

      <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
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
            <ArrowLeft size={16} /> Back to Industries Portfolio
          </Link>
        </div>

        <PageHeader
          title={industryData.name}
          description={`Public Page Route: /industries/${industryData.slug}`}
          actions={
            <div style={{ display: 'flex', gap: '10px' }}>
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  border: '1px solid var(--border)',
                }}
              >
                <ExternalLink size={15} /> Preview Live Page
              </Link>
              <button
                type="button"
                onClick={() => handleSave()}
                disabled={saving}
                style={{
                  padding: '8px 18px',
                  background: 'var(--accent, #c59b27)',
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
            ✓ Industry content saved successfully! Public route /industries/{industryData.slug} updated.
          </div>
        )}

        {/* TABS NAVIGATION */}
        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', borderBottom: '1px solid var(--border, rgba(255,255,255,0.07))', marginBottom: '24px', paddingBottom: '2px' }}>
          {[
            { id: 'HERO', label: '1. HERO' },
            { id: 'OVERVIEW', label: '2. OVERVIEW' },
            { id: 'CHALLENGES', label: `3. CHALLENGES (${industryData.challenges?.length || 0})` },
            { id: 'SOLUTIONS', label: `4. HOW WE HELP (${industryData.solutions?.length || 0})` },
            { id: 'PRACTICE_AREAS', label: `5. PRACTICE AREAS (${industryData.practiceAreas?.length || 0})` },
            { id: 'EXPERTS', label: `6. EXPERTS (${industryData.experts?.length || 0})` },
            { id: 'INSIGHTS', label: `7. INSIGHTS (${industryData.insights?.length || 0})` },
            { id: 'FINAL_CTA', label: '8. FINAL CTA' },
            { id: 'SEO', label: '9. SEO' },
            { id: 'SETTINGS', label: '10. SETTINGS' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as Tab)}
              style={{
                padding: '10px 14px',
                whiteSpace: 'nowrap',
                background: activeTab === tab.id ? 'var(--bg-surface, #1a1d27)' : 'transparent',
                color: activeTab === tab.id ? 'var(--accent, #3b82f6)' : 'var(--text-secondary, #94a3b8)',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent, #3b82f6)' : '2px solid transparent',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: HERO */}
        {activeTab === 'HERO' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px', color: 'white' }}>Hero Banner Content</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                <FormField label="Hero Eyebrow (Category Tag)">
                  <input
                    type="text"
                    value={industryData.heroEyebrow || ''}
                    onChange={(e) => handleFieldChange('heroEyebrow', e.target.value)}
                    placeholder="INDUSTRIES"
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base, #0f1117)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
                <FormField label="Hero Main Heading">
                  <input
                    type="text"
                    value={industryData.heroHeading || ''}
                    onChange={(e) => handleFieldChange('heroHeading', e.target.value)}
                    placeholder={`${industryData.name} Advisory`}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base, #0f1117)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
              </div>

              <div style={{ marginTop: '16px' }}>
                <FormField label="Hero Subheading / Description">
                  <textarea
                    rows={4}
                    value={industryData.heroDescription || ''}
                    onChange={(e) => handleFieldChange('heroDescription', e.target.value)}
                    placeholder="A rigorous, strategic approach to navigating supply chain volatility..."
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base, #0f1117)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
              </div>

              <div style={{ marginTop: '20px' }}>
                <ImageUploadInput
                  label="Hero Featured Image URL"
                  value={industryData.heroImageUrl || ''}
                  onChange={(url) => handleFieldChange('heroImageUrl', url)}
                />
              </div>

              <div style={{ marginTop: '12px' }}>
                <FormField label="Hero Image Alt Text">
                  <input
                    type="text"
                    value={industryData.heroImageAlt || ''}
                    onChange={(e) => handleFieldChange('heroImageAlt', e.target.value)}
                    placeholder={industryData.name}
                    style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-base, #0f1117)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Hero Action Buttons (CTAs)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <CTASelector
                  label="Primary Hero CTA Button"
                  textValue={industryData.heroCta1Text || 'TALK TO OUR INDUSTRY EXPERTS'}
                  urlValue={industryData.heroCta1Href || '/contact'}
                  onChange={(txt, href) => {
                    handleFieldChange('heroCta1Text', txt);
                    handleFieldChange('heroCta1Href', href);
                  }}
                />
                <CTASelector
                  label="Secondary Hero CTA Button"
                  textValue={industryData.heroCta2Text || 'EXPLORE RELEVANT SERVICES'}
                  urlValue={industryData.heroCta2Href || `/industries/${industryData.slug}#how-we-help`}
                  onChange={(txt, href) => {
                    handleFieldChange('heroCta2Text', txt);
                    handleFieldChange('heroCta2Href', href);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px', color: 'white' }}>Industry Overview & Executive Philosophy</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              <FormField label="Overview Section Heading">
                <input
                  type="text"
                  value={industryData.overviewHeading || ''}
                  onChange={(e) => handleFieldChange('overviewHeading', e.target.value)}
                  placeholder={`Understanding ${industryData.name}`}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                />
              </FormField>

              <FormField label="Executive Quote / Highlighted Tagline">
                <textarea
                  rows={2}
                  value={industryData.overviewQuote || ''}
                  onChange={(e) => handleFieldChange('overviewQuote', e.target.value)}
                  placeholder="Resilience in manufacturing is no longer optional — it is the baseline for competing..."
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px', fontStyle: 'italic' }}
                />
              </FormField>

              <FormField label="Overview Paragraph 1">
                <textarea
                  rows={5}
                  value={industryData.overviewBody || ''}
                  onChange={(e) => handleFieldChange('overviewBody', e.target.value)}
                  placeholder="The current landscape of manufacturing is defined by supply chain fragility..."
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                />
              </FormField>

              <FormField label="Overview Paragraph 2">
                <textarea
                  rows={5}
                  value={industryData.overviewBody2 || ''}
                  onChange={(e) => handleFieldChange('overviewBody2', e.target.value)}
                  placeholder="At PSC Global, we recognize that generalized solutions are insufficient..."
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                />
              </FormField>

              <div style={{ marginTop: '12px' }}>
                <ImageUploadInput
                  label="Overview Section Image (Optional)"
                  value={industryData.overviewImageUrl || ''}
                  onChange={(url) => handleFieldChange('overviewImageUrl', url)}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CHALLENGES */}
        {activeTab === 'CHALLENGES' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Challenges Section Introduction</h3>
              <FormField label="Introductory Subheading">
                <input
                  type="text"
                  value={industryData.challengesIntro || ''}
                  onChange={(e) => handleFieldChange('challengesIntro', e.target.value)}
                  placeholder="Strategic imperatives dictated by the current industrial and macroeconomic environment."
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                />
              </FormField>
            </div>

            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: 'white' }}>Add New Challenge Card</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '90px 1.2fr 2fr auto', gap: '12px', alignItems: 'end' }}>
                <FormField label="Number">
                  <input
                    type="text"
                    value={newChallenge.number}
                    onChange={(e) => setNewChallenge({ ...newChallenge, number: e.target.value })}
                    style={{ padding: '9px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
                <FormField label="Title">
                  <input
                    type="text"
                    value={newChallenge.title}
                    onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                    placeholder="Supply Chain Fragility"
                    style={{ padding: '9px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
                <FormField label="Description">
                  <input
                    type="text"
                    value={newChallenge.description}
                    onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                    placeholder="Diversifying supplier bases and building contingency..."
                    style={{ padding: '9px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
                <button
                  type="button"
                  onClick={handleAddChallenge}
                  disabled={addingChallenge}
                  style={{ padding: '10px 18px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} /> Add Card
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Current Industry Challenges</h3>
              {industryData.challenges?.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No challenge cards configured yet for this industry.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {industryData.challenges.map((c: any) => (
                    <div
                      key={c.id}
                      style={{
                        padding: '16px',
                        background: 'var(--bg-base)',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        opacity: c.isVisible ? 1 : 0.5,
                      }}
                    >
                      {editingChallengeId === c.id ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 2fr auto', gap: '12px', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={editChallengeForm.number}
                            onChange={(e) => setEditChallengeForm({ ...editChallengeForm, number: e.target.value })}
                            style={{ padding: '6px', background: '#1a1d27', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                          />
                          <input
                            type="text"
                            value={editChallengeForm.title}
                            onChange={(e) => setEditChallengeForm({ ...editChallengeForm, title: e.target.value })}
                            style={{ padding: '6px', background: '#1a1d27', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                          />
                          <input
                            type="text"
                            value={editChallengeForm.description}
                            onChange={(e) => setEditChallengeForm({ ...editChallengeForm, description: e.target.value })}
                            style={{ padding: '6px', background: '#1a1d27', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                          />
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => handleUpdateChallenge(c.id)}
                              style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingChallengeId(null)}
                              style={{ padding: '6px 12px', background: '#64748b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#60a5fa', fontWeight: 700, marginRight: '10px' }}>
                              {c.number}
                            </span>
                            <strong style={{ color: 'white', fontSize: '15px' }}>{c.title}</strong>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{c.description}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleChallengeVisibility(c)}
                              title={c.isVisible ? 'Hide Challenge' : 'Show Challenge'}
                              style={{ background: 'none', border: 'none', color: c.isVisible ? '#10b981' : '#94a3b8', cursor: 'pointer' }}
                            >
                              {c.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingChallengeId(c.id);
                                setEditChallengeForm({ number: c.number, title: c.title, description: c.description || '' });
                              }}
                              style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer' }}
                              title="Edit"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteChallenge(c.id)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: SOLUTIONS ("HOW WE HELP") */}
        {activeTab === 'SOLUTIONS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'white' }}>How Advisory Global Helps Section</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormField label="Section Heading">
                  <input
                    type="text"
                    value={industryData.solutionsHeading || ''}
                    onChange={(e) => handleFieldChange('solutionsHeading', e.target.value)}
                    placeholder={`How PSC Global Helps ${industryData.name}`}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
                <FormField label="Intro / Subtitle">
                  <input
                    type="text"
                    value={industryData.solutionsIntro || ''}
                    onChange={(e) => handleFieldChange('solutionsIntro', e.target.value)}
                    placeholder="We deploy cross-functional teams combining deep industrial knowledge..."
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: 'white' }}>Add Solution Capability Card</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '150px 2fr auto', gap: '12px', alignItems: 'end' }}>
                <FormField label="Verb / Label">
                  <input
                    type="text"
                    value={newSolution.label}
                    onChange={(e) => setNewSolution({ ...newSolution, label: e.target.value })}
                    placeholder="NAVIGATE"
                    style={{ padding: '9px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
                <FormField label="Capability Description">
                  <input
                    type="text"
                    value={newSolution.description}
                    onChange={(e) => setNewSolution({ ...newSolution, description: e.target.value })}
                    placeholder="Cross-border trade and environmental regulation."
                    style={{ padding: '9px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
                <button
                  type="button"
                  onClick={handleAddSolution}
                  disabled={addingSolution}
                  style={{ padding: '10px 18px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} /> Add Solution
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Configured Solutions</h3>
              {industryData.solutions?.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No solution capabilities configured yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {industryData.solutions.map((s: any) => (
                    <div
                      key={s.id}
                      style={{
                        padding: '16px',
                        background: 'var(--bg-base)',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        opacity: s.isVisible ? 1 : 0.5,
                      }}
                    >
                      {editingSolutionId === s.id ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '150px 2fr auto', gap: '12px', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={editSolutionForm.label}
                            onChange={(e) => setEditSolutionForm({ ...editSolutionForm, label: e.target.value })}
                            style={{ padding: '6px', background: '#1a1d27', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                          />
                          <input
                            type="text"
                            value={editSolutionForm.description}
                            onChange={(e) => setEditSolutionForm({ ...editSolutionForm, description: e.target.value })}
                            style={{ padding: '6px', background: '#1a1d27', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                          />
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => handleUpdateSolution(s.id)}
                              style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingSolutionId(null)}
                              style={{ padding: '6px 12px', background: '#64748b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: '#60a5fa', marginRight: '10px' }}>
                              {s.label}
                            </span>
                            <span style={{ color: 'white', fontSize: '14px' }}>{s.description}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleSolutionVisibility(s)}
                              title={s.isVisible ? 'Hide Solution' : 'Show Solution'}
                              style={{ background: 'none', border: 'none', color: s.isVisible ? '#10b981' : '#94a3b8', cursor: 'pointer' }}
                            >
                              {s.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSolutionId(s.id);
                                setEditSolutionForm({ label: s.label, description: s.description || '' });
                              }}
                              style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer' }}
                              title="Edit"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSolution(s.id)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: PRACTICE AREAS */}
        {activeTab === 'PRACTICE_AREAS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: 'white' }}>Link Relevant Practice Area Entities</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Select practice areas to display on the {industryData.name} frontend. Practice Area details (name, description, URL) remain dynamically linked to the master Practice Area entity.
              </p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
                <select
                  value={selectedPaId}
                  onChange={(e) => setSelectedPaId(e.target.value ? Number(e.target.value) : '')}
                  style={{ flex: 1, padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                >
                  <option value="">Select Practice Area to Link...</option>
                  {availablePracticeAreas.map((pa) => (
                    <option key={pa.id} value={pa.id}>{pa.name} (/practice-areas/{pa.slug})</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddPracticeArea}
                  style={{ padding: '10px 20px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Link Practice Area
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Linked Practice Areas</h3>
              {industryData.practiceAreas?.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No practice areas currently linked to this industry.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {industryData.practiceAreas.map((link: any) => (
                    <div
                      key={link.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        background: 'var(--bg-base)',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div>
                        <strong style={{ color: 'white', fontSize: '15px' }}>{link.pa.name}</strong>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '12px' }}>/practice-areas/{link.pa.slug}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePracticeArea(link.id)}
                        style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        Remove Link
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: EXPERTS */}
        {activeTab === 'EXPERTS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: 'white' }}>Link Lead Industry Experts (Team Members)</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Select team members to showcase as lead sector practitioners on this industry page.
              </p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
                <select
                  value={selectedExpertId}
                  onChange={(e) => setSelectedExpertId(e.target.value ? Number(e.target.value) : '')}
                  style={{ flex: 1, padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                >
                  <option value="">Select Team Member to Link...</option>
                  {availableTeamMembers.map((tm) => (
                    <option key={tm.id} value={tm.id}>{tm.name} — {tm.roleTitle}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddExpert}
                  style={{ padding: '10px 20px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Link Expert
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Linked Industry Experts</h3>
              {industryData.experts?.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No team members linked as lead experts for this industry.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {industryData.experts.map((link: any) => (
                    <div
                      key={link.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        background: 'var(--bg-base)',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {link.tm.imageUrl ? (
                          <img src={link.tm.imageUrl} alt={link.tm.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#334155', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                            {link.tm.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <strong style={{ color: 'white', fontSize: '15px' }}>{link.tm.name}</strong>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '10px' }}>{link.tm.roleTitle}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveExpert(link.id)}
                        style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        Remove Link
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: INSIGHTS */}
        {activeTab === 'INSIGHTS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: 'white' }}>Link Related Insight Articles</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Select publications or regulatory briefings to feature on the {industryData.name} detail page.
              </p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
                <select
                  value={selectedInsightId}
                  onChange={(e) => setSelectedInsightId(e.target.value ? Number(e.target.value) : '')}
                  style={{ flex: 1, padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                >
                  <option value="">Select Article to Link...</option>
                  {availableInsights.map((art) => (
                    <option key={art.id} value={art.id}>{art.title} ({art.contentType})</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddInsight}
                  style={{ padding: '10px 20px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Link Insight
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Linked Insight Articles</h3>
              {industryData.insights?.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No articles linked to this industry yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {industryData.insights.map((link: any) => (
                    <div
                      key={link.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        background: 'var(--bg-base)',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div>
                        <strong style={{ color: 'white', fontSize: '15px' }}>{link.art.title}</strong>
                        <span style={{ fontSize: '12px', color: '#60a5fa', marginLeft: '10px' }}>/{link.art.slug}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveInsight(link.id)}
                        style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        Remove Link
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 8: FINAL CTA */}
        {activeTab === 'FINAL_CTA' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px', color: 'white' }}>Final Call-to-Action Banner</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormField label="CTA Heading">
                  <input
                    type="text"
                    value={industryData.finalCtaHeading || ''}
                    onChange={(e) => handleFieldChange('finalCtaHeading', e.target.value)}
                    placeholder={`Let's Discuss Your Industry.`}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
                <FormField label="CTA Description">
                  <input
                    type="text"
                    value={industryData.finalCtaDescription || ''}
                    onChange={(e) => handleFieldChange('finalCtaDescription', e.target.value)}
                    placeholder="Schedule a confidential consultation with our sector specialists..."
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Final CTA Buttons</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <CTASelector
                  label="Primary Final CTA Button"
                  textValue={industryData.finalCta1Text || 'TALK TO OUR INDUSTRY EXPERTS'}
                  urlValue={industryData.finalCta1Href || '/contact'}
                  onChange={(txt, href) => {
                    handleFieldChange('finalCta1Text', txt);
                    handleFieldChange('finalCta1Href', href);
                  }}
                />
                <CTASelector
                  label="Secondary Final CTA Button"
                  textValue={industryData.finalCta2Text || 'BOOK A CONSULTATION'}
                  urlValue={industryData.finalCta2Href || '/book-consultation'}
                  onChange={(txt, href) => {
                    handleFieldChange('finalCta2Text', txt);
                    handleFieldChange('finalCta2Href', href);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: SEO */}
        {activeTab === 'SEO' && (
          <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <SEOEditor targetType="industry" targetIdentifier={industryData.slug} />
          </div>
        )}

        {/* TAB 10: SETTINGS */}
        {activeTab === 'SETTINGS' && (
          <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px', color: 'white' }}>Industry Entity Metadata & Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <FormField label="Industry Name">
                <input
                  type="text"
                  value={industryData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                />
              </FormField>
              <FormField label="URL Slug (Determines /industries/[slug])">
                <input
                  type="text"
                  value={industryData.slug}
                  onChange={(e) => handleFieldChange('slug', e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                />
              </FormField>
            </div>

            <div style={{ marginTop: '16px' }}>
              <FormField label="Short Description (Displayed on /industries index card)">
                <textarea
                  rows={3}
                  value={industryData.shortDescription || ''}
                  onChange={(e) => handleFieldChange('shortDescription', e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                />
              </FormField>
            </div>

            <div style={{ marginTop: '20px' }}>
              <ImageUploadInput
                label="Sector Grid Cover Image URL"
                value={industryData.imageUrl || ''}
                onChange={(url) => handleFieldChange('imageUrl', url)}
              />
            </div>

            <div style={{ display: 'flex', gap: '32px', alignItems: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={industryData.isPublished}
                  onChange={(e) => handleFieldChange('isPublished', e.target.checked)}
                  style={{ width: '20px', height: '20px' }}
                />
                <span style={{ fontWeight: 600, color: 'white', fontSize: '14px' }}>Published (Visible on site)</span>
              </label>

              <FormField label="Sort Order">
                <input
                  type="number"
                  value={industryData.sortOrder}
                  onChange={(e) => handleFieldChange('sortOrder', parseInt(e.target.value, 10) || 0)}
                  style={{ width: '110px', padding: '8px 12px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                />
              </FormField>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
