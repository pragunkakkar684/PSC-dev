'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  Briefcase,
  CheckCircle2,
  FileText,
  Receipt,
  Wallet,
  Calendar,
  BarChart3,
  LifeBuoy,
  ShieldAlert,
  UserCheck,
  LayoutDashboard,
} from 'lucide-react';

const adminNavItems = [
  { label: 'OVERVIEW', icon: LayoutDashboard, href: '/client-portal/admin' },
  { label: 'CLIENT ACCOUNTS', icon: Users, href: '/client-portal/admin/clients' },
  { label: 'ENGAGEMENTS', icon: Briefcase, href: '/client-portal/admin/engagements' },
  { label: 'TASKS', icon: CheckCircle2, href: '/client-portal/admin/tasks' },
  { label: 'DOCUMENTS', icon: FileText, href: '/client-portal/admin/documents' },
  { label: 'COMPLIANCE', icon: ShieldAlert, href: '/client-portal/admin/compliance' },
  { label: 'INVOICES', icon: Receipt, href: '/client-portal/admin/invoices' },
  { label: 'PAYMENTS', icon: Wallet, href: '/client-portal/admin/payments' },
  { label: 'MEETINGS', icon: Calendar, href: '/client-portal/admin/meetings' },
  { label: 'REPORTS', icon: BarChart3, href: '/client-portal/admin/reports' },
  { label: 'CAREERS & RECRUITMENT', icon: UserCheck, href: '/client-portal/admin/careers' },
  { label: 'SUPPORT INBOX', icon: LifeBuoy, href: '/client-portal/admin/support' },
];

export default function PortalAdminNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col justify-between border-r border-slate-200 px-4 py-8">
      <nav className="space-y-1">
        <p className="px-3 pb-3 text-[10px] font-bold tracking-[.14em] text-slate-400">PORTAL OPERATIONS</p>
        {adminNavItems.map(({ label, icon: Icon, href }) => {
          const isActive = href === '/client-portal/admin' ? pathname === href : pathname?.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3 px-3 py-3 text-xs font-bold tracking-wide transition ${
                isActive
                  ? 'border-l-2 border-ink bg-slate-100 text-ink'
                  : 'text-slate-600 hover:border-l-2 hover:border-ink hover:bg-slate-100 hover:text-ink'
              }`}
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
