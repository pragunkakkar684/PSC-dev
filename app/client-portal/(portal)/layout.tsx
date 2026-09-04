import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import { getPortalContext } from '@/lib/auth/portalAuth';
import ClientPortalNav from '../ClientPortalNav';
import { Bell, LogOut } from 'lucide-react';

export default async function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/client-portal/login');
  }

  const portalCtx = await getPortalContext();

  // If logged in user is Portal Admin, redirect them to Portal Admin dashboard
  if (portalCtx?.portalRole === 'PORTAL_ADMIN') {
    redirect('/client-portal/admin');
  }

  const companyName = portalCtx?.client?.companyName || session.user.name || 'Client Portal';
  const initials = companyName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="client-portal-shell min-h-screen bg-[#fdf9f8] text-[#0f172a]">
      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-[#fdf9f8] px-8 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-serif text-2xl tracking-wide text-ink">
            PSC GLOBAL
          </Link>
          <span className="h-5 w-px bg-slate-300" />
          <span className="text-xs font-medium tracking-wide text-slate-500">CLIENT PORTAL</span>
        </div>
        <div className="flex items-center gap-6">
          <Bell className="text-ink cursor-pointer hover:opacity-80" size={19} strokeWidth={1.5} />
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-navy text-xs font-bold text-white">
              {initials}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-ink">{companyName}</p>
              <p className="text-xs text-slate-500">Client Profile</p>
            </div>
          </div>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/client-portal/login' });
            }}
          >
            <button
              type="submit"
              title="Sign Out"
              className="flex items-center gap-1.5 border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-ink"
            >
              <LogOut size={14} /> LOGOUT
            </button>
          </form>
        </div>
      </header>

      {/* Main Container */}
      <div className="client-portal-body mx-auto flex max-w-[1440px]">
        {/* Navigation Sidebar */}
        <ClientPortalNav />

        {/* Dynamic Page Content */}
        <main className="min-w-0 flex-1 px-10 py-12">{children}</main>
      </div>
    </div>
  );
}
