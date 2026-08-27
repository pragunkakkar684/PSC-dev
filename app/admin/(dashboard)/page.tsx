import { AdminHeader } from './components/AdminHeader';
import { StatCard } from './components/StatCard';
import { requireAuth } from '@/lib/auth/permissions';
import { db } from '@/lib/db';
import {
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

export const metadata = {
  title: 'Dashboard',
};

async function getDashboardCounts() {
  const [
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
      <AdminHeader title="Dashboard" user={user} />

      <div className="admin-content">
        {/* Welcome */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
            Welcome back{user.name ? `, ${user.name}` : ''}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            PSC Global CMS — all systems operational.
          </p>
        </div>

        {/* Stats: Content */}
        <div className="dashboard-section-title">Content</div>
        <div className="dashboard-stats">
          <StatCard
            label="Team Members"
            value={counts.team.total}
            sub={`${counts.team.published} published`}
            icon={
              <svg width="18" height="18" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                <circle cx="6" cy="5" r="2.5" />
                <path d="M1 13c0-2.76 2.24-5 5-5h0c2.76 0 5 2.24 5 5" strokeLinecap="round" />
                <circle cx="12" cy="5" r="2" />
                <path d="M14.5 13c0-2.21-1.12-4-2.5-4" strokeLinecap="round" />
              </svg>
            }
          />
          <StatCard
            label="Events"
            value={counts.events.total}
            sub={`${counts.events.upcoming} upcoming`}
            icon={
              <svg width="18" height="18" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" />
                <path d="M1.5 6.5h13M5 1v3M11 1v3" strokeLinecap="round" />
              </svg>
            }
          />
          <StatCard
            label="Insights"
            value={counts.insights}
            icon={
              <svg width="18" height="18" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 12.5h12M2 9.5h8M2 6.5h10M2 3.5h6" strokeLinecap="round" />
              </svg>
            }
          />
          <StatCard
            label="Practice Areas"
            value={counts.practiceAreas}
            icon={
              <svg width="18" height="18" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="8" r="6.5" />
                <path d="M8 4v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <StatCard
            label="Industries"
            value={counts.industries}
            icon={
              <svg width="18" height="18" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                <path d="M1.5 14V8l4-4 4 4V14" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <StatCard
            label="Media Files"
            value={counts.media}
            icon={
              <svg width="18" height="18" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" />
                <circle cx="5.5" cy="6" r="1.25" />
                <path d="M1.5 11l3.5-3 3 3 2-2 3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
        </div>

        {/* Stats: Leads */}
        <div className="dashboard-section-title" style={{ marginTop: '8px' }}>Leads & Subscribers</div>
        <div className="dashboard-stats">
          <StatCard
            label="Contact Submissions"
            value={counts.submissions.total}
            sub={`${counts.submissions.new} unread`}
            icon={
              <svg width="18" height="18" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" />
                <path d="M1.5 5.5l6.5 4 6.5-4" />
              </svg>
            }
          />
          <StatCard
            label="Newsletter Subscribers"
            value={counts.subscribers}
            sub="active subscribers"
            icon={
              <svg width="18" height="18" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 8l6-5 6 5M2 8v5.5A.5.5 0 0 0 2.5 14h11a.5.5 0 0 0 .5-.5V8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
        </div>

        {/* Home Page CMS Control Notice */}
        <div style={{
          marginBottom: '28px',
          padding: '20px',
          background: 'rgba(59,130,246,0.08)',
          border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: '12px',
        }}>
          <div style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#60a5fa', marginBottom: '6px' }}>
            🎯 Home Page CMS Mode Active
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Changes made in this CMS immediately update the live Home page (<code>/</code>). Non-home page editing is currently restricted.
          </p>
        </div>

        {/* Quick Links for Home Page Editing */}
        <div className="dashboard-section-title">Home Page Sections (Editable)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <a href="/admin/pages" style={{ textDecoration: 'none', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', display: 'block', color: 'var(--text-primary)' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#60a5fa', marginBottom: '4px' }}>1. Hero Banner</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Edit Eyebrow, Heading, Subheading & Hero Image</div>
          </a>
          <a href="/admin/practice-areas" style={{ textDecoration: 'none', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', display: 'block', color: 'var(--text-primary)' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#60a5fa', marginBottom: '4px' }}>2. Practice Areas</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{counts.practiceAreas} Core Competency Cards on Home</div>
          </a>
          <a href="/admin/industries" style={{ textDecoration: 'none', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', display: 'block', color: 'var(--text-primary)' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#60a5fa', marginBottom: '4px' }}>3. Sectors & Industries</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{counts.industries} Sector & Industry Cards on Home</div>
          </a>
          <a href="/admin/insights" style={{ textDecoration: 'none', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', display: 'block', color: 'var(--text-primary)' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#60a5fa', marginBottom: '4px' }}>4. Insights Articles</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{counts.insights} Articles on Home Page</div>
          </a>
          <a href="/admin/team" style={{ textDecoration: 'none', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', display: 'block', color: 'var(--text-primary)' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#60a5fa', marginBottom: '4px' }}>5. Team Members</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{counts.team.total} Leadership Profiles on Home</div>
          </a>
          <a href="/admin/testimonials" style={{ textDecoration: 'none', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', display: 'block', color: 'var(--text-primary)' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#60a5fa', marginBottom: '4px' }}>6. Testimonials</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Client Testimonial Cards on Home</div>
          </a>
        </div>

        {/* System status */}
        <div style={{
          marginTop: '12px',
          padding: '16px 20px',
          background: 'rgba(16,185,129,0.05)',
          border: '1px solid rgba(16,185,129,0.12)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: '#34d399', fontWeight: '500' }}>
            Database connected · Real-time cache revalidation enabled for Home Page
          </span>
        </div>
      </div>
    </>
  );
}
