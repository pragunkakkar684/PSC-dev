'use client';

import { useState, useEffect } from 'react';
import { Search, Globe, FileText, Briefcase, Calendar, Users, HelpCircle, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
  title: string;
  category: string;
  href: string;
  subtitle?: string;
  icon: any;
}

const SEARCH_DATA: SearchResult[] = [
  { title: 'Home Page', category: 'WEBSITE PAGES', href: '/admin/pages/home', subtitle: 'Hero, Overview, Capabilities', icon: Globe },
  { title: 'About Us Page', category: 'WEBSITE PAGES', href: '/admin/pages/about', subtitle: 'Firm values, leadership, timeline', icon: Globe },
  { title: 'Practice Areas Directory', category: 'WEBSITE PAGES', href: '/admin/pages/practice-areas', subtitle: 'Tax Advisory, Legal, Risk', icon: Globe },
  { title: 'Industries Directory', category: 'WEBSITE PAGES', href: '/admin/pages/industries', subtitle: 'Manufacturing, Real Estate, GCC', icon: Globe },
  { title: 'Events Directory', category: 'WEBSITE PAGES', href: '/admin/pages/events', subtitle: 'Conferences & Webinars', icon: Globe },
  { title: 'Insights Directory', category: 'WEBSITE PAGES', href: '/admin/pages/insights', subtitle: 'Articles, Judgements, Reports', icon: Globe },
  { title: 'Careers Page', category: 'WEBSITE PAGES', href: '/admin/pages/career', subtitle: 'Job listings & candidate forms', icon: Globe },
  { title: 'Contact Page', category: 'WEBSITE PAGES', href: '/admin/pages/contact', subtitle: 'Offices, Inquiry forms', icon: Globe },
  
  { title: 'Tax Advisory & Compliance', category: 'PRACTICE AREAS', href: '/admin/practice-areas', subtitle: 'Corporate Tax, Transfer Pricing', icon: Briefcase },
  { title: 'Risk & Assurance', category: 'PRACTICE AREAS', href: '/admin/practice-areas', subtitle: 'Audit, Regulatory Compliance', icon: Briefcase },
  
  { title: 'Global Minimum Tax (Pillar Two)', category: 'INSIGHTS & PUBLICATIONS', href: '/admin/insights', subtitle: 'Article • Published 2026', icon: FileText },
  { title: 'GCC Operations Frameworks', category: 'INSIGHTS & PUBLICATIONS', href: '/admin/insights', subtitle: 'Research Report', icon: FileText },
  
  { title: 'Annual Tax Summit 2026', category: 'EVENTS', href: '/admin/events', subtitle: 'Upcoming Conference', icon: Calendar },
  
  { title: 'Candidate Applications', category: 'RECRUITMENT', href: '/client-portal/admin/careers', subtitle: 'Submitted candidate forms', icon: Users },
  { title: 'Client Account Management', category: 'CLIENT PORTAL', href: '/client-portal/admin/clients', subtitle: 'Corporate accounts & engagements', icon: Users },
  { title: 'Audit Logs', category: 'SYSTEM', href: '/admin/audit-logs', subtitle: 'Activity tracking & security logs', icon: HelpCircle },
];

export function GlobalSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = SEARCH_DATA.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#12131a] border border-slate-700/60 shadow-2xl overflow-hidden rounded-lg flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-700/60 bg-[#181a24]">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search website pages, practice areas, insights, events, team... (Press Esc to close)"
            className="w-full bg-transparent px-3 py-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No content found matching &quot;{query}&quot;.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-slate-800/60 text-slate-200 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-slate-800 text-amber-400 shrink-0">
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-100">{item.title}</p>
                      <p className="text-[11px] text-slate-400">
                        <span className="font-semibold text-amber-400/80">{item.category}</span>
                        {item.subtitle && ` • ${item.subtitle}`}
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-500 group-hover:text-amber-400 transition" />
                </Link>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#090a0f] border-t border-slate-800 text-[10px] text-slate-400">
          <span>Use <strong>Cmd+K</strong> or <strong>Ctrl+K</strong> anywhere to search</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
