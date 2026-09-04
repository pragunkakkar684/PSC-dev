'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import type { CmsUser } from '@/lib/auth/permissions';
import {
  LayoutDashboard,
  FileText,
  Navigation,
  Image,
  Settings,
  Layers,
  Building2,
  BookOpen,
  Calendar,
  Users,
  Quote,
  HelpCircle,
  MapPin,
  Mail,
  Send,
  LogOut,
} from 'lucide-react';

interface NavSection {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ReactNode;
    adminOnly?: boolean;
  }[];
}

interface AdminSidebarProps {
  user: CmsUser;
}

const navSections: NavSection[] = [
  {
    title: 'WEBSITE',
    items: [
      { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={16} /> },
      { label: 'Pages & CMS', href: '/admin/pages', icon: <FileText size={16} /> },
      { label: 'Navigation', href: '/admin/navigation', icon: <Navigation size={16} /> },
      { label: 'Media Library', href: '/admin/media', icon: <Image size={16} /> },
      { label: 'Site Settings', href: '/admin/settings', icon: <Settings size={16} />, adminOnly: true },
    ],
  },
  {
    title: 'CONTENT',
    items: [
      { label: 'Practice Areas', href: '/admin/practice-areas', icon: <Layers size={16} /> },
      { label: 'Industries', href: '/admin/industries', icon: <Building2 size={16} /> },
      { label: 'Insights Articles', href: '/admin/insights', icon: <BookOpen size={16} /> },
      { label: 'Events', href: '/admin/events', icon: <Calendar size={16} /> },
      { label: 'Team Members', href: '/admin/team', icon: <Users size={16} /> },
      { label: 'Testimonials', href: '/admin/testimonials', icon: <Quote size={16} /> },
      { label: 'FAQs', href: '/admin/faqs', icon: <HelpCircle size={16} /> },
      { label: 'Offices', href: '/admin/office-locations', icon: <MapPin size={16} /> },
    ],
  },
  {
    title: 'LEADS & AUDIT',
    items: [
      { label: 'Contact Submissions', href: '/admin/contact-submissions', icon: <Mail size={16} /> },
      { label: 'Newsletter', href: '/admin/newsletter', icon: <Send size={16} /> },
    ],
  },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">PSC</div>
        <div>
          <div className="sidebar-title">PSC Global</div>
          <div className="sidebar-cms-label">Site-Wide CMS</div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav" style={{ paddingBottom: '20px' }}>
        {navSections.map((sec) => {
          const visibleItems = sec.items.filter((item) => !item.adminOnly || user.role === 'admin');
          if (visibleItems.length === 0) return null;

          return (
            <div key={sec.title} style={{ marginBottom: '16px' }}>
              <div
                style={{
                  padding: '4px 12px 6px 12px',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: 'var(--text-muted, #64748b)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {sec.title}
              </div>
              {visibleItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-link ${isActive(item.href) ? 'sidebar-link-active' : ''}`}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </Link>
              ))}
            </div>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user.name?.charAt(0).toUpperCase() ?? user.email?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name ?? 'Admin'}</div>
            <div className="sidebar-user-role">{user.role}</div>
          </div>
        </div>
        <button
          className="sidebar-signout"
          onClick={handleSignOut}
          disabled={isSigningOut}
          title="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
