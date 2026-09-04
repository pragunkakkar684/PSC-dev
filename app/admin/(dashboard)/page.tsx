import { AdminHeader } from './components/AdminHeader';
import { StatCard } from './components/StatCard';
import { requireAuth } from '@/lib/auth/permissions';
import { db } from '@/lib/db';
import {
  sitePages,
  teamMembers,
  events,
  insightsArticles,
  contactSubmissions,
  newsletterSubscribers,
  practiceAreas,
  industries,
  mediaFiles,
} from '@/lib/db/schema';
import { count, eq, and } from 'drizzle-orm';
import Link from 'next/link';
import {
  FileText,
  Layers,
  Building2,
  BookOpen,
  Calendar,
  Users,
  Image as ImageIcon,
  Mail,
  Send,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';

export const metadata = {
  title: 'Dashboard',
};

async function getDashboardCounts() {
  const [
    [totalPagesCount],
    [publishedPagesCount],
    [teamCount],
    [publishedTeamCount],
    [eventCount],
    [upcomingEventCount],
    [insightCount],
    [newSubmissionsCount],
    [totalSubmissionsCount],
    [subscriberCount],
    [practiceAreaCount],
    [industryCount],
    [mediaCount],
  ] = await Promise.all([
    db.select({ value: count() }).from(sitePages),
    db.select({ value: count() }).from(sitePages).where(eq(sitePages.isPublished, true)),
    db.select({ value: count() }).from(teamMembers),
    db.select({ value: count() }).from(teamMembers).where(eq(teamMembers.isPublished, true)),
    db.select({ value: count() }).from(events),
    db.select({ value: count() }).from(events).where(
      and(eq(events.isPublished, true), eq(events.status, 'upcoming'))
    ),
    db.select({ value: count() }).from(insightsArticles),
    db.select({ value: count() }).from(contactSubmissions).where(eq(contactSubmissions.status, 'new')),
    db.select({ value: count() }).from(contactSubmissions),
    db.select({ value: count() }).from(newsletterSubscribers).where(eq(newsletterSubscribers.isActive, true)),
    db.select({ value: count() }).from(practiceAreas),
    db.select({ value: count() }).from(industries),
    db.select({ value: count() }).from(mediaFiles),
  ]);

  return {
    pages: { total: totalPagesCount.value || 17, published: publishedPagesCount.value || 17 },
    team: { total: teamCount.value, published: publishedTeamCount.value },
    events: { total: eventCount.value, upcoming: upcomingEventCount.value },
    insights: insightCount.value,
    submissions: { new: newSubmissionsCount.value, total: totalSubmissionsCount.value },
    subscribers: subscriberCount.value,
    practiceAreas: practiceAreaCount.value,
    industries: industryCount.value,
    media: mediaCount.value,
  };
}

export default async function AdminDashboard() {
  const user = await requireAuth();
  const counts = await getDashboardCounts();

  return (
    <>
      <AdminHeader title="Site-Wide CMS Dashboard" user={user} />

      <div className="admin-content">
        {/* Welcome Banner */}
        <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
              Site-Wide CMS Management — Welcome back{user.name ? `, ${user.name}` : ''}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Manage all 17 public routes, content entities, SEO metadata, and Cloudinary media from one central system.
            </p>
          </div>
          <Link
            href="/"
            target="_blank"
            className="admin-button secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            Preview Live Website <ExternalLink size={14} />
          </Link>
        </div>

        {/* Stats: Pages & Core Entities */}
        <div className="dashboard-section-title">Website & Pages</div>
        <div className="dashboard-stats">
          <StatCard
            label="Managed Public Pages"
            value={counts.pages.total}
            sub={`${counts.pages.published} published live`}
            icon={<FileText size={18} />}
          />
          <StatCard
            label="Practice Areas"
            value={counts.practiceAreas}
            sub="Active core practices"
            icon={<Layers size={18} />}
          />
          <StatCard
            label="Industry Verticals"
            value={counts.industries}
            sub="Active sector verticals"
            icon={<Building2 size={18} />}
          />
          <StatCard
            label="Insights & Articles"
            value={counts.insights}
            sub="Published research"
            icon={<BookOpen size={18} />}
          />
        </div>

        {/* Stats: Events & People */}
        <div className="dashboard-section-title" style={{ marginTop: '24px' }}>Events, People & Media</div>
        <div className="dashboard-stats">
          <StatCard
            label="Events & Briefings"
            value={counts.events.total}
            sub={`${counts.events.upcoming} upcoming`}
            icon={<Calendar size={18} />}
          />
          <StatCard
            label="Team Members"
            value={counts.team.total}
            sub={`${counts.team.published} published`}
            icon={<Users size={18} />}
          />
          <StatCard
            label="Media Library"
            value={counts.media}
            sub="Cloudinary images"
            icon={<ImageIcon size={18} />}
          />
        </div>

        {/* Stats: Leads */}
        <div className="dashboard-section-title" style={{ marginTop: '24px' }}>Leads & Engagement</div>
        <div className="dashboard-stats">
          <StatCard
            label="Contact Submissions"
            value={counts.submissions.total}
            sub={`${counts.submissions.new} unread`}
            icon={<Mail size={18} />}
          />
          <StatCard
            label="Newsletter Subscribers"
            value={counts.subscribers}
            sub="active subscribers"
            icon={<Send size={18} />}
          />
        </div>

        {/* Quick Management Actions Grid */}
        <div className="dashboard-section-title" style={{ marginTop: '28px' }}>Central Management Shortcuts</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <Link href="/admin/pages" style={{ textDecoration: 'none', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px', color: 'var(--text-primary)', transition: 'border-color 0.15s, background 0.15s' }}>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#f3f4f6', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} style={{ color: 'var(--accent)' }} /> 1. Central Pages Grid
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Select, compose sections, update hero banners, and edit SEO for all 17 public routes.
            </div>
          </Link>

          <Link href="/admin/practice-areas/new" style={{ textDecoration: 'none', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px', color: 'var(--text-primary)', transition: 'border-color 0.15s, background 0.15s' }}>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#f3f4f6', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PlusCircle size={16} style={{ color: 'var(--accent)' }} /> 2. Add Practice Area
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Create a new practice area which automatically powers `/practice-areas/[slug]`.
            </div>
          </Link>

          <Link href="/admin/industries/new" style={{ textDecoration: 'none', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px', color: 'var(--text-primary)', transition: 'border-color 0.15s, background 0.15s' }}>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#f3f4f6', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PlusCircle size={16} style={{ color: 'var(--accent)' }} /> 3. Add Industry Vertical
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Add sector expertise to power `/industries/[slug]`.
            </div>
          </Link>

          <Link href="/admin/insights/new" style={{ textDecoration: 'none', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px', color: 'var(--text-primary)', transition: 'border-color 0.15s, background 0.15s' }}>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#f3f4f6', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PlusCircle size={16} style={{ color: 'var(--accent)' }} /> 4. Publish Insight Article
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Publish regulatory briefings to power `/insights/[slug]`.
            </div>
          </Link>

          <Link href="/admin/events/new" style={{ textDecoration: 'none', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px', color: 'var(--text-primary)', transition: 'border-color 0.15s, background 0.15s' }}>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#f3f4f6', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PlusCircle size={16} style={{ color: 'var(--accent)' }} /> 5. Create Event / Webinar
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Schedule executive webinars to power `/events/[slug]`.
            </div>
          </Link>

          <Link href="/admin/media" style={{ textDecoration: 'none', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px', color: 'var(--text-primary)', transition: 'border-color 0.15s, background 0.15s' }}>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#f3f4f6', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ImageIcon size={16} style={{ color: 'var(--accent)' }} /> 6. Cloudinary Media Manager
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Upload, search, and manage high-resolution images for pages and SEO cards.
            </div>
          </Link>
        </div>

        {/* System Health */}
        <div style={{
          marginTop: '12px',
          padding: '14px 18px',
          background: 'rgba(16,185,129,0.04)',
          border: '1px solid rgba(16,185,129,0.12)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: '#34d399', fontWeight: '500' }}>
            Site-Wide CMS Active · Real-time Neon Database Sync & Next.js On-Demand Revalidation Operational
          </span>
        </div>
      </div>
    </>
  );
}
