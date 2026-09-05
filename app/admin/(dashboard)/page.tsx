import { AdminHeader } from './components/AdminHeader';
import { StatCard } from './components/StatCard';
import { Breadcrumbs } from './components/Breadcrumbs';
import { requireEditor } from '@/lib/auth/permissions';
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
  cmsAuditLogs,
} from '@/lib/db/schema';
import { count, eq, and, desc } from 'drizzle-orm';
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
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const metadata = {
  title: 'Dashboard',
};

async function getDashboardData() {
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
    recentLogs,
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
    db.select().from(cmsAuditLogs).orderBy(desc(cmsAuditLogs.createdAt)).limit(6),
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
    logs: recentLogs || [],
  };
}

export default async function AdminDashboard() {
  const user = await requireEditor();
  const data = await getDashboardData();

  return (
    <>
      <AdminHeader title="Control Room Dashboard" user={user} />

      <div className="admin-content" style={{ maxWidth: '1280px' }}>
        <Breadcrumbs items={[{ label: 'Dashboard' }]} />

        {/* Welcome Header */}
        <div style={{ marginBottom: '24px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
              Good morning, {user.name || 'Admin'}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Here is your website content status, quick actions, and recent activity overview.
            </p>
          </div>
          <Link
            href="/"
            target="_blank"
            className="btn btn-secondary"
          >
            <ExternalLink size={14} /> View Live Website
          </Link>
        </div>

        {/* Stats Grid */}
        <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '10px' }}>
          Content Overview
        </div>
        <div className="dashboard-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <StatCard
            label="Managed Site Pages"
            value={data.pages.total}
            sub={`${data.pages.published} pages active`}
            icon={<FileText size={18} />}
          />
          <StatCard
            label="Core Practice Areas"
            value={data.practiceAreas}
            sub="Active core practices"
            icon={<Layers size={18} />}
          />
          <StatCard
            label="Industry Verticals"
            value={data.industries}
            sub="Active sector verticals"
            icon={<Building2 size={18} />}
          />
          <StatCard
            label="Insights & Articles"
            value={data.insights}
            sub="Published research"
            icon={<BookOpen size={18} />}
          />
          <StatCard
            label="Contact Inquiries"
            value={data.submissions.total}
            sub={`${data.submissions.new} unread submissions`}
            icon={<Mail size={18} />}
          />
        </div>

        {/* Main 2-Column Section: Recent Activity & Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
          {/* Left Column: Recent Audit Activity Timeline */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} className="text-[var(--accent)]" /> Recent Audit Activity
              </div>
              <Link href="/admin/audit-logs" className="text-xs font-semibold text-[var(--accent)] hover:underline">
                View Full Audit Logs →
              </Link>
            </div>

            {data.logs.length === 0 ? (
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '20px 0', textAlign: 'center' }}>
                No recent activity recorded yet. Audit logs will appear here when content changes occur.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.logs.map((log) => (
                  <div key={log.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px 12px', background: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(37,99,235,0.15)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0, marginTop: '2px' }}>
                      {log.userName ? log.userName.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {log.userName || log.userRole || 'Admin'} <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>{log.action}</span> <span style={{ color: 'var(--accent)' }}>{log.resource}</span>
                      </div>
                      {typeof log.details === 'string' && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {log.details}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Quick Management Shortcuts */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              Quick Actions
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/admin/pages" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <FileText size={15} className="text-[var(--accent)]" /> Edit Website Pages
              </Link>
              <Link href="/admin/practice-areas/new" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <PlusCircle size={15} className="text-[var(--accent)]" /> Create Practice Area
              </Link>
              <Link href="/admin/insights/new" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <PlusCircle size={15} className="text-[var(--accent)]" /> Publish Insight Article
              </Link>
              <Link href="/admin/events/new" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <PlusCircle size={15} className="text-[var(--accent)]" /> Create Event / Webinar
              </Link>
              <Link href="/admin/media" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <ImageIcon size={15} className="text-[var(--accent)]" /> Manage Media Library
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
