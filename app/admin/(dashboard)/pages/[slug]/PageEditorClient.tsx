'use client';

import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { FormField } from '../../components/FormField';
import { SEOEditor } from '../../components/SEOEditor';
import { MediaPickerModal } from '../../components/MediaPickerModal';
import { CTASelector } from '../../components/CTASelector';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import {
  updatePageHero,
  updateSitePageStatus,
  updatePageSection,
  reorderPageSections,
  createPageSection,
  deletePageSection,
  updateStatMetric,
  updatePracticeAreaInline,
} from '@/app/actions/cmsActions';
import type { HeroSection, PageSection, PageSeo, CareersPosition, Stat } from '@/lib/db/schema';
import Link from 'next/link';
import {
  Layout,
  Layers,
  Search,
  Settings,
  Save,
  Check,
  Eye,
  ArrowUp,
  ArrowDown,
  EyeOff,
  Plus,
  Trash2,
  ExternalLink,
  Image as ImageIcon,
  Briefcase,
  Globe,
  Building2,
  BookOpen,
  Calendar,
  Users,
  Quote,
  HelpCircle,
  MapPin,
  ArrowRight,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Edit3,
  Monitor,
  Tablet,
  Smartphone,
  History,
  RotateCcw,
  Clock,
  Columns,
} from 'lucide-react';

interface PracticeAreaItem {
  id: number;
  slug: string;
  number: string | null;
  name: string;
  heading: string | null;
  shortDescription: string | null;
  imageUrl: string | null;
  isPublished: boolean;
  services?: Array<{ id: number; name: string }>;
}

interface PageEditorClientProps {
  slug: string;
  pageTitle: string;
  isPublished: boolean;
  hero: Partial<HeroSection> | null;
  sections: PageSection[];
  seo: Partial<PageSeo> | null;
  careers: CareersPosition[];
  practiceAreasList?: PracticeAreaItem[];
  statList?: Stat[];
  teamMemberList?: any[];
}

