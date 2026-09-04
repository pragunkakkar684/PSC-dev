'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { submitContactFormAction } from '@/app/actions/publicForms';

export default function PublicContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    practiceArea: 'General Inquiry',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await submitContactFormAction(formData);
      setSuccess(true);
      setFormData({
        fullName: '',
        company: '',
        email: '',
        phone: '',
        practiceArea: 'General Inquiry',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit consultation request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-slate-200 bg-white p-8">
      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <span>Thank you! Your inquiry has been logged securely. A partner will contact you shortly.</span>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-[10px] font-bold tracking-wide text-slate-500">FULL NAME *</span>
          <input
            type="text"
            required
            className="mt-2 w-full border border-slate-200 px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
            placeholder="Jane Doe"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-bold tracking-wide text-slate-500">COMPANY</span>
          <input
            type="text"
            className="mt-2 w-full border border-slate-200 px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
            placeholder="Organization Name"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-bold tracking-wide text-slate-500">BUSINESS EMAIL *</span>
          <input
            type="email"
            required
            className="mt-2 w-full border border-slate-200 px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
            placeholder="jane@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-bold tracking-wide text-slate-500">PHONE (OPTIONAL)</span>
          <input
            type="tel"
            className="mt-2 w-full border border-slate-200 px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="text-[10px] font-bold tracking-wide text-slate-500">PRACTICE AREA</span>
        <select
          className="mt-2 w-full border border-slate-200 px-3 py-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
          value={formData.practiceArea}
          onChange={(e) => setFormData({ ...formData, practiceArea: e.target.value })}
        >
          <option value="General Inquiry">General Inquiry</option>
          <option value="Corporate Law">Corporate Law</option>
          <option value="Tax Advisory">Tax Advisory</option>
          <option value="Risk & Assurance">Risk & Assurance</option>
          <option value="Business Advisory">Business Advisory</option>
          <option value="GCC Structuring">CC Capital Structuring</option>
        </select>
      </label>

      <label className="mt-5 block">
        <span className="text-[10px] font-bold tracking-wide text-slate-500">MESSAGE *</span>
        <textarea
          required
          rows={4}
          className="mt-2 w-full border border-slate-200 px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
          placeholder="Briefly describe your objectives..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex items-center gap-2 bg-ink px-6 py-3.5 text-xs font-bold tracking-wide text-white transition hover:bg-slate-800 disabled:opacity-50"
      >
        <span>{loading ? 'SUBMITTING...' : 'BOOK MY CONSULTATION'}</span>
        <ArrowRight size={14} />
      </button>
    </form>
  );
}
