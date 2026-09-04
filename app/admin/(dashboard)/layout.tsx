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
          --bg-base: #0b0d12;
          --bg-surface: #13161f;
          --bg-elevated: #191c28;
          --bg-input: #0f1118;
          --border: rgba(255, 255, 255, 0.08);
          --border-strong: rgba(255, 255, 255, 0.16);
          --text-primary: #f3f4f6;
          --text-secondary: #9ca3af;
          --text-muted: #6b7280;
          --accent: #c59b27;
          --accent-hover: #b48a1f;
          --success: #10b981;
          --warning: #f59e0b;
          --danger: #ef4444;
          --radius: 6px;
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
          width: 240px;
          flex-shrink: 0;
          background: #11141c;
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
          gap: 12px;
          padding: 20px 18px;
          border-bottom: 1px solid var(--border);
        }

        .sidebar-logo {
          width: 36px;
          height: 36px;
          background: #1c202d;
          border: 1px solid var(--border-strong);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          color: #f3f4f6;
          letter-spacing: 0.06em;
          flex-shrink: 0;
        }

        .sidebar-title {
          font-size: 13px;
          font-weight: 700;
          color: #f3f4f6;
          line-height: 1.2;
          letter-spacing: 0.02em;
        }

        .sidebar-cms-label {
          font-size: 9px;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 2px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 14px 10px;
          display: flex;
          flex-direction: column;
        }

        .sidebar-section-label {
          padding: 6px 10px;
          font-size: 9px;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 12px;
          margin-bottom: 4px;
        }

        .sidebar-section-label:first-child {
          margin-top: 0;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 5px;
          font-size: 12.5px;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          border-left: 2px solid transparent;
        }

        .sidebar-link:hover {
          background: #161a25;
          color: var(--text-primary);
        }

        .sidebar-link-active {
          background: #191d29;
          color: #ffffff;
          border-left-color: var(--accent);
          font-weight: 600;
        }

        .sidebar-link-active:hover {
          background: #1d2230;
        }

        .sidebar-icon { display: flex; align-items: center; flex-shrink: 0; opacity: 0.75; }
        .sidebar-link-active .sidebar-icon { opacity: 1; color: var(--accent); }
        .sidebar-label { flex: 1; }

        .sidebar-footer {
          padding: 14px 12px;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 8px;
          background: #0e1017;
        }

        .sidebar-user {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .sidebar-avatar {
          width: 30px;
          height: 30px;
          background: #1c202d;
          border: 1px solid var(--border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: #f3f4f6;
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
          font-size: 9px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .sidebar-signout {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 6px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          transition: color 0.15s, background 0.15s;
        }
        .sidebar-signout:hover {
          color: var(--danger);
          background: rgba(239,68,68,0.1);
        }

        /* ── Main Content ─────────────────────────────────── */
        .admin-main {
          flex: 1;
          min-width: 0;
          overflow-y: auto;
          background: var(--bg-base);
        }

        /* ── Admin Header ─────────────────────────────────── */
        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 28px;
          border-bottom: 1px solid var(--border);
          background: #11141c;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .admin-header-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .admin-header-user {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .admin-header-role-badge {
          font-size: 9.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 2px 8px;
          border-radius: 4px;
          background: #1c202d;
          border: 1px solid var(--border);
          color: var(--text-secondary);
        }

        .admin-header-role-badge[data-role="admin"] {
          background: rgba(197, 155, 39, 0.12);
          border-color: rgba(197, 155, 39, 0.25);
          color: #f59e0b;
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
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }
        .page-header-description {
          font-size: 13px;
          color: var(--text-secondary);
          margin-top: 4px;
          line-height: 1.5;
        }
        .page-header-actions { display: flex; gap: 8px; flex-shrink: 0; }

        /* ── Shared Form Controls ───────────────────────────── */
        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 9px 12px;
          background: var(--bg-input);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 2px rgba(197, 155, 39, 0.15);
        }
        .form-input::placeholder, .form-textarea::placeholder {
          color: #4b5563;
        }

        /* ── Shared Buttons ────────────────────────────────── */
        .btn, .admin-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: var(--radius);
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
          text-decoration: none;
          transition: background 0.15s, border-color 0.15s, opacity 0.15s;
          white-space: nowrap;
        }
        .btn:hover, .admin-button:hover { opacity: 0.9; }
        .btn:disabled, .admin-button:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-primary, .admin-button.primary {
          background: #1c202d;
          color: #ffffff;
          border-color: var(--border-strong);
        }
        .btn-primary:hover, .admin-button.primary:hover {
          background: #24293a;
          border-color: var(--accent);
        }
        .btn-secondary, .admin-button.secondary {
          background: #141720;
          color: var(--text-secondary);
          border-color: var(--border);
        }
        .btn-secondary:hover, .admin-button.secondary:hover {
          background: #191c28;
          color: var(--text-primary);
          border-color: var(--border-strong);
        }
        .btn-danger {
          background: rgba(239,68,68,0.1);
          color: #f87171;
          border-color: rgba(239,68,68,0.2);
        }
        .btn-danger:hover {
          background: rgba(239,68,68,0.18);
        }

        /* ── Stat Cards ────────────────────────────────────── */
        .stat-card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 20px;
        }
        .stat-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .stat-card-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }
        .stat-card-icon { color: var(--text-muted); opacity: 0.6; }
        .stat-card-value {
          font-size: 30px;
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
          opacity: 0.4;
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

        /* ── Shared Content Area ───────────────────────────── */
        .admin-content {
          padding: 28px;
          max-width: 1200px;
        }

        /* ── Dashboard Grid ────────────────────────────────── */
        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .dashboard-section-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          margin-bottom: 12px;
        }
      `}</style>
    </div>
  );
}
