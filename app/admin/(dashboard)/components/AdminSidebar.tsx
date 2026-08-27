'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import type { CmsUser } from '@/lib/auth/permissions';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  isHomeItem?: boolean;
  adminOnly?: boolean;
}

interface AdminSidebarProps {
  user: CmsUser;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    isHomeItem: true,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <rect x="1.5" y="1.5" width="5" height="5" rx="1" />
        <rect x="9.5" y="1.5" width="5" height="5" rx="1" />
        <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
        <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Home Hero Banner',
    href: '/admin/pages',
    isHomeItem: true,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 1.5h7l3 3V14a.5.5 0 0 1-.5.5h-9A.5.5 0 0 1 2.5 14V2a.5.5 0 0 1 .5-.5z" />
        <path d="M10 1.5V4.5H13" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Practice Areas',
    href: '/admin/practice-areas',
    isHomeItem: true,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 4v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Sectors & Industries',
    href: '/admin/industries',
    isHomeItem: true,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <path d="M1.5 14V8l4-4 4 4V14M9.5 14V10M6.5 14V10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 4.5l1-1 4 4V14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Insights Articles',
    href: '/admin/insights',
    isHomeItem: true,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 12.5h12M2 9.5h8M2 6.5h10M2 3.5h6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Team Members',
    href: '/admin/team',
    isHomeItem: true,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <circle cx="6" cy="5" r="2.5" />
        <path d="M1 13c0-2.76 2.24-5 5-5h0c2.76 0 5 2.24 5 5" strokeLinecap="round" />
        <circle cx="12" cy="5" r="2" />
        <path d="M14.5 13c0-2.21-1.12-4-2.5-4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Testimonials',
    href: '/admin/testimonials',
    isHomeItem: true,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 3.5C3 2.67 3.67 2 4.5 2h7c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5H5l-2.5 2.5V3.5z" />
      </svg>
    ),
  },
  {
    label: 'Media Library',
    href: '/admin/media',
    isHomeItem: true,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" />
        <circle cx="5.5" cy="6" r="1.25" />
        <path d="M1.5 11l3.5-3 3 3 2-2 3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Events',
    href: '/admin/events',
    isHomeItem: false,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" />
        <path d="M1.5 6.5h13M5 1v3M11 1v3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'FAQs',
    href: '/admin/faqs',
    isHomeItem: false,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="6.5" />
        <path d="M6.5 6a1.5 1.5 0 0 1 3 0c0 1-1.5 1.5-1.5 2.5" strokeLinecap="round" />
        <circle cx="8" cy="11.25" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Offices',
    href: '/admin/office-locations',
    isHomeItem: false,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <path d="M2.5 14.5h11M4 14.5V3.5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v11M6 5.5h1M9 5.5h1M6 8.5h1M9 8.5h1M6 11.5h1M9 11.5h1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Contact Form Submissions',
    href: '/admin/contact-submissions',
    isHomeItem: true,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" />
        <path d="M1.5 5.5l6.5 4 6.5-4" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    adminOnly: true,
    isHomeItem: false,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="2" />
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const visibleNav = navItems.filter(
    (item) => !item.adminOnly || user.role === 'admin',
  );

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
      {/* Logo */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">PSC</div>
        <div>
          <div className="sidebar-title">PSC Global</div>
          <div className="sidebar-cms-label">Home CMS</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div style={{ padding: '4px 10px', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Home Page CMS
        </div>
        {visibleNav.filter(item => item.isHomeItem).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-link ${isActive(item.href) ? 'sidebar-link-active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}

        <div style={{ padding: '12px 10px 4px 10px', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Other Pages (Disabled)
        </div>
        {visibleNav.filter(item => !item.isHomeItem).map((item) => (
          <div
            key={item.href}
            className="sidebar-link"
            style={{ opacity: 0.45, cursor: 'not-allowed' }}
            title="Only Home Page is editable right now"
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
            <span className="sidebar-badge" style={{ background: '#334155', color: '#94a3b8' }}>Disabled</span>
          </div>
        ))}
      </nav>

      {/* User info + sign out */}
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
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 14H2.5A.5.5 0 0 1 2 13.5v-11A.5.5 0 0 1 2.5 2H6M11 11l3-3-3-3M14 8H6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
