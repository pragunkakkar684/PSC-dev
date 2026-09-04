'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  BookOpen,
  CalendarClock,
  CalendarPlus,
  CheckCircle2,
  FileText,
  Handshake,
  LayoutDashboard,
  LifeBuoy,
  Receipt,
  Wallet,
} from 'lucide-react';

const navItems: Array<[string, React.ElementType, string]> = [
  ['DASHBOARD', LayoutDashboard, '/client-portal'],
  ['MY ENGAGEMENTS', Handshake, '/client-portal/engagements'],
  ['TASKS', CheckCircle2, '/client-portal/tasks'],
  ['DOCUMENTS', FileText, '/client-portal/documents'],
  ['COMPLIANCE CALENDAR', CalendarClock, '/client-portal/calendar'],
  ['REPORTS', BarChart3, '/client-portal/reports'],
  ['INVOICES', Receipt, '/client-portal/invoices'],
  ['PAYMENTS', Wallet, '/client-portal/payments'],
];

const supportItems: Array<[string, React.ElementType, string]> = [
  ['BOOK MEETING', CalendarPlus, '/client-portal/meeting'],
  ['RAISE SUPPORT TICKET', LifeBuoy, '/client-portal/support'],
];

export default function ClientPortalNav() {
  const pathname = usePathname();

  return (
    <aside className="client-portal-sidebar sticky top-0 flex h-screen w-64 shrink-0 flex-col justify-between border-r border-slate-200 px-4 py-8">
      <nav className="space-y-1">
        {navItems.map(([label, Icon, href]) => {
          const isActive = href === '/client-portal' ? pathname === href : pathname?.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 px-3 py-3 text-xs font-bold tracking-wide transition ${
                isActive
                  ? 'border-l-2 border-ink bg-slate-100 text-ink'
                  : 'text-slate-600 hover:text-ink'
              }`}
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-10 border-t border-slate-200 pt-6">
        <p className="px-3 text-[10px] font-bold tracking-[.14em] text-slate-400">
          SUPPORT & ACCOUNT
        </p>
        <nav className="mt-3 space-y-1">
          {supportItems.map(([label, Icon, href]) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 px-3 py-3 text-xs font-bold tracking-wide text-slate-600 hover:text-ink"
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