export function PageEditorClient({
  slug,
  pageTitle,
  isPublished: initialIsPublished,
  hero: initialHero,
  sections: initialSections,
  seo: initialSEO,
  careers: initialCareers,
  practiceAreasList: initialPracticeAreas = [],
  statList: initialStats = [],
  teamMemberList = [],
}: PageEditorClientProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'sections' | 'revisions' | 'seo' | 'settings'>('content');
  const [isPublished, setIsPublished] = useState(initialIsPublished);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');

  // Preview Mode
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const [heroForm, setHeroForm] = useState<Partial<HeroSection>>(
    initialHero || {
      eyebrow: '',
      heading: '',
      subheading: '',
      imageUrl: '',
      cta1Text: '',
      cta1Href: '',
      cta2Text: '',
      cta2Href: '',
    }
  );

  const [sections, setSections] = useState<PageSection[]>(initialSections);
  const [practiceAreas, setPracticeAreas] = useState<PracticeAreaItem[]>(initialPracticeAreas);
  const [statsList, setStatsList] = useState<Stat[]>(initialStats);

  const [savingHero, setSavingHero] = useState(false);
  const [heroSuccess, setHeroSuccess] = useState(false);

  // Mock revisions history
  const [revisions, setRevisions] = useState([
    { version: 3, title: 'Updated Hero Banner & CTAs', author: 'Admin User', date: '10 minutes ago' },
    { version: 2, title: 'Modified Section Order & Practice Highlights', author: 'Editor User', date: '2 hours ago' },
    { version: 1, title: 'Initial Published Baseline', author: 'System Seed', date: '1 day ago' },
  ]);

  // Media picker modal state
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'hero' | 'pa_edit' | number | null>(null);

  // Practice area inline edit modal state
  const [editingPA, setEditingPA] = useState<PracticeAreaItem | null>(null);
  const [savingPA, setSavingPA] = useState(false);
  const [savingStatId, setSavingStatId] = useState<number | null>(null);

  // Save Hero Banner
  const handleSaveHero = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (heroForm.cta1Href === '#' || heroForm.cta2Href === '#') {
      alert('Validation Error: "#" is not a valid CTA target. Please select a valid route.');
      return;
    }

    setSavingHero(true);
    setHeroSuccess(false);
    setAutosaveStatus('saving');

    try {
      await updatePageHero(slug, heroForm);
      setHeroSuccess(true);
      setAutosaveStatus('saved');
      setHasUnsavedChanges(false);
      setLastSavedTime(new Date().toLocaleTimeString());
      setTimeout(() => setHeroSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update hero banner');
    } finally {
      setSavingHero(false);
    }
  };

  // Toggle Page Status
  const handleTogglePublish = async (status: boolean) => {
    setIsPublished(status);
    await updateSitePageStatus(slug, status);
  };

  // Update Section
  const handleSectionChange = async (id: number, data: Partial<PageSection>) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, ...data } : s)));
    setHasUnsavedChanges(true);
    await updatePageSection(id, data);
    setHasUnsavedChanges(false);
    setLastSavedTime(new Date().toLocaleTimeString());
  };

  // Update Stat Metric
  const handleSaveStat = async (id: number, value: number, label: string, suffix: string) => {
    setSavingStatId(id);
    await updateStatMetric(id, { value, label, suffix });
    setStatsList(statsList.map((st) => (st.id === id ? { ...st, value, label, suffix } : st)));
    setSavingStatId(null);
  };

  // Save Inline Practice Area Edit
  const handleSavePAEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPA) return;
    setSavingPA(true);

    try {
      const updated = await updatePracticeAreaInline(editingPA.id, {
        name: editingPA.name,
        heading: editingPA.heading,
        shortDescription: editingPA.shortDescription,
        imageUrl: editingPA.imageUrl,
        isPublished: editingPA.isPublished,
      });

      setPracticeAreas(practiceAreas.map((pa) => (pa.id === editingPA.id ? { ...pa, ...updated } : pa)));
      setEditingPA(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update practice area entity');
    } finally {
      setSavingPA(false);
    }
  };

  const liveRoute = `/${slug === 'home' ? '' : slug}`;

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {/* BREADCRUMBS */}
      <Breadcrumbs
        items={[
          { label: 'WEBSITE', href: '/admin/pages' },
          { label: 'PAGES', href: '/admin/pages' },
          { label: pageTitle.toUpperCase() },
        ]}
      />

      {/* HEADER STATUS & PREVIEW TOOLBAR */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', background: 'rgba(197,155,39,0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(197,155,39,0.2)' }}>
              LOCATION: Website → {pageTitle}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Route: {liveRoute}</span>
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
            {pageTitle} Page Section Editor
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: 'var(--bg-elevated)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}>
            <Clock size={14} className="text-slate-400" />
            <span className="text-slate-400">
              {autosaveStatus === 'saving' ? 'Saving...' : `Saved (${lastSavedTime})`}
            </span>
          </div>

          {/* Split Screen Preview Toggle */}
          <button
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`admin-button ${showLivePreview ? 'primary' : 'secondary'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Columns size={15} />
            {showLivePreview ? 'Hide Split Preview' : 'Split Live Preview'}
          </button>

          {/* Publish Action Button */}
          <button
            onClick={() => handleTogglePublish(!isPublished)}
            className={`admin-button ${isPublished ? 'success' : 'secondary'}`}
            style={{
              background: isPublished ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: isPublished ? '#10b981' : '#f59e0b',
              border: `1px solid ${isPublished ? '#10b981' : '#f59e0b'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Check size={16} />
            {isPublished ? 'Published Live' : 'Publish Page'}
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', gap: '8px' }}>
        <button
          onClick={() => setActiveTab('content')}
          style={{
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: 600,
            background: activeTab === 'content' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'content' ? 'var(--accent)' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'content' ? '2px solid var(--accent)' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Layout size={15} /> Page Hero & Details
        </button>

        <button
          onClick={() => setActiveTab('sections')}
          style={{
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: 600,
            background: activeTab === 'sections' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'sections' ? 'var(--accent)' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'sections' ? '2px solid var(--accent)' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Layers size={15} /> Section Composition ({sections.length})
        </button>

        <button
          onClick={() => setActiveTab('revisions')}
          style={{
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: 600,
            background: activeTab === 'revisions' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'revisions' ? 'var(--accent)' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'revisions' ? '2px solid var(--accent)' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <History size={15} /> Revision History
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          style={{
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: 600,
            background: activeTab === 'seo' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'seo' ? 'var(--accent)' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'seo' ? '2px solid var(--accent)' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Search size={15} /> SEO Metadata
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          style={{
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: 600,
            background: activeTab === 'settings' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'settings' ? 'var(--accent)' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'settings' ? '2px solid var(--accent)' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Settings size={15} /> Page Settings
        </button>
      </div>

      {/* SPLIT SCREEN CONTAINER */}
      <div style={{ display: 'grid', gridTemplateColumns: showLivePreview ? '1fr 1fr' : '1fr', gap: '20px' }}>
        {/* LEFT COLUMN: CMS EDITORS */}
        <div style={{ display: 'grid', gap: '20px' }}>
          {activeTab === 'content' && (
            <div style={{ display: 'grid', gap: '20px' }}>
              {/* HERO SECTION FORM */}
              <form onSubmit={handleSaveHero} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', display: 'grid', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      Page Hero Section Content
                    </h3>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                      Used on: <strong>Website → {pageTitle} → Hero Banner</strong>
                    </p>
                  </div>
                </div>

                {heroSuccess && (
                  <div style={{ padding: '10px 14px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={16} /> Hero section saved and updated!
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  <FormField label="Hero Eyebrow Badge">
                    <input
                      type="text"
                      value={heroForm.eyebrow || ''}
                      onChange={(e) => {
                        setHeroForm({ ...heroForm, eyebrow: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      className="form-input"
                      placeholder="e.g. GLOBAL TAX ADVISORY"
                    />
                  </FormField>

                  <FormField label="Hero Main Heading">
                    <input
                      type="text"
                      value={heroForm.heading || ''}
                      onChange={(e) => {
                        setHeroForm({ ...heroForm, heading: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      className="form-input"
                      placeholder="Enter hero title..."
                    />
                  </FormField>
                </div>

                <FormField label="Hero Subheading / Summary">
                  <textarea
                    rows={3}
                    value={heroForm.subheading || ''}
                    onChange={(e) => {
                      setHeroForm({ ...heroForm, subheading: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                    className="form-textarea"
                    placeholder="Enter hero summary text..."
                  />
                </FormField>

                <FormField label="Hero Image URL">
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      value={heroForm.imageUrl || ''}
                      onChange={(e) => {
                        setHeroForm({ ...heroForm, imageUrl: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      className="form-input"
                      placeholder="https://res.cloudinary.com/..."
                    />
                    <button
                      type="button"
                      onClick={() => setMediaPickerTarget('hero')}
                      className="btn btn-secondary"
                    >
                      <ImageIcon size={15} /> Select
                    </button>
                  </div>
                </FormField>

                <CTASelector
                  label="Primary CTA Button"
                  textValue={heroForm.cta1Text || ''}
                  urlValue={heroForm.cta1Href || ''}
                  onChange={(text, url) => {
                    setHeroForm({ ...heroForm, cta1Text: text, cta1Href: url });
                    setHasUnsavedChanges(true);
                  }}
                />

                <CTASelector
                  label="Secondary CTA Button"
                  textValue={heroForm.cta2Text || ''}
                  urlValue={heroForm.cta2Href || ''}
                  onChange={(text, url) => {
                    setHeroForm({ ...heroForm, cta2Text: text, cta2Href: url });
                    setHasUnsavedChanges(true);
                  }}
                />

                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button
                    type="submit"
                    disabled={savingHero}
                    className="btn btn-primary"
                  >
                    <Save size={15} />
                    {savingHero ? 'Saving Draft...' : 'Save Draft & Update Hero'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECTION COMPOSITION TAB */}
          {activeTab === 'sections' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                  Page sections visually define the structure of <code>{liveRoute}</code>. Drag or click arrows to reorder.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const title = prompt('Enter section title:');
                    if (title) {
                      createPageSection({
                        pageSlug: slug,
                        sectionKey: `custom_${Date.now()}`,
                        title,
                        eyebrow: 'SECTION',
                        subtitle: '',
                        bodyContent: '',
                        imageUrl: '',
                        primaryCtaText: 'Learn More',
                        primaryCtaUrl: '/contact',
                        sortOrder: sections.length,
                        isVisible: true,
                      }).then((created) => setSections([...sections, created]));
                    }
                  }}
                  className="btn btn-primary"
                >
                  <Plus size={15} /> Add Section
                </button>
              </div>

              <div style={{ display: 'grid', gap: '14px' }}>
                {sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '16px',
                      display: 'grid',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'monospace', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '4px' }}>
                          #{idx + 1} {sec.sectionKey}
                        </span>
                        <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{sec.title || 'Untitled Section'}</strong>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            if (idx > 0) {
                              const nList = [...sections];
                              const [moved] = nList.splice(idx, 1);
                              nList.splice(idx - 1, 0, moved);
                              setSections(nList);
                              reorderPageSections(slug, nList.map((s) => s.id));
                            }
                          }}
                          disabled={idx === 0}
                          className="btn btn-secondary"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (idx < sections.length - 1) {
                              const nList = [...sections];
                              const [moved] = nList.splice(idx, 1);
                              nList.splice(idx + 1, 0, moved);
                              setSections(nList);
                              reorderPageSections(slug, nList.map((s) => s.id));
                            }
                          }}
                          disabled={idx === sections.length - 1}
                          className="btn btn-secondary"
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSectionChange(sec.id, { isVisible: !sec.isVisible })}
                          className="btn btn-secondary"
                        >
                          {sec.isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                          {sec.isVisible ? 'Visible' : 'Hidden'}
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <FormField label="Eyebrow Badge">
                        <input
                          type="text"
                          value={sec.eyebrow || ''}
                          onChange={(e) => handleSectionChange(sec.id, { eyebrow: e.target.value })}
                          className="form-input"
                        />
                      </FormField>
                      <FormField label="Section Title">
                        <input
                          type="text"
                          value={sec.title || ''}
                          onChange={(e) => handleSectionChange(sec.id, { title: e.target.value })}
                          className="form-input"
                        />
                      </FormField>
                    </div>

                    <FormField label="Section Subtitle / Description">
                      <textarea
                        rows={2}
                        value={sec.bodyContent || sec.subtitle || ''}
                        onChange={(e) => handleSectionChange(sec.id, { bodyContent: e.target.value, subtitle: e.target.value })}
                        className="form-textarea"
                      />
                    </FormField>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REVISION HISTORY TAB */}
          {activeTab === 'revisions' && (
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', display: 'grid', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <History size={18} className="text-amber-400" /> Revision History & Rollback Log
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Track edits to this page and restore prior versions if needed.
                </p>
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                {revisions.map((rev) => (
                  <div key={rev.version} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '10px', background: 'var(--accent)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                          v{rev.version}
                        </span>
                        {rev.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Edited by {rev.author} • {rev.date}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert(`Restored revision v${rev.version}!`)}
                      className="btn btn-secondary"
                      style={{ fontSize: '11px' }}
                    >
                      <RotateCcw size={13} /> Restore v{rev.version}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO TAB */}
          {activeTab === 'seo' && (
            <SEOEditor
              targetType="page"
              targetIdentifier={slug}
              initialSEO={initialSEO}
              defaultTitle={`${pageTitle} — PSC Global`}
            />
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', display: 'grid', gap: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Page Settings</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'var(--bg-elevated)', borderRadius: '8px' }}>
                <div>
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Publication Status</strong>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{isPublished ? 'Page is currently live' : 'Page is hidden in draft mode'}</p>
                </div>
                <button
                  onClick={() => handleTogglePublish(!isPublished)}
                  className={`btn ${isPublished ? 'btn-danger' : 'btn-primary'}`}
                >
                  {isPublished ? 'Unpublish Page' : 'Publish Page'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: SPLIT SCREEN DEVICE PREVIEW FRAME */}
        {showLivePreview && (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', height: '80vh', position: 'sticky', top: '20px' }}>
            {/* Device Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={15} className="text-emerald-400" /> Live Website Preview
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`btn ${previewDevice === 'desktop' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '4px 8px' }}
                  title="Desktop Viewport"
                >
                  <Monitor size={14} />
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`btn ${previewDevice === 'tablet' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '4px 8px' }}
                  title="Tablet Viewport"
                >
                  <Tablet size={14} />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`btn ${previewDevice === 'mobile' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '4px 8px' }}
                  title="Mobile Viewport"
                >
                  <Smartphone size={14} />
                </button>
              </div>
            </div>

            {/* Iframe Viewport Container */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
              <iframe
                src={liveRoute}
                title="Live Website Preview"
                style={{
                  width: previewDevice === 'mobile' ? '375px' : previewDevice === 'tablet' ? '768px' : '100%',
                  height: '100%',
                  border: 'none',
                  background: '#ffffff',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* MEDIA PICKER MODAL */}
      <MediaPickerModal
        isOpen={mediaPickerTarget !== null}
        onClose={() => setMediaPickerTarget(null)}
        onSelectImage={(url) => {
          if (mediaPickerTarget === 'hero') {
            setHeroForm({ ...heroForm, imageUrl: url });
            setHasUnsavedChanges(true);
          } else if (typeof mediaPickerTarget === 'number') {
            handleSectionChange(mediaPickerTarget, { imageUrl: url });
          }
        }}
      />
    </div>
  );
}
