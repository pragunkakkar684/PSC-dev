'use client';

import { Link2, Mail, Printer } from 'lucide-react';
import { useState } from 'react';

export default function ShareInsight({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. non-HTTPS) — fail silently.
    }
  };

  const mailtoHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
    typeof window !== 'undefined' ? window.location.href : ''
  )}`;

  return (
    <div>
      <p className="font-mono text-xs font-bold tracking-[.14em] text-slate-500 uppercase">Share Insight</p>
      <div className="mt-4 space-y-3">
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex items-center gap-2 text-sm font-bold text-ink transition hover:text-sky-700"
        >
          <Link2 size={15} /> {copied ? 'Link Copied' : 'Copy Link'}
        </button>
        <a href={mailtoHref} className="flex items-center gap-2 text-sm font-bold text-ink transition hover:text-sky-700">
          <Mail size={15} /> Email
        </a>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 text-sm font-bold text-ink transition hover:text-sky-700"
        >
          <Printer size={15} /> Print Article
        </button>
      </div>
    </div>
  );
}