'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createJobOpeningAction, updateJobOpeningAction, QuestionConfig } from '@/app/actions/careerActions';
import { Plus, Trash2, HelpCircle, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface JobFormProps {
  initialData?: {
    id: number;
    title: string;
    department: string;
    location: string;
    type: string;
    description?: string | null;
    requirements?: string | null;
    questions?: QuestionConfig[] | null;
    isPublished?: boolean;
  };
}

export default function JobForm({ initialData }: JobFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState(initialData?.title || '');
  const [department, setDepartment] = useState(initialData?.department || 'Tax Advisory');
  const [location, setLocation] = useState(initialData?.location || 'London, UK');
  const [type, setType] = useState(initialData?.type || 'Full-time');
  const [description, setDescription] = useState(initialData?.description || '');
  const [requirements, setRequirements] = useState(initialData?.requirements || '');
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);

  const [questions, setQuestions] = useState<QuestionConfig[]>(
    initialData?.questions || [
      { id: 'q_1', text: 'Are you eligible to work in the UK?', type: 'YES_NO', required: true },
    ]
  );

  const handleAddQuestion = () => {
    const newQ: QuestionConfig = {
      id: `q_${Date.now()}`,
      text: '',
      type: 'YES_NO',
      required: true,
    };
    setQuestions([...questions, newQ]);
  };

  const handleUpdateQuestion = (index: number, field: keyof QuestionConfig, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('department', department);
    formData.append('location', location);
    formData.append('type', type);
    formData.append('description', description);
    formData.append('requirements', requirements);
    formData.append('isPublished', isPublished ? 'true' : 'false');
    formData.append('questions', JSON.stringify(questions));

    let res;
    if (initialData?.id) {
      res = await updateJobOpeningAction(initialData.id, formData);
    } else {
      res = await createJobOpeningAction(formData);
    }

    setLoading(false);

    if (res.success) {
      router.push('/client-portal/admin/careers');
    } else {
      setError(res.error || 'Failed to save job opening');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href="/client-portal/admin/careers"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-ink transition"
        >
          <ArrowLeft size={16} /> BACK TO CAREERS
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-navy px-5 py-2.5 text-xs font-bold tracking-wider text-white hover:bg-slate-800 transition disabled:opacity-50"
        >
          <Save size={16} />
          {loading ? 'SAVING...' : initialData?.id ? 'UPDATE JOB OPENING' : 'CREATE JOB OPENING'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Basic Job Details */}
      <div className="border border-slate-200 bg-white p-6 space-y-6">
        <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase">
          1. Basic Job Details
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Job Title / Position Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior International Tax Specialist"
              className="w-full border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Tax Advisory"
                className="w-full border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. London, UK / Remote"
                className="w-full border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Employment Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Job Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the role and responsibilities..."
              className="w-full border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Key Requirements & Qualifications
            </label>
            <textarea
              rows={3}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="e.g. CTA qualified, 5+ years post qualification experience..."
              className="w-full border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 text-navy border-slate-300 focus:ring-navy"
            />
            <label htmlFor="isPublished" className="text-xs font-bold text-slate-700">
              PUBLISH IMMEDIATELY TO CAREERS PAGE
            </label>
          </div>
        </div>
      </div>

      {/* Screening Questions Configuration */}
      <div className="border border-slate-200 bg-white p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase">
              2. Custom Screening Questions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Add Yes/No radio choices or open Text questions for candidate application forms.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddQuestion}
            className="flex items-center gap-1.5 border border-navy px-3 py-1.5 text-xs font-bold tracking-wide text-navy hover:bg-navy hover:text-white transition"
          >
            <Plus size={14} /> ADD QUESTION
          </button>
        </div>

        {questions.length === 0 ? (
          <div className="border border-dashed border-slate-300 p-8 text-center text-slate-400 text-xs">
            No screening questions added yet. Click &quot;ADD QUESTION&quot; above to create one.
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={q.id || idx} className="p-4 border border-slate-200 bg-slate-50 relative space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <HelpCircle size={16} className="text-slate-400 shrink-0" />
                      <input
                        type="text"
                        required
                        value={q.text}
                        onChange={(e) => handleUpdateQuestion(idx, 'text', e.target.value)}
                        placeholder={`Question ${idx + 1}: e.g. Do you have relevant tax experience?`}
                        className="w-full border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-navy focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-6 pl-6">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-500">TYPE:</span>
                        <label className="flex items-center gap-1 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="radio"
                            name={`type_${idx}`}
                            checked={q.type === 'YES_NO'}
                            onChange={() => handleUpdateQuestion(idx, 'type', 'YES_NO')}
                            className="text-navy"
                          />
                          Yes / No Radio
                        </label>
                        <label className="flex items-center gap-1 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="radio"
                            name={`type_${idx}`}
                            checked={q.type === 'TEXT'}
                            onChange={() => handleUpdateQuestion(idx, 'type', 'TEXT')}
                            className="text-navy"
                          />
                          Text Answer
                        </label>
                      </div>

                      <label className="flex items-center gap-1 text-xs text-slate-700 cursor-pointer ml-auto">
                        <input
                          type="checkbox"
                          checked={q.required ?? true}
                          onChange={(e) => handleUpdateQuestion(idx, 'required', e.target.checked)}
                          className="text-navy"
                        />
                        Required Question
                      </label>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(idx)}
                    className="text-slate-400 hover:text-red-600 transition p-1"
                    title="Remove Question"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-navy px-6 py-3 text-xs font-bold tracking-wider text-white hover:bg-slate-800 transition disabled:opacity-50"
        >
          <Save size={16} />
          {loading ? 'SAVING...' : initialData?.id ? 'UPDATE JOB OPENING' : 'CREATE JOB OPENING'}
        </button>
      </div>
    </form>
  );
}
