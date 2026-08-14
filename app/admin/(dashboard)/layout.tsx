import type { Metadata } from 'next';
import { requireAuth } from '@/lib/auth/permissions';
import { AdminSidebar } from './components/AdminSidebar';

export const metadata: Metadata = {
  title: {
    template: '%s | PSC Global CMS',
    default: 'PSC Global CMS',
  },
  description: 'PSC Global Content Management System',
  robots: 'noindex, nofollow',
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await requireAuth();

  return (
    <div className="admin-shell">
      <AdminSidebar user={user} />
      <div className="admin-main">
        {children}
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg-base: #0f1117;
          --bg-surface: #1a1d27;
          --bg-elevated: #21253a;
          --border: rgba(255,255,255,0.07);
          --text-primary: #f1f5f9;
          --text-secondary: #94a3b8;
          --text-muted: #475569;
          --accent: #3b82f6;
          --accent-hover: #2563eb;
          --success: #10b981;
          --warning: #f59e0b;
          --danger: #ef4444;
          --radius: 8px;
        }

        html, body { height: 100%; background: var(--bg-base); }

        .admin-shell {
          display: flex;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          color: var(--text-primary);
          background: var(--bg-base);
        }

        /* ── Sidebar ─────────────────────────────────────── */
        .sidebar {
          width: 230px;
          flex-shrink: 0;
          background: var(--bg-surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 20px 16px;
          border-bottom: 1px solid var(--border);
        }

        .sidebar-logo {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: white;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }

        .sidebar-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .sidebar-cms-label {
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-top: 1px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 10px 8px;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 10px;
          border-radius: var(--radius);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: background 0.1s, color 0.1s;
          position: relative;
        }

        .sidebar-link:hover {
          background: rgba(255,255,255,0.05);
          color: var(--text-primary);
        }

        .sidebar-link-active {
          background: rgba(59,130,246,0.12);
          color: #60a5fa;
        }

        .sidebar-link-active:hover {
          background: rgba(59,130,246,0.16);
        }

        .sidebar-icon { display: flex; align-items: center; flex-shrink: 0; opacity: 0.8; }
        .sidebar-label { flex: 1; }

        .sidebar-badge {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 2px 5px;
          border-radius: 4px;
          background: rgba(245,158,11,0.15);
          color: #fbbf24;
        }

        .sidebar-footer {
          padding: 12px 10px;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sidebar-user {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }

        .sidebar-avatar {
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }

        .sidebar-user-info { min-width: 0; }
        .sidebar-user-name {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sidebar-user-role {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .sidebar-signout {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 5px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          transition: color 0.1s, background 0.1s;
        }
        .sidebar-signout:hover {
          color: var(--danger);
          background: rgba(239,68,68,0.08);
        }

        /* ── Main Content ─────────────────────────────────── */
        .admin-main {
          flex: 1;
          min-width: 0;
          overflow-y: auto;
        }

        /* ── Admin Header ─────────────────────────────────── */
        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 28px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-surface);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .admin-header-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .admin-header-user {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .admin-header-role-badge {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 2px 7px;
          border-radius: 4px;
          background: rgba(59,130,246,0.12);
          color: #60a5fa;
        }

        .admin-header-role-badge[data-role="admin"] {
          background: rgba(245,158,11,0.12);
          color: #fbbf24;
        }

        .admin-header-name {
          font-size: 13px;
          color: var(--text-secondary);
        }

        /* ── Page Header ───────────────────────────────────── */
        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
        }
        .page-header-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .page-header-description {
          font-size: 13px;
          color: var(--text-secondary);
          margin-top: 4px;
          line-height: 1.5;
        }
        .page-header-actions { display: flex; gap: 8px; flex-shrink: 0; }

        /* ── Stat Cards ────────────────────────────────────── */
        .stat-card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
        }
        .stat-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .stat-card-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
        }
        .stat-card-icon { color: var(--text-muted); opacity: 0.7; }
        .stat-card-value {
          font-size: 32px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
        }
        .stat-card-sub {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 6px;
        }

        /* ── Empty State ───────────────────────────────────── */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px 24px;
          color: var(--text-muted);
        }
        .empty-state-icon {
          font-size: 32px;
          margin-bottom: 16px;
          opacity: 0.5;
        }
        .empty-state-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }
        .empty-state-description {
          font-size: 13px;
          color: var(--text-muted);
          max-width: 320px;
          line-height: 1.6;
        }
        .empty-state-action { margin-top: 20px; }

        /* ── Shared Buttons ────────────────────────────────── */
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: var(--radius);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          text-decoration: none;
          transition: opacity 0.15s;
          white-space: nowrap;
        }
        .btn:hover { opacity: 0.85; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-primary {
          background: var(--accent);
          color: white;
        }
        .btn-secondary {
          background: rgba(255,255,255,0.06);
          color: var(--text-secondary);
          border: 1px solid var(--border);
        }
        .btn-danger {
          background: rgba(239,68,68,0.12);
          color: #f87171;
          border: 1px solid rgba(239,68,68,0.2);
        }

        /* ── Shared Content Area ───────────────────────────── */
        .admin-content {
          padding: 28px;
          max-width: 1200px;
        }

        /* ── Coming Soon Placeholder ───────────────────────── */
        .coming-soon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          text-align: center;
          color: var(--text-muted);
        }
        .coming-soon-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(245,158,11,0.1);
          color: #fbbf24;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .coming-soon-title {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }
        .coming-soon-text {
          font-size: 14px;
          color: var(--text-muted);
          max-width: 360px;
          line-height: 1.6;
        }

        /* ── Dashboard Grid ────────────────────────────────── */
        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .dashboard-section-title {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          margin-bottom: 12px;
        }
      `}</style>
    </div>
  );
}
