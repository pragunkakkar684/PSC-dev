import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { portalUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { LogOut } from 'lucide-react';
import PortalAdminNav from './PortalAdminNav';

export default async function PortalAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/client-portal/login');
  }

  const role = (session.user as any).role;
  const portalRole = (session.user as any).portalRole;
  const isPortalAdmin = portalRole === 'PORTAL_ADMIN' || role === 'admin' || role === 'editor' || role === 'superadmin';

  if (!isPortalAdmin) {
    redirect('/client-portal');
  }

  return (
    <div className="client-portal-shell min-h-screen bg-[#fdf9f8] text-[#0f172a]">
      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-[#fdf9f8] px-8 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-serif text-2xl tracking-wide text-ink">
            PSC GLOBAL
          </Link>
          <span className="h-5 w-px bg-slate-300" />
          <span className="bg-navy px-2.5 py-1 text-[10px] font-bold tracking-widest text-white">
            PORTAL ADMIN
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm font-semibold text-ink">{session.user.name || 'Portal Administrator'}</p>
            <p className="text-xs text-slate-500">{session.user.email}</p>
          </div>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/client-portal/login' });
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-1.5 border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold tracking-wide text-slate-600 transition hover:bg-slate-50 hover:text-ink"
            >
              <LogOut size={14} /> LOGOUT
            </button>
          </form>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto flex max-w-[1440px]">
        <PortalAdminNav />

        {/* Content Body */}
        <main className="min-w-0 flex-1 px-10 py-12">{children}</main>
      </div>
    </div>
  );
}
