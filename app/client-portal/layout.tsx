'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarClock,
  CalendarPlus,
  CheckCircle2,
  ChevronDown,
  FileText,
  Handshake,
  LayoutDashboard,
  LifeBuoy,
  Receipt,
  Wallet,
} from 'lucide-react';

const navItems = [
  ['DASHBOARD', LayoutDashboard, '/client-portal'],
  ['MY ENGAGEMENTS', Handshake, '/client-portal/engagements'],
  ['TASKS', CheckCircle2, '/client-portal/tasks'],
  ['DOCUMENTS', FileText, '/client-portal/documents'],
  ['COMPLIANCE CALENDAR', CalendarClock, '/client-portal/calendar'],
  ['REPORTS', BarChart3, '/client-portal/reports'],
  ['INVOICES', Receipt, '/client-portal/invoices'],
  ['PAYMENTS', Wallet, '/client-portal/payments'],
];

const supportItems = [
  ['BOOK MEETING', CalendarPlus, '/client-portal/book-meeting'],
  ['RAISE SUPPORT TICKET', LifeBuoy, '/client-portal/support'],
  ['KNOWLEDGE CENTRE', BookOpen, '/client-portal/knowledge-centre'],
];

export default function ClientPortalLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="client-portal-shell min-h-screen bg-[#fdf9f8]">
      <header className="flex items-center justify-between border-b border-slate-200 bg-[#fdf9f8] px-8 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-serif text-2xl tracking-wide text-ink">
            PSC GLOBAL
          </Link>
          <span className="h-5 w-px bg-slate-300" />
          <span className="text-xs font-medium tracking-wide text-slate-500">CLIENT PORTAL</span>
        </div>
        <div className="flex items-center gap-6">
          <Bell className="text-ink" size={19} strokeWidth={1.5} />
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-navy text-xs font-bold text-white">
              AC
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-ink">Acme Corporation</p>
              <p className="text-xs text-slate-500">Client Profile</p>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </div>
        </div>
      </header>

      <div className="client-portal-body mx-auto flex max-w-[1440px]">
        <aside className="client-portal-sidebar sticky top-0 flex h-screen w-64 shrink-0 flex-col justify-between border-r border-slate-200 px-4 py-8">
          <nav className="space-y-1">
            {navItems.map(([label, Icon, href]) => {
              const isActive = href === '/client-portal' ? pathname === href : pathname?.startsWith(href);
              return (
                <Link
                  key={label}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-3 text-xs font-bold tracking-wide ${
                    isActive ? 'border-l-2 border-ink bg-slate-100 text-ink' : 'text-slate-600 hover:text-ink'
                  }`}
                >
                  <Icon size={16} strokeWidth={1.75} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 border-t border-slate-200 pt-6">
            <p className="px-3 text-[10px] font-bold tracking-[.14em] text-slate-400">SUPPORT & ACCOUNT</p>
            <nav className="mt-3 space-y-1">
              {supportItems.map(([label, Icon, href]) => (
                <Link key={label} href={href} className="flex items-center gap-3 px-3 py-3 text-xs font-bold tracking-wide text-slate-600 hover:text-ink">
                  <Icon size={16} strokeWidth={1.75} />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-10 py-12">{children}</main>
      </div>
    </div>
  );
}
