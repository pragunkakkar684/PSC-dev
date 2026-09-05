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
    <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-4">
      <Link href="/admin" className="flex items-center gap-1 hover:text-slate-200 transition">
        <Home size={13} />
        <span>ADMIN</span>
      </Link>

      {generatedItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight size={12} className="text-slate-600 shrink-0" />
          {item.href ? (
            <Link href={item.href} className="hover:text-slate-200 transition">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-200 font-bold">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
