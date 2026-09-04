'use client';

import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { FormField } from '../../components/FormField';
import { SEOEditor } from '../../components/SEOEditor';
import { MediaPickerModal } from '../../components/MediaPickerModal';
import { CTASelector } from '../../components/CTASelector';
import {
  updatePageHero,
  updateSitePageStatus,
  updatePageSection,
  reorderPageSections,
  createPageSection,
  deletePageSection,
  saveCareersPosition,
  deleteCareersPosition,
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
  Sparkles,
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
  const [activeTab, setActiveTab] = useState<'content' | 'sections' | 'people' | 'seo' | 'settings'>('content');
  const [isPublished, setIsPublished] = useState(initialIsPublished);
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
  const [careersList, setCareersList] = useState<CareersPosition[]>(initialCareers);
  const [practiceAreas, setPracticeAreas] = useState<PracticeAreaItem[]>(initialPracticeAreas);
  const [statsList, setStatsList] = useState<Stat[]>(initialStats);

  const [savingHero, setSavingHero] = useState(false);
  const [heroSuccess, setHeroSuccess] = useState(false);

  // Media picker modal state
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'hero' | 'pa_edit' | number | null>(null);

  // Practice area inline edit modal state
  const [editingPA, setEditingPA] = useState<PracticeAreaItem | null>(null);
  const [savingPA, setSavingPA] = useState(false);

  // Stat metric inline editing state
  const [savingStatId, setSavingStatId] = useState<number | null>(null);

  // Save Hero Banner
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate CTAs to reject '#' hash fallback
    if (heroForm.cta1Href === '#' || heroForm.cta2Href === '#') {
      alert('Validation Error: "#" is not a valid CTA target. Please select a valid route.');
      return;
    }

    setSavingHero(true);
    setHeroSuccess(false);

    try {
      await updatePageHero(slug, heroForm);
      setHeroSuccess(true);
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
    await updatePageSection(id, data);
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
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Header bar with navigation and live preview */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace', marginBottom: '4px' }}>
            PUBLIC ROUTE: {liveRoute}
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {pageTitle} Page CMS Editor
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a
            href={liveRoute}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-button secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Eye size={16} /> Live Preview <ExternalLink size={12} />
          </a>

          <button
            onClick={() => handleTogglePublish(!isPublished)}
            className={`admin-button ${isPublished ? 'success' : 'secondary'}`}
            style={{
              background: isPublished ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: isPublished ? '#10b981' : '#f59e0b',
              border: `1px solid ${isPublished ? '#10b981' : '#f59e0b'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Check size={16} />
            {isPublished ? 'Published Live' : 'Draft Mode'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', gap: '8px' }}>
        <button
          onClick={() => setActiveTab('content')}
          style={{
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 600,
            background: activeTab === 'content' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'content' ? '#38bdf8' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'content' ? '2px solid #38bdf8' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Layout size={16} /> Page Content & Sections
        </button>

        <button
          onClick={() => setActiveTab('sections')}
          style={{
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 600,
            background: activeTab === 'sections' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'sections' ? '#38bdf8' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'sections' ? '2px solid #38bdf8' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Layers size={16} /> Section Composition ({sections.length})
        </button>

        {(slug === 'team' || teamMemberList.length > 0) && (
          <button
            onClick={() => setActiveTab('people')}
            style={{
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: 600,
              background: activeTab === 'people' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'people' ? '#38bdf8' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: activeTab === 'people' ? '2px solid #38bdf8' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Users size={16} /> Team & Leadership ({teamMemberList.length})
          </button>
        )}

        <button
          onClick={() => setActiveTab('seo')}
          style={{
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 600,
            background: activeTab === 'seo' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'seo' ? '#38bdf8' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'seo' ? '2px solid #38bdf8' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Search size={16} /> SEO & Metadata
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          style={{
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 600,
            background: activeTab === 'settings' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'settings' ? '#38bdf8' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'settings' ? '2px solid #38bdf8' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Settings size={16} /> Page Settings
        </button>
      </div>

      {/* TWO-COLUMN DESKTOP LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        {/* LEFT COLUMN: MAIN CONTENT EDITORS */}
        <div>
          {activeTab === 'content' && (
            <div style={{ display: 'grid', gap: '24px' }}>
              {/* SECTION 1: HERO BANNER EDITOR FORM */}
              <form onSubmit={handleSaveHero} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', display: 'grid', gap: '16px' }}>
                <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Hero Section Banner Content
                </div>

                {heroSuccess && (
                  <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', borderRadius: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={16} /> Hero section updated and published live!
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  <FormField label="Hero Eyebrow Badge">
                    <input
                      type="text"
                      value={heroForm.eyebrow || ''}
                      onChange={(e) => setHeroForm({ ...heroForm, eyebrow: e.target.value })}
                      className="admin-input"
                      placeholder="e.g. OUR EXPERTISE"
                    />
                  </FormField>

                  <FormField label="Hero Main Heading">
                    <input
                      type="text"
                      value={heroForm.heading || ''}
                      onChange={(e) => setHeroForm({ ...heroForm, heading: e.target.value })}
                      className="admin-input"
                      placeholder="Enter main page title..."
                    />
                  </FormField>
                </div>

                <FormField label="Hero Subheading / Intro Paragraph">
                  <textarea
                    rows={3}
                    value={heroForm.subheading || ''}
                    onChange={(e) => setHeroForm({ ...heroForm, subheading: e.target.value })}
                    className="admin-input"
                    placeholder="Enter hero description..."
                  />
                </FormField>

                <FormField label="Hero Image URL">
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="text"
                      value={heroForm.imageUrl || ''}
                      onChange={(e) => setHeroForm({ ...heroForm, imageUrl: e.target.value })}
                      className="admin-input"
                      style={{ flex: 1 }}
                      placeholder="https://res.cloudinary.com/.../hero-banner.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => setMediaPickerTarget('hero')}
                      className="admin-button secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                    >
                      <ImageIcon size={16} /> Select Media
                    </button>
                  </div>
                </FormField>

                {/* RE-USABLE CTA SELECTORS */}
                <CTASelector
                  label="Primary CTA Button"
                  textValue={heroForm.cta1Text || ''}
                  urlValue={heroForm.cta1Href || ''}
                  onChange={(text, url) => setHeroForm({ ...heroForm, cta1Text: text, cta1Href: url })}
                />

                <CTASelector
                  label="Secondary CTA Button"
                  textValue={heroForm.cta2Text || ''}
                  urlValue={heroForm.cta2Href || ''}
                  onChange={(text, url) => setHeroForm({ ...heroForm, cta2Text: text, cta2Href: url })}
                />

                <button
                  type="submit"
                  disabled={savingHero}
                  className="admin-button primary"
                  style={{ width: 'fit-content', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}
                >
                  <Save size={16} />
                  {savingHero ? 'Saving Hero...' : 'Save & Publish Hero'}
                </button>
              </form>

              {/* SPECIALIZED PAGE EDITOR: PRACTICE AREAS PAGE */}
              {slug === 'practice-areas' && (
                <>
                  {/* PRACTICE AREAS ENTITIES AUDIT & REAL-TIME MANAGED CARDS */}
                  <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', display: 'grid', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Layers size={20} style={{ color: 'var(--accent)' }} /> Practice Area Entities Audit & Real-Time Management
                        </h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                          Verify completeness and edit headings, descriptions, images, and services for all 5 core practice area cards rendered on <code>/practice-areas</code>.
                        </p>
                      </div>

                      <Link href="/admin/practice-areas" className="admin-button secondary" style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        Full Entity Manager <ArrowRight size={12} />
                      </Link>
                    </div>

                    <div style={{ display: 'grid', gap: '12px' }}>
                      {practiceAreas.map((pa) => {
                        const isComplete = Boolean(pa.heading && pa.shortDescription && pa.services && pa.services.length > 0);

                        return (
                          <div
                            key={pa.id}
                            style={{
                              background: '#0e1017',
                              border: `1px solid ${isComplete ? 'var(--border)' : 'rgba(239, 68, 68, 0.4)'}`,
                              borderRadius: '8px',
                              padding: '16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '12px',
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, color: '#f3f4f6', background: '#1c202d', border: '1px solid var(--border)', padding: '2px 6px', borderRadius: '4px' }}>
                                  {pa.number || 'PA'}
                                </span>
                                <strong style={{ fontSize: '15px', color: '#f8fafc' }}>{pa.name}</strong>

                                {isComplete ? (
                                  <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <CheckCircle2 size={12} /> Complete
                                  </span>
                                ) : (
                                  <span style={{ fontSize: '11px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.15)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <AlertTriangle size={12} /> Incomplete Content
                                  </span>
                                )}
                              </div>

                              <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', fontStyle: pa.heading ? 'normal' : 'italic' }}>
                                {pa.heading || 'No card heading set'}
                              </div>

                              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                                {pa.services?.length || 0} services listed · Route: <code>/practice-areas/{pa.slug}</code>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => setEditingPA(pa)}
                                className="admin-button primary"
                                style={{ padding: '6px 14px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                <Edit3 size={14} /> Quick Edit Card
                              </button>
                              <Link
                                href={`/admin/practice-areas/${pa.id}`}
                                className="admin-button secondary"
                                style={{ padding: '6px 12px', fontSize: '12px' }}
                              >
                                Full Entity
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* STATISTICS METRICS EDITOR */}
                  <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', display: 'grid', gap: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BarChart3 size={20} style={{ color: 'var(--accent)' }} /> Key Statistics & Impact Metrics
                      </h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                        Manage the 4 key stat numbers rendered in the website Statistics section.
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                      {statsList.map((st) => (
                        <div key={st.id} style={{ background: '#0e1017', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', display: 'grid', gap: '10px' }}>
                          <FormField label="Stat Label">
                            <input
                              type="text"
                              defaultValue={st.label}
                              id={`stat-label-${st.id}`}
                              className="admin-input"
                              placeholder="e.g. YEARS OF EXPERIENCE"
                            />
                          </FormField>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <FormField label="Number Value">
                              <input
                                type="number"
                                defaultValue={st.value}
                                id={`stat-val-${st.id}`}
                                className="admin-input"
                              />
                            </FormField>
                            <FormField label="Suffix Symbol">
                              <input
                                type="text"
                                defaultValue={st.suffix}
                                id={`stat-suf-${st.id}`}
                                className="admin-input"
                                placeholder="+"
                              />
                            </FormField>
                          </div>

                          <button
                            type="button"
                            disabled={savingStatId === st.id}
                            onClick={() => {
                              const lEl = document.getElementById(`stat-label-${st.id}`) as HTMLInputElement;
                              const vEl = document.getElementById(`stat-val-${st.id}`) as HTMLInputElement;
                              const sEl = document.getElementById(`stat-suf-${st.id}`) as HTMLInputElement;
                              if (lEl && vEl && sEl) {
                                handleSaveStat(st.id, parseInt(vEl.value, 10) || 0, lEl.value, sEl.value);
                              }
                            }}
                            className="admin-button primary"
                            style={{ padding: '6px 12px', fontSize: '12px', width: 'fit-content', justifySelf: 'end' }}
                          >
                            {savingStatId === st.id ? 'Saving...' : 'Save Stat'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: SECTIONS COMPOSITION */}
          {activeTab === 'sections' && (
            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <PageHeader
                  title="Page Section Composition"
                  description="Re-order sections, toggle visibility, and edit section titles, subtitles, images, and CTAs."
                />

                <button
                  type="button"
                  onClick={() => {
                    const title = prompt('Enter new section title:');
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
                  className="admin-button primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                >
                  <Plus size={16} /> Add Custom Section
                </button>
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                {sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '14px',
                      padding: '20px',
                      opacity: sec.isVisible ? 1 : 0.6,
                      display: 'grid',
                      gap: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'monospace', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px' }}>
                          #{idx + 1} {sec.sectionKey}
                        </span>
                        <strong style={{ fontSize: '16px', color: 'var(--text-primary)' }}>{sec.title || 'Untitled Section'}</strong>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                          className="admin-button secondary"
                          style={{ padding: '4px 8px' }}
                        >
                          <ArrowUp size={14} />
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
                          className="admin-button secondary"
                          style={{ padding: '4px 8px' }}
                        >
                          <ArrowDown size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSectionChange(sec.id, { isVisible: !sec.isVisible })}
                          className={`admin-button ${sec.isVisible ? 'secondary' : 'warning'}`}
                          style={{ padding: '4px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          {sec.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                          {sec.isVisible ? 'Visible' : 'Hidden'}
                        </button>

                        <button
                          type="button"
                          onClick={async () => {
                            if (confirm('Delete section?')) {
                              setSections(sections.filter((s) => s.id !== sec.id));
                              await deletePageSection(sec.id);
                            }
                          }}
                          className="admin-button secondary"
                          style={{ padding: '4px 8px', color: '#ef4444' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                      <FormField label="Section Eyebrow">
                        <input
                          type="text"
                          value={sec.eyebrow || ''}
                          onChange={(e) => handleSectionChange(sec.id, { eyebrow: e.target.value })}
                          className="admin-input"
                        />
                      </FormField>

                      <FormField label="Section Title / Heading">
                        <input
                          type="text"
                          value={sec.title || ''}
                          onChange={(e) => handleSectionChange(sec.id, { title: e.target.value })}
                          className="admin-input"
                        />
                      </FormField>
                    </div>

                    <FormField label="Section Subtitle / Body Content">
                      <textarea
                        rows={3}
                        value={sec.bodyContent || sec.subtitle || ''}
                        onChange={(e) => handleSectionChange(sec.id, { bodyContent: e.target.value, subtitle: e.target.value })}
                        className="admin-input"
                      />
                    </FormField>

                    <CTASelector
                      label="Section Primary CTA"
                      textValue={sec.primaryCtaText || ''}
                      urlValue={sec.primaryCtaUrl || ''}
                      onChange={(t, u) => handleSectionChange(sec.id, { primaryCtaText: t, primaryCtaUrl: u })}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PEOPLE & LEADERSHIP ENTITIES */}
          {activeTab === 'people' && (
            <div style={{ display: 'grid', gap: '24px' }}>
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', display: 'grid', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={20} className="text-sky-400" /> Team & Leadership Entities ({teamMemberList.length})
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                      Manage leadership, partners, and mentors assigned to the <code>/team</code> page. Changes to team member profiles are updated in real time across the site.
                    </p>
                  </div>

                  <Link href="/admin/team/new" className="admin-button primary" style={{ fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Plus size={16} /> Add Team Member
                  </Link>
                </div>

                {/* LEADERSHIP MEMBERS */}
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#38bdf8', marginBottom: '12px', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
                    Leadership ({teamMemberList.filter((m: any) => m.category === 'leadership').length})
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    {teamMemberList.filter((m: any) => m.category === 'leadership').map((m: any) => {
                      const isComplete = Boolean(m.name && m.roleTitle && m.imageUrl && m.slug);
                      return (
                        <div key={m.id} style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={m.imageUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85'} alt={m.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{m.roleTitle}</div>
                            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                              <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: isComplete ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: isComplete ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                                {isComplete ? 'Complete' : 'Incomplete'}
                              </span>
                              <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: m.isPublished ? 'rgba(56, 189, 248, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: m.isPublished ? '#38bdf8' : '#f59e0b', fontWeight: 600 }}>
                                {m.isPublished ? 'Live' : 'Draft'}
                              </span>
                            </div>
                          </div>
                          <Link href={`/admin/team/${m.id}`} className="admin-button secondary" style={{ padding: '6px 10px', fontSize: '12px' }}>
                            Edit
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PARTNERS */}
                <div style={{ marginTop: '16px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#38bdf8', marginBottom: '12px', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
                    Partners ({teamMemberList.filter((m: any) => m.category === 'partner').length})
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    {teamMemberList.filter((m: any) => m.category === 'partner').map((m: any) => {
                      const isComplete = Boolean(m.name && m.roleTitle && m.imageUrl && m.slug);
                      return (
                        <div key={m.id} style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={m.imageUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=85'} alt={m.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{m.roleTitle} {m.specialty ? `· ${m.specialty}` : ''}</div>
                            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                              <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: isComplete ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: isComplete ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                                {isComplete ? 'Complete' : 'Incomplete'}
                              </span>
                              <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: m.isPublished ? 'rgba(56, 189, 248, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: m.isPublished ? '#38bdf8' : '#f59e0b', fontWeight: 600 }}>
                                {m.isPublished ? 'Live' : 'Draft'}
                              </span>
                            </div>
                          </div>
                          <Link href={`/admin/team/${m.id}`} className="admin-button secondary" style={{ padding: '6px 10px', fontSize: '12px' }}>
                            Edit
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* MENTORS & ADVISORS */}
                <div style={{ marginTop: '16px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#38bdf8', marginBottom: '12px', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
                    Mentors & Advisors ({teamMemberList.filter((m: any) => m.category === 'mentor' || m.category === 'advisor').length})
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    {teamMemberList.filter((m: any) => m.category === 'mentor' || m.category === 'advisor').map((m: any) => {
                      const isComplete = Boolean(m.name && m.roleTitle && m.imageUrl && m.slug);
                      return (
                        <div key={m.id} style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={m.imageUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=85'} alt={m.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{m.roleTitle}</div>
                            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                              <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: isComplete ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: isComplete ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                                {isComplete ? 'Complete' : 'Incomplete'}
                              </span>
                              <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: m.isPublished ? 'rgba(56, 189, 248, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: m.isPublished ? '#38bdf8' : '#f59e0b', fontWeight: 600 }}>
                                {m.isPublished ? 'Live' : 'Draft'}
                              </span>
                            </div>
                          </div>
                          <Link href={`/admin/team/${m.id}`} className="admin-button secondary" style={{ padding: '6px 10px', fontSize: '12px' }}>
                            Edit
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SEO & SOCIAL SHARING */}
          {activeTab === 'seo' && (
            <SEOEditor
              targetType="page"
              targetIdentifier={slug}
              initialSEO={initialSEO}
              defaultTitle={`${pageTitle} — PSC Global`}
            />
          )}

          {/* TAB 4: PUBLISHING SETTINGS */}
          {activeTab === 'settings' && (
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', display: 'grid', gap: '20px' }}>
              <PageHeader
                title="Publishing & Visibility Settings"
                description="Manage live publication status and inspect route parameters."
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#020617', borderRadius: '10px', border: '1px solid #1e293b' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '15px' }}>
                    Page Status: {isPublished ? 'LIVE ON WEBSITE' : 'DRAFT (HIDDEN)'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
                    Draft pages are restricted from public search indexing and user navigation.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleTogglePublish(!isPublished)}
                  className={`admin-button ${isPublished ? 'warning' : 'primary'}`}
                >
                  {isPublished ? 'Unpublish to Draft' : 'Publish Page Live'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: SIDEBAR PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* PUBLISHING STATUS CARD */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Publishing & Status
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: isPublished ? '#10b981' : '#f59e0b' }} />
              <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
                {isPublished ? 'Published Live' : 'Draft Mode'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleTogglePublish(!isPublished)}
              className={`admin-button ${isPublished ? 'secondary' : 'primary'}`}
              style={{ width: '100%', justifyContent: 'center', marginBottom: '12px' }}
            >
              {isPublished ? 'Switch to Draft' : 'Publish Live Now'}
            </button>

            <a
              href={liveRoute}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-button secondary"
              style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Eye size={14} /> Open Live Page <ExternalLink size={12} />
            </a>
          </div>

          {/* QUICK SEO SUMMARY CARD */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Search size={14} className="text-sky-400" /> SEO Meta Summary
            </div>

            <div style={{ fontSize: '13px', fontWeight: 600, color: '#38bdf8', marginBottom: '4px', lineHeight: 1.3 }}>
              {initialSEO?.metaTitle || `${pageTitle} — PSC Global`}
            </div>

            <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.4, marginBottom: '12px' }}>
              {initialSEO?.metaDescription
                ? initialSEO.metaDescription.substring(0, 100) + '...'
                : 'No custom meta description set.'}
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className="admin-button secondary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '12px' }}
            >
              Edit Full SEO Metadata
            </button>
          </div>
        </div>
      </div>

      {/* MEDIA PICKER MODAL */}
      <MediaPickerModal
        isOpen={mediaPickerTarget !== null}
        onClose={() => setMediaPickerTarget(null)}
        onSelectImage={(url) => {
          if (mediaPickerTarget === 'hero') {
            setHeroForm({ ...heroForm, imageUrl: url });
          } else if (mediaPickerTarget === 'pa_edit' && editingPA) {
            setEditingPA({ ...editingPA, imageUrl: url });
          } else if (typeof mediaPickerTarget === 'number') {
            handleSectionChange(mediaPickerTarget, { imageUrl: url });
          }
        }}
      />

      {/* PRACTICE AREA INLINE QUICK EDIT MODAL */}
      {editingPA && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleSavePAEdit} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '650px', display: 'grid', gap: '16px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Quick Edit Practice Area: {editingPA.name}
              </h3>
              <button type="button" onClick={() => setEditingPA(null)} className="admin-button secondary">✕</button>
            </div>

            <FormField label="Practice Area Name">
              <input type="text" value={editingPA.name} onChange={(e) => setEditingPA({ ...editingPA, name: e.target.value })} className="admin-input" required />
            </FormField>

            <FormField label="Card Heading">
              <input type="text" value={editingPA.heading || ''} onChange={(e) => setEditingPA({ ...editingPA, heading: e.target.value })} className="admin-input" placeholder="e.g. Rigorous Oversight for Uncompromising Integrity." required />
            </FormField>

            <FormField label="Short Description">
              <textarea rows={3} value={editingPA.shortDescription || ''} onChange={(e) => setEditingPA({ ...editingPA, shortDescription: e.target.value })} className="admin-input" required />
            </FormField>

            <FormField label="Card Image URL">
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" value={editingPA.imageUrl || ''} onChange={(e) => setEditingPA({ ...editingPA, imageUrl: e.target.value })} className="admin-input" style={{ flex: 1 }} />
                <button type="button" onClick={() => setMediaPickerTarget('pa_edit')} className="admin-button secondary"><ImageIcon size={16} /> Select</button>
              </div>
            </FormField>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button type="button" onClick={() => setEditingPA(null)} className="admin-button secondary">Cancel</button>
              <button type="submit" disabled={savingPA} className="admin-button primary">
                {savingPA ? 'Saving...' : 'Save Practice Area Card'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
