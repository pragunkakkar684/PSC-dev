'use client';

import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { FormField } from '../../components/FormField';
import { SEOEditor } from '../../components/SEOEditor';
import { MediaPickerModal } from '../../components/MediaPickerModal';
import {
  updatePageHero,
  updateSitePageStatus,
  updatePageSection,
  reorderPageSections,
  createPageSection,
  deletePageSection,
  saveCareersPosition,
  deleteCareersPosition,
} from '@/app/actions/cmsActions';
import type { HeroSection, PageSection, PageSeo, CareersPosition } from '@/lib/db/schema';
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
} from 'lucide-react';

interface PageEditorClientProps {
  slug: string;
  pageTitle: string;
  isPublished: boolean;
  hero: Partial<HeroSection> | null;
  sections: PageSection[];
  seo: Partial<PageSeo> | null;
  careers: CareersPosition[];
}

export function PageEditorClient({
  slug,
  pageTitle,
  isPublished: initialIsPublished,
  hero: initialHero,
  sections: initialSections,
  seo: initialSEO,
  careers: initialCareers,
}: PageEditorClientProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'sections' | 'seo' | 'settings'>('content');
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
  const [savingHero, setSavingHero] = useState(false);
  const [heroSuccess, setHeroSuccess] = useState(false);

  // Media picker modal state
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'hero' | number | null>(null);

  // New section modal state
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionType, setNewSectionType] = useState('Rich Text');
  const [newSectionTitle, setNewSectionTitle] = useState('');

  // Careers job form state
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobForm, setJobForm] = useState<Partial<CareersPosition>>({
    title: '',
    department: 'Tax Advisory',
    location: 'London, UK',
    type: 'Full-time',
    description: '',
    requirements: '',
    applicationUrl: '/contact',
  });

  // Save Hero Banner
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
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

  // Reorder Sections
  const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    setSections(newSections);
    await reorderPageSections(slug, newSections.map((s) => s.id));
  };

  // Create Section
  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await createPageSection({
      pageSlug: slug,
      sectionKey: `${newSectionType.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
      title: newSectionTitle || newSectionType,
      eyebrow: newSectionType.toUpperCase(),
      subtitle: '',
      bodyContent: '',
      imageUrl: '',
      primaryCtaText: 'Learn More',
      primaryCtaUrl: '/contact',
      secondaryCtaText: '',
      secondaryCtaUrl: '',
      sortOrder: sections.length,
      isVisible: true,
    });

    setSections([...sections, created]);
    setShowAddSection(false);
    setNewSectionTitle('');
  };

  // Delete Section
  const handleDeleteSection = async (id: number) => {
    if (!confirm('Are you sure you want to delete this section?')) return;
    setSections(sections.filter((s) => s.id !== id));
    await deletePageSection(id);
  };

  // Save Job Opening
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const saved = await saveCareersPosition(jobForm);
    if (jobForm.id) {
      setCareersList(careersList.map((j) => (j.id === jobForm.id ? saved : j)));
    } else {
      setCareersList([saved, ...careersList]);
    }
    setShowJobModal(false);
    setJobForm({ title: '', department: 'Tax Advisory', location: 'London, UK', type: 'Full-time', description: '', requirements: '', applicationUrl: '/contact' });
  };

  // Delete Job Opening
  const handleDeleteJob = async (id: number) => {
    if (!confirm('Delete this job listing?')) return;
    setCareersList(careersList.filter((j) => j.id !== id));
    await deleteCareersPosition(id);
  };

  const liveRoute = `/${slug === 'home' ? '' : slug}`;

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Header bar with publish toggle and live preview */}
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
            ROUTE: {liveRoute}
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {pageTitle} CMS Editor
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
            {isPublished ? 'Published' : 'Draft Mode'}
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
          <Layout size={16} /> Hero & Content
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
          <Layers size={16} /> Page Sections ({sections.length})
        </button>

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
          <Search size={16} /> SEO & Social Cards
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
          <Settings size={16} /> Publishing Settings
        </button>
      </div>

      {/* TAB 1: HERO & MAIN CONTENT */}
      {activeTab === 'content' && (
        <div style={{ display: 'grid', gap: '24px' }}>
          <form onSubmit={handleSaveHero} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', display: 'grid', gap: '16px' }}>
            <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)', marginBottom: '4px' }}>
              Hero Section Banner Content
            </div>

            {heroSuccess && (
              <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', borderRadius: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={16} /> Hero section updated successfully!
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <FormField label="Hero Eyebrow Text">
                <input
                  type="text"
                  value={heroForm.eyebrow || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, eyebrow: e.target.value })}
                  className="admin-input"
                  placeholder="e.g. GLOBAL ADVISORY & TAX FIRM"
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

            <FormField label="Hero Subheading / Description">
              <textarea
                rows={3}
                value={heroForm.subheading || ''}
                onChange={(e) => setHeroForm({ ...heroForm, subheading: e.target.value })}
                className="admin-input"
                placeholder="Enter hero introduction paragraph..."
              />
            </FormField>

            <FormField label="Hero Cloudinary Image URL">
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <FormField label="Primary CTA Text">
                <input
                  type="text"
                  value={heroForm.cta1Text || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, cta1Text: e.target.value })}
                  className="admin-input"
                  placeholder="e.g. Talk to our Experts"
                />
              </FormField>

              <FormField label="Primary CTA Link Target">
                <input
                  type="text"
                  value={heroForm.cta1Href || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, cta1Href: e.target.value })}
                  className="admin-input"
                  placeholder="e.g. /contact"
                />
              </FormField>
            </div>

            <button
              type="submit"
              disabled={savingHero}
              className="admin-button primary"
              style={{ width: 'fit-content', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}
            >
              <Save size={16} />
              {savingHero ? 'Saving Hero Banner...' : 'Save & Publish Hero Banner'}
            </button>
          </form>

          {/* CAREERS JOB OPENINGS MANAGER (Only for /career) */}
          {slug === 'career' && (
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', display: 'grid', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Briefcase size={20} className="text-sky-400" /> Career Job Openings ({careersList.length})
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                    Manage active job positions displayed on the public <code>/career</code> page.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setJobForm({ title: '', department: 'Tax Advisory', location: 'London, UK', type: 'Full-time', description: '', requirements: '', applicationUrl: '/contact' });
                    setShowJobModal(true);
                  }}
                  className="admin-button primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} /> Add Job Opening
                </button>
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                {careersList.map((job) => (
                  <div
                    key={job.id}
                    style={{
                      background: '#020617',
                      border: '1px solid #1e293b',
                      borderRadius: '10px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '16px', color: '#f8fafc' }}>
                        {job.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                        {job.department} · {job.location} · {job.type}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setJobForm(job);
                          setShowJobModal(true);
                        }}
                        className="admin-button secondary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Edit Job
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="admin-button secondary"
                        style={{ padding: '6px 12px', fontSize: '12px', color: '#ef4444' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SECTIONS & COMPOSITION */}
      {activeTab === 'sections' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <PageHeader
              title="Page Section Composition"
              description="Re-order sections, toggle visibility, and edit section titles, subtitles, eyebrow badges, images, and CTAs."
            />

            <button
              onClick={() => setShowAddSection(true)}
              className="admin-button primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
            >
              <Plus size={16} /> Add Custom Section
            </button>
          </div>

          {sections.length === 0 ? (
            <div style={{ padding: '40px', background: 'var(--bg-surface)', border: '1px dashed var(--border)', borderRadius: '14px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No custom sections added for this page yet. Click <strong>Add Custom Section</strong> above to create one.
            </div>
          ) : (
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
                        onClick={() => handleMoveSection(idx, 'up')}
                        disabled={idx === 0}
                        className="admin-button secondary"
                        style={{ padding: '4px 8px' }}
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveSection(idx, 'down')}
                        disabled={idx === sections.length - 1}
                        className="admin-button secondary"
                        style={{ padding: '4px 8px' }}
                        title="Move Down"
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
                        onClick={() => handleDeleteSection(sec.id)}
                        className="admin-button secondary"
                        style={{ padding: '4px 8px', color: '#ef4444' }}
                        title="Delete Section"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    <FormField label="Section Eyebrow">
                      <input
                        type="text"
                        value={sec.eyebrow || ''}
                        onChange={(e) => handleSectionChange(sec.id, { eyebrow: e.target.value })}
                        className="admin-input"
                      />
                    </FormField>

                    <FormField label="Section Title">
                      <input
                        type="text"
                        value={sec.title || ''}
                        onChange={(e) => handleSectionChange(sec.id, { title: e.target.value })}
                        className="admin-input"
                      />
                    </FormField>
                  </div>

                  <FormField label="Section Subtitle / Description">
                    <textarea
                      rows={2}
                      value={sec.subtitle || ''}
                      onChange={(e) => handleSectionChange(sec.id, { subtitle: e.target.value })}
                      className="admin-input"
                    />
                  </FormField>

                  <FormField label="Section Image URL">
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <input
                        type="text"
                        value={sec.imageUrl || ''}
                        onChange={(e) => handleSectionChange(sec.id, { imageUrl: e.target.value })}
                        className="admin-input"
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={() => setMediaPickerTarget(sec.id)}
                        className="admin-button secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                      >
                        <ImageIcon size={14} /> Picker
                      </button>
                    </div>
                  </FormField>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    <FormField label="CTA Button Text">
                      <input
                        type="text"
                        value={sec.primaryCtaText || ''}
                        onChange={(e) => handleSectionChange(sec.id, { primaryCtaText: e.target.value })}
                        className="admin-input"
                      />
                    </FormField>

                    <FormField label="CTA Button Target Link">
                      <input
                        type="text"
                        value={sec.primaryCtaUrl || ''}
                        onChange={(e) => handleSectionChange(sec.id, { primaryCtaUrl: e.target.value })}
                        className="admin-input"
                      />
                    </FormField>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            title="Publishing & System Settings"
            description="Manage live visibility status and inspect route parameters."
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

      {/* MEDIA PICKER MODAL */}
      <MediaPickerModal
        isOpen={mediaPickerTarget !== null}
        onClose={() => setMediaPickerTarget(null)}
        onSelectImage={(url) => {
          if (mediaPickerTarget === 'hero') {
            setHeroForm({ ...heroForm, imageUrl: url });
          } else if (typeof mediaPickerTarget === 'number') {
            handleSectionChange(mediaPickerTarget, { imageUrl: url });
          }
        }}
      />

      {/* ADD SECTION MODAL */}
      {showAddSection && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleCreateSection} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '500px', display: 'grid', gap: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Add New Custom Section</h3>

            <FormField label="Section Type">
              <select value={newSectionType} onChange={(e) => setNewSectionType(e.target.value)} className="admin-input">
                <option value="Rich Text">Rich Text / Paragraph</option>
                <option value="Image and Text">Image + Text Split</option>
                <option value="Two Column">Two Column Grid</option>
                <option value="Cards Grid">Cards Grid</option>
                <option value="Stats">Key Stats & Metrics</option>
                <option value="CTA Banner">CTA Callout Banner</option>
                <option value="FAQ Accordion">FAQ Accordion</option>
              </select>
            </FormField>

            <FormField label="Section Title">
              <input type="text" value={newSectionTitle} onChange={(e) => setNewSectionTitle(e.target.value)} className="admin-input" placeholder="e.g. Our Global Methodology" required />
            </FormField>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button type="button" onClick={() => setShowAddSection(false)} className="admin-button secondary">Cancel</button>
              <button type="submit" className="admin-button primary">Add Section</button>
            </div>
          </form>
        </div>
      )}

      {/* JOB OPENING MODAL */}
      {showJobModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleSaveJob} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '600px', display: 'grid', gap: '16px', maxHeight: '85vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {jobForm.id ? 'Edit Job Opening' : 'Add New Job Opening'}
            </h3>

            <FormField label="Job Title">
              <input type="text" value={jobForm.title || ''} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} className="admin-input" required />
            </FormField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <FormField label="Department">
                <input type="text" value={jobForm.department || ''} onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })} className="admin-input" required />
              </FormField>
              <FormField label="Location">
                <input type="text" value={jobForm.location || ''} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} className="admin-input" required />
              </FormField>
            </div>

            <FormField label="Job Description">
              <textarea rows={3} value={jobForm.description || ''} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} className="admin-input" />
            </FormField>

            <FormField label="Requirements (1 per line)">
              <textarea rows={4} value={jobForm.requirements || ''} onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })} className="admin-input" />
            </FormField>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button type="button" onClick={() => setShowJobModal(false)} className="admin-button secondary">Cancel</button>
              <button type="submit" className="admin-button primary">Save Job Opening</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
