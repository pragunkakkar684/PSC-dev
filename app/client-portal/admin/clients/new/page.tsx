'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, User, Mail, Lock, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { createClientAccountAction } from '@/app/actions/portalAdminActions';

export default function NewClientAccountPage() {
  const [state, formAction, isPending] = useActionState(createClientAccountAction, null);

  return (
    <div className="max-w-3xl">
      <Link
        href="/client-portal/admin/clients"
        className="flex items-center gap-2 text-xs font-bold tracking-wide text-slate-500 hover:text-ink"
      >
        <ArrowLeft size={14} /> BACK TO CLIENT ACCOUNTS
      </Link>

      <h1 className="mt-4 font-serif text-4xl tracking-tight text-ink">
        Provision Client Account
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Create a new client profile and authentication credentials. Client accounts cannot self-register.
      </p>

      {state?.error && (
        <div className="mt-6 border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="mt-6 border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800">
          ✓ Client account provisioned successfully! Redirecting to client manager...
        </div>
      )}

      <form action={formAction} className="mt-8 border border-slate-200 bg-white p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-serif text-xl text-ink">1. Organization & Contact Details</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-slate-600">
              COMPANY NAME *
            </label>
            <div className="relative mt-2">
              <Building2
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                name="companyName"
                required
                placeholder="Acme Corporation"
                className="w-full border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-ink placeholder-slate-400 outline-none focus:border-ink focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-wider text-slate-600">
              PRIMARY CONTACT NAME *
            </label>
            <div className="relative mt-2">
              <User
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                name="contactName"
                required
                placeholder="John Doe"
                className="w-full border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-ink placeholder-slate-400 outline-none focus:border-ink focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-wider text-slate-600">
              PHONE NUMBER
            </label>
            <div className="relative mt-2">
              <Phone
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                name="phone"
                placeholder="+1 (555) 000-0000"
                className="w-full border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-ink placeholder-slate-400 outline-none focus:border-ink focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-wider text-slate-600">
              BUSINESS ADDRESS
            </label>
            <div className="relative mt-2">
              <MapPin
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                name="address"
                placeholder="100 Financial Center Blvd, New York"
                className="w-full border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-ink placeholder-slate-400 outline-none focus:border-ink focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="border-b border-slate-100 pb-4 pt-4">
          <h2 className="font-serif text-xl text-ink">2. Portal Login Credentials</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-slate-600">
              CLIENT EMAIL (LOGIN ID) *
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
                placeholder="client@acme.com"
                className="w-full border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-ink placeholder-slate-400 outline-none focus:border-ink focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-wider text-slate-600">
              INITIAL PASSWORD *
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
                placeholder="Minimum 8 characters"
                className="w-full border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-ink placeholder-slate-400 outline-none focus:border-ink focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 bg-navy px-8 py-3 text-xs font-bold tracking-wider text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {isPending ? 'PROVISIONING ACCOUNT...' : 'CREATE & PROVISION ACCOUNT'}
            <CheckCircle2 size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
