'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Globe,
  LayoutDashboard,
  FileText,
  Briefcase,
  Building2,
  Calendar,
  Users,
  MessageSquareQuote,
  MapPin,
  HelpCircle,
  Folder,
  Inbox,
  MailCheck,
  Settings,
  LogOut,
  Search,
  Sun,
  Moon,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Navigation,
  Compass,
  UserCheck,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { GlobalSearchModal } from './GlobalSearchModal';

interface CmsUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: 'admin' | 'editor';
}

interface AdminSidebarProps {
  user: CmsUser;
}

type NavGroupKey = 'OVERVIEW' | 'WEBSITE' | 'CONTENT' | 'MEDIA' | 'INBOX' | 'SYSTEM';

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<NavGroupKey, boolean>>({
    OVERVIEW: false,
    WEBSITE: false,
    CONTENT: false,
    MEDIA: false,
    INBOX: false,
    SYSTEM: false,
  });

  useEffect(() => {
    try {
      const savedRail = localStorage.getItem('psc_cms_sidebar_collapsed');
      if (savedRail === 'true') setIsCollapsed(true);

      const savedGroups = localStorage.getItem('psc_cms_sidebar_groups');
      if (savedGroups) setCollapsedGroups(JSON.parse(savedGroups));
    } catch (e) {
      // Ignore fallback
    }
  }, []);

  const toggleRail = () => {
    const nextRail = !isCollapsed;
    setIsCollapsed(nextRail);
    localStorage.setItem('psc_cms_sidebar_collapsed', String(nextRail));
  };

  const toggleGroup = (group: NavGroupKey) => {
    setCollapsedGroups((prev) => {
      const next = { ...prev, [group]: !prev[group] };
      localStorage.setItem('psc_cms_sidebar_groups', JSON.stringify(next));
      return next;
    });
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand flex items-center justify-between p-3 border-b border-[var(--border)]">
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded bg-[var(--accent)] text-black font-extrabold flex items-center justify-center text-xs">
                PSC
              </div>
              <div className="min-w-0">
                <div className="sidebar-title text-xs font-bold text-[var(--text-primary)] truncate">PSC Global</div>
                <div className="sidebar-cms-label text-[9px] text-[var(--text-muted)] tracking-wider uppercase">CMS Control Room</div>
              </div>
            </div>
          ) : (
            <div className="w-7 h-7 rounded bg-[var(--accent)] text-black font-extrabold flex items-center justify-center text-xs mx-auto">
              PSC
            </div>
          )}

          <div className="flex items-center gap-1">
            {!isCollapsed && (
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            )}
            <button
              onClick={toggleRail}
              className="p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition hidden md:block"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
            </button>
          </div>
        </div>

        {/* Search Quick Button */}
        {!isCollapsed && (
          <div className="px-3 pt-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-between bg-[var(--bg-elevated)] hover:bg-[var(--bg-base)] border border-[var(--border)] rounded px-2.5 py-1.5 text-xs text-[var(--text-secondary)] transition"
            >
              <span className="flex items-center gap-2">
                <Search size={14} className="text-[var(--accent)]" />
                <span>Search CMS...</span>
              </span>
              <kbd className="bg-[var(--bg-surface)] border border-[var(--border)] text-[9px] font-mono px-1 py-0.5 rounded text-[var(--text-muted)]">⌘K</kbd>
            </button>
          </div>
        )}

        {/* Navigation Sections */}
        <nav className="sidebar-nav flex-1 p-2 overflow-y-auto no-scrollbar space-y-1">
          {/* 1. OVERVIEW */}
          <div>
            <Link
              href="/admin"
              className={`sidebar-link flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-medium transition ${
                pathname === '/admin' ? 'sidebar-link-active bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold border-l-2 border-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
              title={isCollapsed ? 'Dashboard Overview' : ''}
            >
              <LayoutDashboard size={15} className="flex-shrink-0" />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </div>

          {/* 2. WEBSITE STRUCTURE */}
          <div className="pt-2">
            {!isCollapsed && (
              <button
                onClick={() => toggleGroup('WEBSITE')}
                className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-bold text-[var(--text-muted)] tracking-wider uppercase hover:text-[var(--text-primary)] transition"
              >
                <span>Website</span>
                {collapsedGroups.WEBSITE ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
            {(!collapsedGroups.WEBSITE || isCollapsed) && (
              <div className="space-y-0.5 mt-0.5">
                <Link href="/admin/pages/home" className={`sidebar-link flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition ${isActive('/admin/pages/home') ? 'sidebar-link-active bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold border-l-2 border-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'}`} title={isCollapsed ? 'Home Page' : ''}>
                  <Globe size={15} className="flex-shrink-0" />
                  {!isCollapsed && <span>Home Page</span>}
                </Link>
                <Link href="/admin/pages/about" className={`sidebar-link flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition ${isActive('/admin/pages/about') ? 'sidebar-link-active bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold border-l-2 border-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'}`} title={isCollapsed ? 'About Page' : ''}>
                  <Compass size={15} className="flex-shrink-0" />
                  {!isCollapsed && <span>About Us</span>}
                </Link>
                <Link href="/admin/pages" className={`sidebar-link flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition ${pathname === '/admin/pages' ? 'sidebar-link-active bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold border-l-2 border-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'}`} title={isCollapsed ? 'All Pages' : ''}>
                  <FileText size={15} className="flex-shrink-0" />
                  {!isCollapsed && <span>All Pages</span>}
                </Link>
                <Link href="/admin/navigation" className={`sidebar-link flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition ${isActive('/admin/navigation') ? 'sidebar-link-active bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold border-l-2 border-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'}`} title={isCollapsed ? 'Navigation' : ''}>
                  <Navigation size={15} className="flex-shrink-0" />
                  {!isCollapsed && <span>Navigation</span>}
                </Link>
              </div>
            )}
          </div>

          {/* 3. CONTENT ENTITIES */}
          <div className="pt-2">
            {!isCollapsed && (
              <button
                onClick={() => toggleGroup('CONTENT')}
                className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-bold text-[var(--text-muted)] tracking-wider uppercase hover:text-[var(--text-primary)] transition"
              >
                <span>Content</span>
                {collapsedGroups.CONTENT ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
            {(!collapsedGroups.CONTENT || isCollapsed) && (
              <div className="space-y-0.5 mt-0.5">
                <Link href="/admin/practice-areas" className={`sidebar-link flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition ${isActive('/admin/practice-areas') && !pathname.includes('/pages/') ? 'sidebar-link-active bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold border-l-2 border-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'}`} title={isCollapsed ? 'Practice Areas' : ''}>
                  <Briefcase size={15} className="flex-shrink-0" />
                  {!isCollapsed && <span>Practice Areas</span>}
                </Link>
                <Link href="/admin/industries" className={`sidebar-link flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition ${isActive('/admin/industries') && !pathname.includes('/pages/') ? 'sidebar-link-active bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold border-l-2 border-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'}`} title={isCollapsed ? 'Industries' : ''}>
                  <Building2 size={15} className="flex-shrink-0" />
                  {!isCollapsed && <span>Industries</span>}
                </Link>
                <Link href="/admin/insights" className={`sidebar-link flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition ${isActive('/admin/insights') && !pathname.includes('/pages/') ? 'sidebar-link-active bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold border-l-2 border-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'}`} title={isCollapsed ? 'Insights' : ''}>
                  <FileText size={15} className="flex-shrink-0" />
                  {!isCollapsed && <span>Insights</span>}
                </Link>
                <Link href="/admin/events" className={`sidebar-link flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition ${isActive('/admin/events') && !pathname.includes('/pages/') ? 'sidebar-link-active bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold border-l-2 border-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'}`} title={isCollapsed ? 'Events' : ''}>
                  <Calendar size={15} className="flex-shrink-0" />
                  {!isCollapsed && <span>Events</span>}
                </Link>
                <Link href="/admin/team" className={`sidebar-link flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition ${isActive('/admin/team') && !pathname.includes('/pages/') ? 'sidebar-link-active bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold border-l-2 border-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'}`} title={isCollapsed ? 'Team' : ''}>
                  <Users size={15} className="flex-shrink-0" />
                  {!isCollapsed && <span>Team</span>}
                </Link>
                <Link href="/admin/testimonials" className={`sidebar-link flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition ${isActive('/admin/testimonials') ? 'sidebar-link-active bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold border-l-2 border-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'}`} title={isCollapsed ? 'Testimonials' : ''}>
                  <MessageSquareQuote size={15} className="flex-shrink-0" />
                  {!isCollapsed && <span>Testimonials</span>}
                </Link>
                <Link href="/admin/office-locations" className={`sidebar-link flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition ${isActive('/admin/office-locations') ? 'sidebar-link-active bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold border-l-2 border-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'}`} title={isCollapsed ? 'Offices' : ''}>
                  <MapPin size={15} className="flex-shrink-0" />
                  {!isCollapsed && <span>Offices</span>}
                </Link>
                <Link href="/admin/faqs" className={`sidebar-link flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition ${isActive('/admin/faqs') ? 'sidebar-link-active bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold border-l-2 border-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'}`} title={isCollapsed ? 'FAQs' : ''}>
                  <HelpCircle size={15} className="flex-shrink-0" />
                  {!isCollapsed && <span>FAQs</span>}
                </Link>
              </div>
            )}
          </div>

          {/* 4. MEDIA & INBOX */}
          <div className="pt-2">
            {!isCollapsed && (
              <button
                onClick={() => toggleGroup('MEDIA')}
                className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-bold text-[var(--text-muted)] tracking-wider uppercase hover:text-[var(--text-primary)] transition"
              >
                <span>Media & Inbox</span>
                {collapsedGroups.MEDIA ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
            {(!collapsedGroups.MEDIA || isCollapsed) && (
              <div className="space-y-0.5 mt-0.5">
                <Link href="/admin/media" className={`sidebar-link flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition ${isActive('/admin/media') ? 'sidebar-link-active bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold border-l-2 border-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'}`} title={isCollapsed ? 'Media Library' : ''}>
                  <Folder size={15} className="flex-shrink-0" />
                  {!isCollapsed && <span>Media</span>}
                </Link>
                <Link href="/admin/contact-submissions" className={`sidebar-link flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition ${isActive('/admin/contact-submissions') ? 'sidebar-link-active bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold border-l-2 border-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'}`} title={isCollapsed ? 'Inquiries' : ''}>
                  <Inbox size={15} className="flex-shrink-0" />
                  {!isCollapsed && <span>Inquiries</span>}
                </Link>
                <Link href="/admin/newsletter" className={`sidebar-link flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition ${isActive('/admin/newsletter') ? 'sidebar-link-active bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold border-l-2 border-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'}`} title={isCollapsed ? 'Subscribers' : ''}>
                  <MailCheck size={15} className="flex-shrink-0" />
                  {!isCollapsed && <span>Subscribers</span>}
                </Link>
                <Link href="/client-portal/admin/careers" className="sidebar-link flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition" title={isCollapsed ? 'Careers Inbox' : ''}>
                  <UserCheck size={15} className="flex-shrink-0" />
                  {!isCollapsed && <span>Candidates</span>}
                </Link>
              </div>
            )}
          </div>

          {/* 5. SYSTEM */}
          <div className="pt-2">
            {!isCollapsed && (
              <button
                onClick={() => toggleGroup('SYSTEM')}
                className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-bold text-[var(--text-muted)] tracking-wider uppercase hover:text-[var(--text-primary)] transition"
              >
                <span>System</span>
                {collapsedGroups.SYSTEM ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
            {(!collapsedGroups.SYSTEM || isCollapsed) && (
              <div className="space-y-0.5 mt-0.5">
                <Link href="/admin/settings" className={`sidebar-link flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition ${isActive('/admin/settings') ? 'sidebar-link-active bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold border-l-2 border-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'}`} title={isCollapsed ? 'Site Settings' : ''}>
                  <Settings size={15} className="flex-shrink-0" />
                  {!isCollapsed && <span>Settings</span>}
                </Link>
                <Link href="/admin/audit-logs" className={`sidebar-link flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition ${isActive('/admin/audit-logs') ? 'sidebar-link-active bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold border-l-2 border-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'}`} title={isCollapsed ? 'Audit Logs' : ''}>
                  <ShieldCheck size={15} className="flex-shrink-0" />
                  {!isCollapsed && <span>Audit Logs</span>}
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* User Footer */}
        <div className="sidebar-footer p-2.5 border-t border-[var(--border)] flex items-center justify-between">
          {!isCollapsed ? (
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-7 h-7 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center font-bold text-xs text-[var(--text-primary)] flex-shrink-0">
                {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-[var(--text-primary)] truncate">{user.name || user.email}</div>
                <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">{user.role}</div>
              </div>
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center font-bold text-xs text-[var(--text-primary)] mx-auto">
              {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
            </div>
          )}

          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-red-500/10 transition"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

