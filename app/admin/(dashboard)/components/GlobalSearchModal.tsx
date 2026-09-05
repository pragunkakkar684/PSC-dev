'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Home,
  FileText,
  BriefcaseBusiness,
  CalendarDays,
  Users,
  ShieldCheck,
  ArrowUpRight,
  X,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
  title: string;
  category: string;
  href: string;
  subtitle?: string;
  icon: LucideIcon;
}

const SEARCH_DATA: SearchResult[] = [
  { title: 'Home Page', category: 'Pages', href: '/admin/pages/home', subtitle: 'Website page', icon: Home },
  { title: 'About Us', category: 'Pages', href: '/admin/pages/about', subtitle: 'Website page', icon: FileText },
  { title: 'Tax Advisory', category: 'Practice areas', href: '/admin/practice-areas', subtitle: 'Core service line', icon: BriefcaseBusiness },
  { title: 'Global Tax Forum', category: 'Events', href: '/admin/events', subtitle: 'Upcoming webinar', icon: CalendarDays },
  { title: 'Team', category: 'Content', href: '/admin/team', subtitle: 'Leadership directory', icon: Users },
  { title: 'Audit Logs', category: 'System', href: '/admin/audit-logs', subtitle: 'Security activity', icon: ShieldCheck },
];

export function GlobalSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = SEARCH_DATA.filter((item) =>
    `${item.title} ${item.category} ${item.subtitle}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="search-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="search-modal-head">
          <Search size={18} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, content, or settings"
          />
          <kbd>ESC</kbd>
          <button onClick={onClose} aria-label="Close search">
            <X size={17} />
          </button>
        </div>
        <div className="search-results">
          {filtered.length === 0 ? (
            <div className="empty-search">
              <Search size={20} />
              <strong>No matching results</strong>
              <span>Try a different search term.</span>
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href + item.title} href={item.href} onClick={onClose}>
                  <div className="result-icon">
                    <Icon size={16} />
                  </div>
                  <div>
                    <strong>{item.title}</strong>
                    <small>
                      {item.category} · {item.subtitle}
                    </small>
                  </div>
                  <ArrowUpRight size={15} />
                </Link>
              );
            })
          )}
        </div>
        <div className="search-foot">
          <span>
            <kbd>↑↓</kbd> Navigate
          </span>
          <span>
            <kbd>↵</kbd> Open
          </span>
          <span>
            <kbd>ESC</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}
