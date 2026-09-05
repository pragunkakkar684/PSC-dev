import type { Metadata } from 'next';
import { requireEditor } from '@/lib/auth/permissions';
import { AdminSidebar } from './components/AdminSidebar';
import { ThemeProvider } from './components/ThemeProvider';

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
  const user = await requireEditor();

  return (
    <ThemeProvider>
      <div className="admin-shell">
        <AdminSidebar user={user} />
        <div className="admin-main">
          {children}
        </div>

        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          :root {
            --bg-base: #090a0f;
            --bg-surface: #12131a;
            --bg-elevated: #181a24;
            --bg-input: #0f1017;
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

          [data-theme="light"] {
            --bg-base: #fdf9f8;
            --bg-surface: #ffffff;
            --bg-elevated: #f1f5f9;
            --bg-input: #ffffff;
            --border: #e2e8f0;
            --border-strong: #cbd5e1;
            --text-primary: #0f172a;
            --text-secondary: #475569;
            --text-muted: #64748b;
            --accent: #0f172a;
            --accent-hover: #1e293b;
          }

          html, body { height: 100%; background: var(--bg-base); color: var(--text-primary); }

          .admin-shell {
            display: flex;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            color: var(--text-primary);
            background: var(--bg-base);
          }

          /* ── Sidebar ─────────────────────────────────────── */
          .sidebar {
            width: 250px;
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
            justify-content: space-between;
            padding: 16px 18px;
            border-bottom: 1px solid var(--border);
          }

          .sidebar-title {
            font-size: 13px;
            font-weight: 700;
            color: var(--text-primary);
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
            letter-spacing: 0.12em;
            text-transform: uppercase;
            margin-top: 14px;
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
            font-size: 12px;
            font-weight: 500;
            color: var(--text-secondary);
            text-decoration: none;
            transition: background 0.15s, color 0.15s, border-color 0.15s;
            border-left: 2px solid transparent;
          }

          .sidebar-link:hover {
            background: var(--bg-elevated);
            color: var(--text-primary);
          }

          .sidebar-link-active {
            background: var(--bg-elevated);
            color: var(--text-primary);
            border-left-color: var(--accent);
            font-weight: 600;
          }

          .sidebar-icon { display: flex; align-items: center; flex-shrink: 0; opacity: 0.8; }
          .sidebar-link-active .sidebar-icon { opacity: 1; color: var(--accent); }
          .sidebar-label { flex: 1; }

          .sidebar-footer {
            padding: 14px 12px;
            border-top: 1px solid var(--border);
            display: flex;
            align-items: center;
            gap: 8px;
            background: var(--bg-surface);
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
            background: var(--bg-elevated);
            border: 1px solid var(--border);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 700;
            color: var(--text-primary);
            flex-shrink: 0;
          }

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
            padding: 14px 28px;
            border-bottom: 1px solid var(--border);
            background: var(--bg-surface);
            position: sticky;
            top: 0;
            z-index: 10;
          }

          .admin-header-title {
            font-size: 15px;
            font-weight: 700;
            color: var(--text-primary);
            letter-spacing: -0.01em;
          }

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
            background: var(--bg-elevated);
            color: var(--text-primary);
            border-color: var(--border-strong);
          }
          .btn-primary:hover, .admin-button.primary:hover {
            border-color: var(--accent);
          }
          .btn-secondary, .admin-button.secondary {
            background: var(--bg-surface);
            color: var(--text-secondary);
            border-color: var(--border);
          }
          .btn-secondary:hover, .admin-button.secondary:hover {
            background: var(--bg-elevated);
            color: var(--text-primary);
          }
          .btn-danger {
            background: rgba(239,68,68,0.1);
            color: #f87171;
            border-color: rgba(239,68,68,0.2);
          }

          /* ── Shared Content Area ───────────────────────────── */
          .admin-content {
            padding: 28px;
            max-width: 1280px;
          }
        `}</style>
      </div>
    </ThemeProvider>
  );
}
