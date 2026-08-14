'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { submitNewsletterAction } from '@/app/actions/publicForms';

export default function PublicNewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(false);
    setError(null);
    setSuccessMessage(null);

    if (!email) return;

    setLoading(true);
    try {
      const res = await submitNewsletterAction(email);
      setSuccessMessage(res.message);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Subscription failed. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {successMessage ? (
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
          <CheckCircle2 size={16} />
          <span>{successMessage}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            required
            placeholder="Enter your corporate email..."
            className="w-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center bg-sky-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
          >
            {loading ? '...' : <ArrowRight size={14} />}
          </button>
        </form>
      )}
      {error && <p className="mt-1 text-[11px] color-red-400 text-red-400">{error}</p>}
    </div>
  );
}
