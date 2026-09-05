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
import { IconPicker } from '../../components/IconPicker';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import {
  getPracticeAreaWithRelations,
  updatePracticeAreaAction,
  savePracticeAreaServicesAction,
  createPracticeAreaCapabilityAction,
  updatePracticeAreaCapabilityAction,
  deletePracticeAreaCapabilityAction,
  addPracticeAreaIndustryAction,
  removePracticeAreaIndustryAction,
  addPracticeAreaExpertAction,
  removePracticeAreaExpertAction,
  addPracticeAreaInsightAction,
  removePracticeAreaInsightAction,
  getPracticeAreaPickerOptions,
} from '../actions';
import { ArrowLeft, Save, Plus, Trash2, Edit3, Eye, EyeOff, ExternalLink, Shield } from 'lucide-react';

type Tab =
  | 'HERO'
  | 'OVERVIEW'
  | 'SERVICES'
  | 'CAPABILITIES'
  | 'INDUSTRIES'
  | 'EXPERTS'
  | 'INSIGHTS'
  | 'FINAL_CTA'
  | 'SEO'
  | 'SETTINGS';

export default function EditPracticeAreaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const areaId = parseInt(id, 10);

  const [activeTab, setActiveTab] = useState<Tab>('HERO');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [areaData, setAreaData] = useState<any>(null);
  const [servicesList, setServicesList] = useState<Array<{ id?: number; name: string }>>([]);

  // Picker options
  const [availableIndustries, setAvailableIndustries] = useState<any[]>([]);
  const [availableTeamMembers, setAvailableTeamMembers] = useState<any[]>([]);
  const [availableInsights, setAvailableInsights] = useState<any[]>([]);

  // Capability form / modal
  const [newCapability, setNewCapability] = useState({ title: '', description: '' });
  const [addingCapability, setAddingCapability] = useState(false);
  const [editingCapId, setEditingCapId] = useState<number | null>(null);
  const [editCapForm, setEditCapForm] = useState({ title: '', description: '' });

  // New service input
  const [newServiceName, setNewServiceName] = useState('');

  // Picker selects
  const [selectedIndId, setSelectedIndId] = useState<number | ''>('');
  const [selectedExpertId, setSelectedExpertId] = useState<number | ''>('');
  const [selectedInsightId, setSelectedInsightId] = useState<number | ''>('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [data, options] = await Promise.all([
        getPracticeAreaWithRelations(areaId),
        getPracticeAreaPickerOptions(),
      ]);

      if (!data) {
        setError('Practice area not found');
        return;
      }

      setAreaData(data);
      setServicesList(data.services?.map((s: any) => ({ id: s.id, name: s.name })) || []);
      setAvailableIndustries(options.allIndustries || []);
      setAvailableTeamMembers(options.allTeamMembers || []);
      setAvailableInsights(options.allInsightsArticles || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load practice area data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [areaId]);

  const handleFieldChange = (field: string, value: any) => {
    setAreaData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updatePracticeAreaAction(areaId, {
        name: areaData.name,
        slug: areaData.slug,
        number: areaData.number,
        shortDescription: areaData.shortDescription,
        longDescription: areaData.longDescription,
        iconName: areaData.iconName,
        styleClass: areaData.styleClass,
        sortOrder: areaData.sortOrder,
        isPublished: areaData.isPublished,
        // Hero
        heroEyebrow: areaData.heroEyebrow,
        heroHeading: areaData.heroHeading,
        heroDescription: areaData.heroDescription,
        heroImageUrl: areaData.heroImageUrl,
        heroImageAlt: areaData.heroImageAlt,
        heroCta1Text: areaData.heroCta1Text,
        heroCta1Href: areaData.heroCta1Href,
        heroCta2Text: areaData.heroCta2Text,
        heroCta2Href: areaData.heroCta2Href,
        // Overview
        overviewHeading: areaData.overviewHeading,
        overviewQuote: areaData.overviewQuote,
        overviewBody: areaData.overviewBody,
        overviewBody2: areaData.overviewBody2,
        overviewImageUrl: areaData.overviewImageUrl,
        overviewImageAlt: areaData.overviewImageAlt,
        // Capabilities & Services intro
        capabilitiesHeading: areaData.capabilitiesHeading,
        capabilitiesIntro: areaData.capabilitiesIntro,
        servicesHeading: areaData.servicesHeading,
        servicesIntro: areaData.servicesIntro,
        // Final CTA
        finalCtaHeading: areaData.finalCtaHeading,
        finalCtaDescription: areaData.finalCtaDescription,
        finalCta1Text: areaData.finalCta1Text,
        finalCta1Href: areaData.finalCta1Href,
        finalCta2Text: areaData.finalCta2Text,
        finalCta2Href: areaData.finalCta2Href,
      });

      await savePracticeAreaServicesAction(areaId, servicesList);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save practice area');
    } finally {
      setSaving(false);
    }
  };

  // ─── SERVICES HANDLERS ──────────────────────────────────────────────────
  const handleAddService = () => {
    if (!newServiceName.trim()) return;
    setServicesList((prev) => [...prev, { name: newServiceName.trim() }]);
    setNewServiceName('');
  };

  const handleRemoveService = (index: number) => {
    setServicesList((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── CAPABILITIES HANDLERS ──────────────────────────────────────────────
  const handleAddCapability = async () => {
    if (!newCapability.title) return;
    try {
      setAddingCapability(true);
      await createPracticeAreaCapabilityAction({
        practiceAreaId: areaId,
        title: newCapability.title,
        description: newCapability.description,
        sortOrder: (areaData.capabilities?.length || 0) + 1,
      });
      setNewCapability({ title: '', description: '' });
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to add capability');
    } finally {
      setAddingCapability(false);
    }
  };

  const handleUpdateCapability = async (capId: number) => {
    try {
      await updatePracticeAreaCapabilityAction(capId, editCapForm);
      setEditingCapId(null);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to update capability');
    }
  };

  const handleToggleCapVisibility = async (c: any) => {
    try {
      await updatePracticeAreaCapabilityAction(c.id, { isVisible: !c.isVisible });
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to toggle capability visibility');
    }
  };

  const handleDeleteCapability = async (capId: number) => {
    try {
      await deletePracticeAreaCapabilityAction(capId, areaId);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete capability');
    }
  };

  // ─── RELATIONAL PICKER HANDLERS ──────────────────────────────────────────
  const handleAddIndustry = async () => {
    if (!selectedIndId) return;
    try {
      await addPracticeAreaIndustryAction(areaId, Number(selectedIndId));
      setSelectedIndId('');
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to link industry');
    }
  };

  const handleRemoveIndustry = async (linkId: number) => {
    try {
      await removePracticeAreaIndustryAction(linkId, areaId);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to remove industry link');
    }
  };

  const handleAddExpert = async () => {
    if (!selectedExpertId) return;
    try {
      await addPracticeAreaExpertAction(areaId, Number(selectedExpertId));
      setSelectedExpertId('');
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to link expert');
    }
  };

  const handleRemoveExpert = async (linkId: number) => {
    try {
      await removePracticeAreaExpertAction(linkId, areaId);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to remove expert link');
    }
  };

  const handleAddInsight = async () => {
    if (!selectedInsightId) return;
    try {
      await addPracticeAreaInsightAction(areaId, Number(selectedInsightId));
      setSelectedInsightId('');
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to link insight article');
    }
  };

  const handleRemoveInsight = async (linkId: number) => {
    try {
      await removePracticeAreaInsightAction(linkId, areaId);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to remove insight link');
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader title="Edit Practice Area" />
        <LoadingState message="Loading complete practice area CMS data..." />
      </>
    );
  }

  if (error && !areaData) {
    return (
      <>
        <AdminHeader title="Edit Practice Area" />
        <div style={{ padding: '24px' }}>
          <div style={{ padding: '16px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '8px' }}>
            {error}
          </div>
          <Link href="/admin/practice-areas" style={{ display: 'inline-block', marginTop: '16px', color: 'var(--accent, #c59b27)' }}>
            Back to Practice Areas
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title={`Edit Practice Area: ${areaData.name}`} />

      <div className="admin-content" style={{ maxWidth: '1400px' }}>
        <Breadcrumbs items={[{ label: 'Website', href: '/admin/pages' }, { label: 'Practice Areas', href: '/admin/practice-areas' }, { label: areaData.name }]} />

        <div style={{ marginBottom: '20px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {areaData.name}
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Public Route: <code>/practice-areas/{areaData.slug}</code>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Link
              href={`/practice-areas/${areaData.slug}`}
              target="_blank"
              className="btn btn-secondary"
            >
              <ExternalLink size={14} /> Preview Live Page
            </Link>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className="btn btn-primary"
            >
              <Save size={14} /> {saving ? 'Saving...' : 'Save Practice Area'}
            </button>
          </div>
        </div>

        {/* 3-COLUMN EDITOR LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 260px', gap: '20px', alignItems: 'start' }}>
          {/* COLUMN 1: VERTICAL SECTION NAVIGATION */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', position: 'sticky', top: '20px' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              PAGE SECTIONS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '16px' }}>
              {[
                { id: 'HERO', label: '1. Hero Banner' },
                { id: 'OVERVIEW', label: '2. Overview & Philosophy' },
                { id: 'SERVICES', label: `3. Services (${servicesList.length})` },
                { id: 'CAPABILITIES', label: `4. Capabilities (${areaData.capabilities?.length || 0})` },
                { id: 'INDUSTRIES', label: `5. Industries (${areaData.industries?.length || 0})` },
                { id: 'EXPERTS', label: `6. Practice Experts (${areaData.experts?.length || 0})` },
                { id: 'INSIGHTS', label: `7. Related Insights (${areaData.insights?.length || 0})` },
                { id: 'FINAL_CTA', label: '8. Final Call to Action' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as Tab)}
                  style={{
                    textAlign: 'left',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    background: activeTab === tab.id ? 'var(--bg-elevated)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                    borderLeft: activeTab === tab.id ? '3px solid var(--accent)' : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              PAGE SETTINGS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { id: 'SEO', label: '9. SEO Metadata' },
                { id: 'SETTINGS', label: '10. General Settings' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as Tab)}
                  style={{
                    textAlign: 'left',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    background: activeTab === tab.id ? 'var(--bg-elevated)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                    borderLeft: activeTab === tab.id ? '3px solid var(--accent)' : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* COLUMN 2: MAIN EDITOR FORM */}
          <div style={{ minWidth: 0 }}>

        {/* TAB 1: HERO */}
        {activeTab === 'HERO' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px', color: 'white' }}>Hero Banner Content</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                <FormField label="Hero Eyebrow">
                  <input
                    type="text"
                    value={areaData.heroEyebrow || ''}
                    onChange={(e) => handleFieldChange('heroEyebrow', e.target.value)}
                    placeholder="PRACTICE AREA"
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base, #0f1117)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
                <FormField label="Hero Main Heading">
                  <input
                    type="text"
                    value={areaData.heroHeading || ''}
                    onChange={(e) => handleFieldChange('heroHeading', e.target.value)}
                    placeholder={`${areaData.name} Advisory`}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base, #0f1117)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
              </div>

              <div style={{ marginTop: '16px' }}>
                <FormField label="Hero Subheading / Description">
                  <textarea
                    rows={4}
                    value={areaData.heroDescription || ''}
                    onChange={(e) => handleFieldChange('heroDescription', e.target.value)}
                    placeholder="Comprehensive risk management and regulatory compliance architectures..."
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base, #0f1117)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
              </div>

              <div style={{ marginTop: '20px' }}>
                <ImageUploadInput
                  label="Hero Featured Image URL"
                  value={areaData.heroImageUrl || ''}
                  onChange={(url) => handleFieldChange('heroImageUrl', url)}
                />
              </div>

              <div style={{ marginTop: '12px' }}>
                <FormField label="Hero Image Alt Text">
                  <input
                    type="text"
                    value={areaData.heroImageAlt || ''}
                    onChange={(e) => handleFieldChange('heroImageAlt', e.target.value)}
                    placeholder={areaData.name}
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
                  textValue={areaData.heroCta1Text || 'TALK TO OUR ADVISORS'}
                  urlValue={areaData.heroCta1Href || '/contact'}
                  onChange={(txt, href) => {
                    handleFieldChange('heroCta1Text', txt);
                    handleFieldChange('heroCta1Href', href);
                  }}
                />
                <CTASelector
                  label="Secondary Hero CTA Button"
                  textValue={areaData.heroCta2Text || 'VIEW CAPABILITIES'}
                  urlValue={areaData.heroCta2Href || `/practice-areas/${areaData.slug}#capabilities`}
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
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px', color: 'white' }}>Practice Area Overview & Philosophy</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              <FormField label="Overview Section Heading">
                <input
                  type="text"
                  value={areaData.overviewHeading || ''}
                  onChange={(e) => handleFieldChange('overviewHeading', e.target.value)}
                  placeholder={`Understanding ${areaData.name}`}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                />
              </FormField>

              <FormField label="Featured Quote / Highlighted Tagline">
                <textarea
                  rows={2}
                  value={areaData.overviewQuote || ''}
                  onChange={(e) => handleFieldChange('overviewQuote', e.target.value)}
                  placeholder="Governance is not about restricting movement — it is about establishing structural integrity..."
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px', fontStyle: 'italic' }}
                />
              </FormField>

              <FormField label="Overview Paragraph 1">
                <textarea
                  rows={5}
                  value={areaData.overviewBody || ''}
                  onChange={(e) => handleFieldChange('overviewBody', e.target.value)}
                  placeholder="In an era of relentless regulatory evolution and systemic volatility..."
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                />
              </FormField>

              <FormField label="Overview Paragraph 2">
                <textarea
                  rows={5}
                  value={areaData.overviewBody2 || ''}
                  onChange={(e) => handleFieldChange('overviewBody2', e.target.value)}
                  placeholder="PSC Global partners with executive boards and audit committees..."
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                />
              </FormField>
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES */}
        {activeTab === 'SERVICES' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Services Section Introduction</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormField label="Services Section Heading">
                  <input
                    type="text"
                    value={areaData.servicesHeading || ''}
                    onChange={(e) => handleFieldChange('servicesHeading', e.target.value)}
                    placeholder="Core Practice Services"
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
                <FormField label="Services Section Subtitle">
                  <input
                    type="text"
                    value={areaData.servicesIntro || ''}
                    onChange={(e) => handleFieldChange('servicesIntro', e.target.value)}
                    placeholder="Our specialized practice capabilities span governance design, internal audit, and compliance automation."
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: 'white' }}>Add Specific Practice Service</h3>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
                <div style={{ flex: 1 }}>
                  <FormField label="Service Name">
                    <input
                      type="text"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      placeholder="e.g. Statutory Audit & Regulatory Gap Analysis"
                      style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                    />
                  </FormField>
                </div>
                <button
                  type="button"
                  onClick={handleAddService}
                  style={{ padding: '10px 20px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} /> Add Service
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Configured Practice Services</h3>
              {servicesList.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No services configured yet for this practice area.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {servicesList.map((srv, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: 'var(--bg-base)',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '12px', color: '#60a5fa', fontWeight: 700 }}>#{idx + 1}</span>
                        <input
                          type="text"
                          value={srv.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setServicesList((prev) => prev.map((s, i) => (i === idx ? { ...s, name: val } : s)));
                          }}
                          style={{ background: 'transparent', border: 'none', color: 'white', fontWeight: 600, fontSize: '14px', width: '360px' }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(idx)}
                        style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CAPABILITIES */}
        {activeTab === 'CAPABILITIES' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Capabilities Section Introduction</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormField label="Capabilities Section Heading">
                  <input
                    type="text"
                    value={areaData.capabilitiesHeading || ''}
                    onChange={(e) => handleFieldChange('capabilitiesHeading', e.target.value)}
                    placeholder="Strategic Capabilities in Risk & Governance"
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
                <FormField label="Capabilities Subtitle">
                  <input
                    type="text"
                    value={areaData.capabilitiesIntro || ''}
                    onChange={(e) => handleFieldChange('capabilitiesIntro', e.target.value)}
                    placeholder="Targeted advisory services engineered to protect assets..."
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: 'white' }}>Add Strategic Capability Card</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr auto', gap: '12px', alignItems: 'end' }}>
                <FormField label="Capability Title">
                  <input
                    type="text"
                    value={newCapability.title}
                    onChange={(e) => setNewCapability({ ...newCapability, title: e.target.value })}
                    placeholder="Regulatory Compliance Assurance"
                    style={{ padding: '9px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
                <FormField label="Description">
                  <input
                    type="text"
                    value={newCapability.description}
                    onChange={(e) => setNewCapability({ ...newCapability, description: e.target.value })}
                    placeholder="Evaluating and aligning operating procedures..."
                    style={{ padding: '9px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
                <button
                  type="button"
                  onClick={handleAddCapability}
                  disabled={addingCapability}
                  style={{ padding: '10px 18px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} /> Add Capability
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Configured Strategic Capabilities</h3>
              {areaData.capabilities?.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No capability cards configured yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {areaData.capabilities.map((c: any) => (
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
                      {editingCapId === c.id ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr auto', gap: '12px', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={editCapForm.title}
                            onChange={(e) => setEditCapForm({ ...editCapForm, title: e.target.value })}
                            style={{ padding: '6px', background: '#1a1d27', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                          />
                          <input
                            type="text"
                            value={editCapForm.description}
                            onChange={(e) => setEditCapForm({ ...editCapForm, description: e.target.value })}
                            style={{ padding: '6px', background: '#1a1d27', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                          />
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => handleUpdateCapability(c.id)}
                              style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCapId(null)}
                              style={{ padding: '6px 12px', background: '#64748b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <strong style={{ color: 'white', fontSize: '15px' }}>{c.title}</strong>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{c.description}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleCapVisibility(c)}
                              title={c.isVisible ? 'Hide Capability' : 'Show Capability'}
                              style={{ background: 'none', border: 'none', color: c.isVisible ? '#10b981' : '#94a3b8', cursor: 'pointer' }}
                            >
                              {c.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCapId(c.id);
                                setEditCapForm({ title: c.title, description: c.description || '' });
                              }}
                              style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer' }}
                              title="Edit"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCapability(c.id)}
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

        {/* TAB 5: INDUSTRIES */}
        {activeTab === 'INDUSTRIES' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: 'white' }}>Link Relevant Industry Verticals</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Select industry sectors where this practice area is actively deployed.
              </p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
                <select
                  value={selectedIndId}
                  onChange={(e) => setSelectedIndId(e.target.value ? Number(e.target.value) : '')}
                  style={{ flex: 1, padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                >
                  <option value="">Select Industry to Link...</option>
                  {availableIndustries.map((ind) => (
                    <option key={ind.id} value={ind.id}>{ind.name} (/industries/{ind.slug})</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddIndustry}
                  style={{ padding: '10px 20px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Link Industry
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Linked Industry Verticals</h3>
              {areaData.industries?.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No industries currently linked to this practice area.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {areaData.industries.map((link: any) => (
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
                        <strong style={{ color: 'white', fontSize: '15px' }}>{link.ind.name}</strong>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '12px' }}>/industries/{link.ind.slug}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveIndustry(link.id)}
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
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: 'white' }}>Link Lead Practice Area Experts</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Select team members to showcase as lead practitioners for this practice area.
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
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Linked Practice Experts</h3>
              {areaData.experts?.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No team members linked as lead experts yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {areaData.experts.map((link: any) => (
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
                Select publications or regulatory briefings to display on this practice area page.
              </p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
                <select
                  value={selectedInsightId}
                  onChange={(e) => setSelectedInsightId(e.target.value ? Number(e.target.value) : '')}
                  style={{ flex: 1, padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                >
                  <option value="">Select Insight Article to Link...</option>
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
              {areaData.insights?.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No articles linked to this practice area yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {areaData.insights.map((link: any) => (
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
                    value={areaData.finalCtaHeading || ''}
                    onChange={(e) => handleFieldChange('finalCtaHeading', e.target.value)}
                    placeholder={`Strengthen Your ${areaData.name} Architecture.`}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                  />
                </FormField>
                <FormField label="CTA Description">
                  <input
                    type="text"
                    value={areaData.finalCtaDescription || ''}
                    onChange={(e) => handleFieldChange('finalCtaDescription', e.target.value)}
                    placeholder="Schedule a confidential briefing with our practice partners..."
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
                  textValue={areaData.finalCta1Text || 'TALK TO ADVISORS'}
                  urlValue={areaData.finalCta1Href || '/contact'}
                  onChange={(txt, href) => {
                    handleFieldChange('finalCta1Text', txt);
                    handleFieldChange('finalCta1Href', href);
                  }}
                />
                <CTASelector
                  label="Secondary Final CTA Button"
                  textValue={areaData.finalCta2Text || 'BOOK A CONSULTATION'}
                  urlValue={areaData.finalCta2Href || '/book-consultation'}
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
            <SEOEditor targetType="practice-area" targetIdentifier={areaData.slug} />
          </div>
        )}

        {/* TAB 10: SETTINGS */}
        {activeTab === 'SETTINGS' && (
          <div style={{ background: 'var(--bg-surface, #1a1d27)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px', color: 'white' }}>Practice Area Entity Metadata & Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr', gap: '16px' }}>
              <FormField label="Number">
                <input
                  type="text"
                  value={areaData.number || ''}
                  onChange={(e) => handleFieldChange('number', e.target.value)}
                  placeholder="01."
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                />
              </FormField>
              <FormField label="Practice Area Name">
                <input
                  type="text"
                  value={areaData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                />
              </FormField>
              <FormField label="URL Slug (Determines /practice-areas/[slug])">
                <input
                  type="text"
                  value={areaData.slug}
                  onChange={(e) => handleFieldChange('slug', e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                />
              </FormField>
            </div>

            <div style={{ marginTop: '16px' }}>
              <IconPicker
                value={areaData.iconName || 'Shield'}
                onChange={(ic) => handleFieldChange('iconName', ic)}
              />
            </div>

            <div style={{ marginTop: '16px' }}>
              <FormField label="Short Description (Displayed on /practice-areas index card)">
                <textarea
                  rows={3}
                  value={areaData.shortDescription || ''}
                  onChange={(e) => handleFieldChange('shortDescription', e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                />
              </FormField>
            </div>

            <div style={{ marginTop: '20px' }}>
              <ImageUploadInput
                label="Practice Area Grid Cover Image URL"
                value={areaData.imageUrl || ''}
                onChange={(url) => handleFieldChange('imageUrl', url)}
              />
            </div>

            <div style={{ display: 'flex', gap: '32px', alignItems: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={areaData.isPublished}
                  onChange={(e) => handleFieldChange('isPublished', e.target.checked)}
                  style={{ width: '20px', height: '20px' }}
                />
                <span style={{ fontWeight: 600, color: 'white', fontSize: '14px' }}>Published (Visible on site)</span>
              </label>

              <FormField label="Sort Order">
                <input
                  type="number"
                  value={areaData.sortOrder}
                  onChange={(e) => handleFieldChange('sortOrder', parseInt(e.target.value, 10) || 0)}
                  style={{ width: '110px', padding: '8px 12px', background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                />
              </FormField>
            </div>
          </div>
        )}
      </div>

      {/* COLUMN 3: RIGHT PUBLISHING & CONTEXT PANEL */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', position: 'sticky', top: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              Publishing Context
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Publication Status</div>
              <span style={{
                display: 'inline-block',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 700,
                background: areaData.isPublished ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: areaData.isPublished ? '#10b981' : '#f59e0b',
                border: areaData.isPublished ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
              }}>
                {areaData.isPublished ? '● Published' : '○ Draft'}
              </span>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>URL Slug</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                /practice-areas/{areaData.slug}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Configured Services</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {servicesList.length} Practice Services
              </div>
            </div>

            <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link
                href={`/practice-areas/${areaData.slug}`}
                target="_blank"
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <ExternalLink size={14} /> Preview Live Page
              </Link>

              <button
                type="button"
                onClick={() => handleSave()}
                disabled={saving}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Save size={14} /> {saving ? 'Saving...' : 'Save Practice Area'}
              </button>
            </div>
          </div>
        </div>

        {/* STICKY BOTTOM ACTION BAR */}
        <div style={{
          position: 'sticky',
          bottom: '16px',
          marginTop: '24px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          zIndex: 40,
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: saving ? '#f59e0b' : '#10b981' }} />
            <span>{saving ? 'Saving changes...' : 'Ready to save or publish changes'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              href={`/practice-areas/${areaData.slug}`}
              target="_blank"
              className="btn btn-secondary"
            >
              <ExternalLink size={14} /> Preview Live
            </Link>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className="btn btn-primary"
            >
              <Save size={14} /> {saving ? 'Saving...' : 'Save Practice Area'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
