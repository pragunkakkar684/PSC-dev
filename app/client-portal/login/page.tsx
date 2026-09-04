'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { loginClientPortalAction } from './actions';

export default function ClientPortalLoginPage() {
  const [state, formAction, isPending] = useActionState(loginClientPortalAction, null);

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#fdf9f8] text-[#0f172a]">
      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-slate-200 px-8 py-5">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-serif text-2xl tracking-wide text-ink">
            PSC GLOBAL
          </Link>
          <span className="h-5 w-px bg-slate-300" />
          <span className="text-xs font-medium tracking-wide text-slate-500">CLIENT PORTAL</span>
        </div>
        <Link
          href="/"
          className="text-xs font-bold tracking-wider text-slate-600 transition hover:text-ink"
        >
          RETURN TO MAIN SITE →
        </Link>
      </header>

      {/* Center Login Box */}
      <main className="mx-auto my-auto w-full max-w-md px-6 py-12">
        <div className="border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="flex h-10 w-10 items-center justify-center bg-navy text-white">
              <ShieldCheck size={20} strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-semibold text-ink">Portal Sign In</h1>
              <p className="text-xs text-slate-500">Secure Client & Operations Portal</p>
            </div>
          </div>

          {state?.error && (
            <div className="mt-6 border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
              {state.error}
            </div>
          )}

          <form action={formAction} className="mt-6 space-y-5">
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-600">
                EMAIL ADDRESS
              </label>
              <div className="relative mt-2">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="client@company.com"
                  className="w-full border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-ink placeholder-slate-400 outline-none transition focus:border-ink focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-600">
                PASSWORD
              </label>
              <div className="relative mt-2">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-ink placeholder-slate-400 outline-none transition focus:border-ink focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 bg-navy px-6 py-3 text-xs font-bold tracking-wider text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {isPending ? 'AUTHENTICATING...' : 'ACCESS PORTAL'}
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="mt-8 border-t border-slate-100 pt-5 text-center text-[11px] text-slate-500">
            <p>Protected by PSC Global enterprise security.</p>
            <p className="mt-1 text-[10px] text-slate-400">
              Need account access? Contact your PSC Global Relationship Lead.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} PSC Global. All rights reserved.
      </footer>
    </div>
  );
}
