'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  items?: Array<{ label: string; href?: string }>;
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Auto-generate if custom items not provided
  const segments = pathname.split('/').filter(Boolean);
  
  const generatedItems = items || segments.map((segment, idx) => {
    const href = '/' + segments.slice(0, idx + 1).join('/');
    const label = segment.replace(/-/g, ' ').toUpperCase();
    return { label, href: idx === segments.length - 1 ? undefined : href };
  });

  return (
    <nav className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)]">
      <Link href="/admin" className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
        <Home size={13} />
        <span>CMS</span>
      </Link>

      {generatedItems.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <ChevronRight size={12} className="text-[var(--text-muted)] shrink-0" />
          {item.href ? (
            <Link href={item.href} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--text-primary)] font-bold">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
