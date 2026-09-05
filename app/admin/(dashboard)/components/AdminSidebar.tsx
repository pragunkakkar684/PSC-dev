'use client';

import { useState } from 'react';
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
  Navigation,
  Compass,
  UserCheck,
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

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [operationalArea, setOperationalArea] = useState<'CMS' | 'PORTAL' | 'CAREERS'>('CMS');

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <aside className="sidebar">
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="flex items-center gap-2.5">
            <div className="sidebar-logo">PSC</div>
            <div>
              <div className="sidebar-title">PSC Global</div>
              <div className="sidebar-cms-label">Control Room</div>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        {/* Operational Context Switcher */}
        <div className="px-3 pt-3 pb-2 border-b border-slate-800/60">
          <label className="block text-[9px] font-bold tracking-widest text-slate-500 uppercase mb-1">
            OPERATIONAL CONTEXT
          </label>
          <div className="relative">
            <select
              value={operationalArea}
              onChange={(e) => setOperationalArea(e.target.value as any)}
              className="w-full bg-[#181a24] border border-slate-700/60 rounded px-2.5 py-1.5 text-xs font-bold text-slate-200 focus:outline-none focus:border-amber-400"
            >
              <option value="CMS">🌐 Website Content CMS</option>
              <option value="PORTAL">💼 Client Portal Admin</option>
              <option value="CAREERS">🎓 Recruitment & Careers</option>
            </select>
          </div>
        </div>

        {/* Quick Search Button */}
        <div className="px-3 pt-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between bg-[#181a24] hover:bg-[#202330] border border-slate-700/60 rounded px-3 py-2 text-xs text-slate-400 transition"
          >
            <span className="flex items-center gap-2">
              <Search size={14} className="text-amber-400" />
              <span>Search CMS...</span>
            </span>
            <kbd className="bg-slate-800 text-[10px] font-mono px-1.5 py-0.5 rounded text-slate-300">⌘K</kbd>
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="sidebar-nav">
          {/* 1. OVERVIEW */}
          <Link
            href="/admin"
            className={`sidebar-link ${pathname === '/admin' ? 'sidebar-link-active' : ''}`}
          >
            <span className="sidebar-icon"><LayoutDashboard size={15} /></span>
            <span className="sidebar-label">Dashboard Overview</span>
          </Link>

          {/* 2. WEBSITE STRUCTURE */}
          <div className="sidebar-section-label">Website Structure</div>
          <Link href="/admin/pages/home" className={`sidebar-link ${isActive('/admin/pages/home') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><Globe size={15} /></span>
            <span className="sidebar-label">Home Page</span>
          </Link>
          <Link href="/admin/pages/about" className={`sidebar-link ${isActive('/admin/pages/about') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><Compass size={15} /></span>
            <span className="sidebar-label">About Us Page</span>
          </Link>
          <Link href="/admin/pages/practice-areas" className={`sidebar-link ${isActive('/admin/pages/practice-areas') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><Briefcase size={15} /></span>
            <span className="sidebar-label">Practice Areas Page</span>
          </Link>
          <Link href="/admin/pages/industries" className={`sidebar-link ${isActive('/admin/pages/industries') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><Building2 size={15} /></span>
            <span className="sidebar-label">Industries Page</span>
          </Link>
          <Link href="/admin/pages/insights" className={`sidebar-link ${isActive('/admin/pages/insights') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><FileText size={15} /></span>
            <span className="sidebar-label">Insights Page</span>
          </Link>
          <Link href="/admin/pages/events" className={`sidebar-link ${isActive('/admin/pages/events') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><Calendar size={15} /></span>
            <span className="sidebar-label">Events Page</span>
          </Link>
          <Link href="/admin/pages/team" className={`sidebar-link ${isActive('/admin/pages/team') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><Users size={15} /></span>
            <span className="sidebar-label">Team Page</span>
          </Link>
          <Link href="/admin/pages/career" className={`sidebar-link ${isActive('/admin/pages/career') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><UserCheck size={15} /></span>
            <span className="sidebar-label">Careers Page</span>
          </Link>
          <Link href="/admin/pages/contact" className={`sidebar-link ${isActive('/admin/pages/contact') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><MapPin size={15} /></span>
            <span className="sidebar-label">Contact Page</span>
          </Link>
          <Link href="/admin/pages" className={`sidebar-link ${pathname === '/admin/pages' ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><Globe size={15} /></span>
            <span className="sidebar-label">All Site Pages</span>
          </Link>
          <Link href="/admin/navigation" className={`sidebar-link ${isActive('/admin/navigation') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><Navigation size={15} /></span>
            <span className="sidebar-label">Navigation Menu</span>
          </Link>

          {/* 3. CONTENT ENTITIES */}
          <div className="sidebar-section-label">Content Entities</div>
          <Link href="/admin/practice-areas" className={`sidebar-link ${isActive('/admin/practice-areas') && !pathname.includes('/pages/') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><Briefcase size={15} /></span>
            <span className="sidebar-label">Practice Areas List</span>
          </Link>
          <Link href="/admin/industries" className={`sidebar-link ${isActive('/admin/industries') && !pathname.includes('/pages/') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><Building2 size={15} /></span>
            <span className="sidebar-label">Industries List</span>
          </Link>
          <Link href="/admin/insights" className={`sidebar-link ${isActive('/admin/insights') && !pathname.includes('/pages/') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><FileText size={15} /></span>
            <span className="sidebar-label">Insights & Articles</span>
          </Link>
          <Link href="/admin/events" className={`sidebar-link ${isActive('/admin/events') && !pathname.includes('/pages/') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><Calendar size={15} /></span>
            <span className="sidebar-label">Events & Webinars</span>
          </Link>
          <Link href="/admin/team" className={`sidebar-link ${isActive('/admin/team') && !pathname.includes('/pages/') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><Users size={15} /></span>
            <span className="sidebar-label">Team Profiles</span>
          </Link>
          <Link href="/admin/testimonials" className={`sidebar-link ${isActive('/admin/testimonials') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><MessageSquareQuote size={15} /></span>
            <span className="sidebar-label">Testimonials</span>
          </Link>
          <Link href="/admin/office-locations" className={`sidebar-link ${isActive('/admin/office-locations') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><MapPin size={15} /></span>
            <span className="sidebar-label">Office Locations</span>
          </Link>
          <Link href="/admin/faqs" className={`sidebar-link ${isActive('/admin/faqs') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><HelpCircle size={15} /></span>
            <span className="sidebar-label">FAQs</span>
          </Link>

          {/* 4. MEDIA & INBOX */}
          <div className="sidebar-section-label">Media & Inbox</div>
          <Link href="/admin/media" className={`sidebar-link ${isActive('/admin/media') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><Folder size={15} /></span>
            <span className="sidebar-label">Media Library</span>
          </Link>
          <Link href="/admin/contact-submissions" className={`sidebar-link ${isActive('/admin/contact-submissions') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><Inbox size={15} /></span>
            <span className="sidebar-label">Contact Inquiries</span>
          </Link>
          <Link href="/admin/newsletter" className={`sidebar-link ${isActive('/admin/newsletter') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><MailCheck size={15} /></span>
            <span className="sidebar-label">Subscribers</span>
          </Link>
          <Link href="/client-portal/admin/careers" className="sidebar-link">
            <span className="sidebar-icon"><UserCheck size={15} /></span>
            <span className="sidebar-label">Candidate Inbox</span>
          </Link>

          {/* 5. SYSTEM */}
          <div className="sidebar-section-label">System</div>
          <Link href="/admin/settings" className={`sidebar-link ${isActive('/admin/settings') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><Settings size={15} /></span>
            <span className="sidebar-label">Site Settings</span>
          </Link>
          <Link href="/admin/audit-logs" className={`sidebar-link ${isActive('/admin/audit-logs') ? 'sidebar-link-active' : ''}`}>
            <span className="sidebar-icon"><ShieldCheck size={15} /></span>
            <span className="sidebar-label">Audit Logs</span>
          </Link>
        </nav>

        {/* User Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.name || user.email}</div>
              <div className="sidebar-user-role">{user.role}</div>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="sidebar-signout"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
