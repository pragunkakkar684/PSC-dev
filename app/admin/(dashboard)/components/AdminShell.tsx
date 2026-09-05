'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  FileText,
  FolderOpen,
  Globe2,
  Grid2X2,
  Home,
  Inbox,
  LayoutDashboard,
  ListFilter,
  LogOut,
  Menu,
  Moon,
  PanelLeft,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  Users,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { GlobalSearchModal } from './GlobalSearchModal';

interface CmsUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: 'admin' | 'editor';
}

const navGroups = [
  { label: 'Overview', items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/admin' }] },
  {
    label: 'Website',
    items: [
      { label: 'Home Page', icon: Home, path: '/admin/pages/home' },
      { label: 'About Us', icon: FileText, path: '/admin/pages/about' },
      { label: 'All Pages', icon: Grid2X2, path: '/admin/pages' },
      { label: 'Navigation', icon: ListFilter, path: '/admin/navigation' },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Practice Areas', icon: BriefcaseBusiness, path: '/admin/practice-areas' },
      { label: 'Industries', icon: Globe2, path: '/admin/industries' },
      { label: 'Insights', icon: BookOpen, path: '/admin/insights' },
      { label: 'Events', icon: CalendarDays, path: '/admin/events' },
      { label: 'Team', icon: Users, path: '/admin/team' },
      { label: 'Testimonials', icon: ClipboardList, path: '/admin/testimonials' },
      { label: 'Offices', icon: Globe2, path: '/admin/office-locations' },
      { label: 'FAQs', icon: CircleHelp, path: '/admin/faqs' },
    ],
  },
  {
    label: 'Media & Inbox',
    items: [
      { label: 'Media', icon: FolderOpen, path: '/admin/media' },
      { label: 'Inquiries', icon: Inbox, path: '/admin/contact-submissions' },
      { label: 'Subscribers', icon: Bell, path: '/admin/newsletter' },
      { label: 'Candidates', icon: Users, path: '/client-portal/admin/careers' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', icon: Settings, path: '/admin/settings' },
      { label: 'Audit Logs', icon: ShieldCheck, path: '/admin/audit-logs' },
    ],
  },
];

function initials(name?: string | null, email?: string | null) {
  const source = name || email || 'AD';
  const parts = source.split(/[\s@]+/).filter(Boolean);
  return ((parts[0]?.[0] || 'A') + (parts[1]?.[0] || '')).toUpperCase();
}

export function AdminShell({ user, children }: { user: CmsUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Overview: true,
    Website: true,
    Content: true,
    'Media & Inbox': true,
    System: true,
  });

  useEffect(() => {
    try {
      if (localStorage.getItem('psc_cms_sidebar_collapsed') === 'true') setCollapsed(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    setMobileNav(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const current = useMemo(() => {
    const items = navGroups.flatMap((g) => g.items);
    return (
      items.find((i) => i.path !== '/admin' && pathname.startsWith(i.path)) ||
      items.find((i) => i.path === pathname)
    );
  }, [pathname]);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('psc_cms_sidebar_collapsed', String(next));
  };

  const isActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin';
    if (path === '/admin/pages') return pathname === '/admin/pages';
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <>
      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileNav ? 'sidebar-mobile-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">P</div>
          {!collapsed && (
            <div>
              <div className="brand-name">PSC Global</div>
              <div className="brand-sub">CMS Control Room</div>
            </div>
          )}
          <button className="sidebar-toggle" onClick={toggleCollapsed} aria-label="Toggle sidebar">
            <PanelLeft size={16} />
          </button>
        </div>

        <nav className="nav-scroll">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <button
                className="nav-group-title"
                onClick={() => setExpanded({ ...expanded, [group.label]: !expanded[group.label] })}
              >
                {!collapsed && group.label}
                <ChevronDown className={expanded[group.label] ? '' : 'rotate-[-90deg]'} size={13} />
              </button>
              {(expanded[group.label] || collapsed) &&
                group.items.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`nav-item ${isActive(item.path) ? 'nav-active' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon size={17} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          {!collapsed && (
            <>
              <div className="status-dot" />
              <span>All systems operational</span>
            </>
          )}
          <button className="sidebar-signout" onClick={() => signOut({ callbackUrl: '/admin/login' })} title="Sign out">
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      <div className={`app-main ${collapsed ? 'app-main-collapsed' : ''}`}>
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Open navigation">
            <Menu size={19} />
          </button>
          <div className="topbar-search" onClick={() => setSearchOpen(true)}>
            <Search size={16} />
            <span>Search CMS</span>
            <kbd>⌘ K</kbd>
          </div>
          <div className="topbar-actions">
            <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            {/* <button className="icon-btn notification" title="Notifications">
              <Bell size={17} />
              <span />
            </button> */}
            <div className="user-menu">
              <div className="avatar">{initials(user.name, user.email)}</div>
              <div className="user-copy">
                <strong>{user.name || user.email || 'Administrator'}</strong>
                <span>{user.role === 'admin' ? 'Administrator' : 'Editor'}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="content-area">
          <div className="breadcrumb">
            <span>CMS</span>
            <ChevronRight size={13} />
            <span>{current?.label || (pathname === '/admin' ? 'Dashboard' : 'Admin')}</span>
          </div>
          {children}
        </main>
      </div>

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
