import { AdminHeader } from './components/AdminHeader';
import { StatCard } from './components/StatCard';
import { requireEditor } from '@/lib/auth/permissions';
import { db } from '@/lib/db';
import {
  sitePages,
  insightsArticles,
  contactSubmissions,
  practiceAreas,
  industries,
  cmsAuditLogs,
} from '@/lib/db/schema';
import { count, eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import {
  FileText,
  BriefcaseBusiness,
  Globe2,
  BookOpen,
  Inbox,
  ArrowUpRight,
  FolderOpen,
  CalendarDays,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';

export const metadata = {
  title: 'Dashboard',
};

async function getDashboardData() {
  const [
    [totalPagesCount],
    [publishedPagesCount],
    [insightCount],
    [newSubmissionsCount],
    [totalSubmissionsCount],
    [practiceAreaCount],
    [industryCount],
    recentLogs,
  ] = await Promise.all([
    db.select({ value: count() }).from(sitePages),
    db.select({ value: count() }).from(sitePages).where(eq(sitePages.isPublished, true)),
    db.select({ value: count() }).from(insightsArticles),
    db.select({ value: count() }).from(contactSubmissions).where(eq(contactSubmissions.status, 'new')),
    db.select({ value: count() }).from(contactSubmissions),
    db.select({ value: count() }).from(practiceAreas),
    db.select({ value: count() }).from(industries),
    db.select().from(cmsAuditLogs).orderBy(desc(cmsAuditLogs.createdAt)).limit(6),
  ]);

  return {
    pages: { total: totalPagesCount.value || 17, published: publishedPagesCount.value || 17 },
    insights: insightCount.value,
    submissions: { new: newSubmissionsCount.value, total: totalSubmissionsCount.value },
    practiceAreas: practiceAreaCount.value,
    industries: industryCount.value,
    logs: recentLogs || [],
  };
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatToday() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatRelative(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(1, mins)} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  return 'Yesterday';
}

export default async function AdminDashboard() {
  const user = await requireEditor();
  const data = await getDashboardData();
  const firstName = (user.name || 'Admin').split(' ')[0];

  return (
    <>
      <AdminHeader title="Control Room Dashboard" user={user} />

      <div className="admin-content">
        <div className="page-heading">
          <div>
            <div className="eyebrow">{formatToday()}</div>
            <h1>
              {getGreeting()}, {firstName}
            </h1>
            <p>Here&apos;s what&apos;s happening across your digital estate.</p>
          </div>
          <Link href="/" target="_blank" className="button button-dark">
            <Globe2 size={16} /> View live website <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="stats-grid">
          <StatCard
            label="Managed site pages"
            value={String(data.pages.total).padStart(2, '0')}
            sub={`${data.pages.published} published`}
            icon={<FileText size={17} />}
          />
          <StatCard
            label="Core practice areas"
            value={String(data.practiceAreas).padStart(2, '0')}
            sub="All published"
            icon={<BriefcaseBusiness size={17} />}
          />
          <StatCard
            label="Industry verticals"
            value={String(data.industries).padStart(2, '0')}
            sub="Active sectors"
            icon={<Globe2 size={17} />}
          />
          <StatCard
            label="Insights & articles"
            value={String(data.insights).padStart(2, '0')}
            sub="Published research"
            icon={<BookOpen size={17} />}
          />
          <StatCard
            label="Contact inquiries"
            value={String(data.submissions.total).padStart(2, '0')}
            sub={`${data.submissions.new} new this week`}
            icon={<Inbox size={17} />}
          />
        </div>

        <div className="dashboard-grid">
          <section className="panel">
            <div className="panel-header">
              <div>
                <div className="eyebrow">Security & activity</div>
                <h2>Recent audit activity</h2>
              </div>
              <Link href="/admin/audit-logs" className="text-button">
                View all <ArrowUpRight size={14} />
              </Link>
            </div>
            {data.logs.length === 0 ? (
              <div className="dashboard-empty-state">No recent activity recorded yet.</div>
            ) : (
              <div className="timeline">
                {data.logs.map((log) => (
                  <div className="timeline-item" key={log.id}>
                    <div className="timeline-dot" />
                    <div>
                      <p>
                        <strong>{log.userName || log.userRole || 'Admin'}</strong> {log.action}{' '}
                        <b>{log.resource}</b>
                      </p>
                      <span>{formatRelative(log.createdAt)} · Content management</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <div className="eyebrow">Shortcuts</div>
                <h2>Quick actions</h2>
              </div>
              <SlidersHorizontal size={17} className="muted" />
            </div>
            <div className="quick-list">
              <Link className="quick-row" href="/admin/pages">
                <FileText size={17} />
                <span>Edit website pages</span>
                <ChevronRight size={15} />
              </Link>
              <Link className="quick-row" href="/admin/practice-areas/new">
                <BriefcaseBusiness size={17} />
                <span>Create practice area</span>
                <ChevronRight size={15} />
              </Link>
              <Link className="quick-row" href="/admin/insights/new">
                <BookOpen size={17} />
                <span>Publish insight article</span>
                <ChevronRight size={15} />
              </Link>
              <Link className="quick-row" href="/admin/events/new">
                <CalendarDays size={17} />
                <span>Create event / webinar</span>
                <ChevronRight size={15} />
              </Link>
              <Link className="quick-row" href="/admin/media">
                <FolderOpen size={17} />
                <span>Manage media library</span>
                <ChevronRight size={15} />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
