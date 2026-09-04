'use client';

import { useState } from 'react';
import { submitJobApplicationAction, QuestionConfig, ApplicationAnswer } from '@/app/actions/careerActions';
import { CheckCircle2, Send, FileText, User, Mail, Phone, Link as LinkIcon, AlertCircle } from 'lucide-react';

interface ApplicationFormProps {
  jobId: number;
  jobTitle: string;
  questions: QuestionConfig[];
}

export default function ApplicationForm({ jobId, jobTitle, questions }: ApplicationFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  // Local state for questions answers map: questionId -> answer string
  const [answersMap, setAnswersMap] = useState<Record<string, string>>({});

  const handleAnswerChange = (qId: string, val: string) => {
    setAnswersMap((prev) => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate required questions
    for (const q of questions) {
      if (q.required && (!answersMap[q.id] || answersMap[q.id].trim() === '')) {
        setLoading(false);
        setError(`Please answer required question: "${q.text}"`);
        return;
      }
    }

    const formattedAnswers: ApplicationAnswer[] = questions.map((q) => ({
      questionId: q.id,
      questionText: q.text,
      answer: answersMap[q.id] || 'Not answered',
    }));

    const formData = new FormData();
    formData.append('jobId', jobId.toString());
    formData.append('applicantName', applicantName);
    formData.append('applicantEmail', applicantEmail);
    formData.append('applicantPhone', applicantPhone);
    formData.append('resumeUrl', resumeUrl);
    formData.append('coverLetter', coverLetter);
    formData.append('answers', JSON.stringify(formattedAnswers));

    const res = await submitJobApplicationAction(formData);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || 'Failed to submit application. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="border border-emerald-200 bg-emerald-50 p-8 text-center space-y-4">
        <CheckCircle2 size={48} className="mx-auto text-emerald-600" />
        <h3 className="font-serif text-2xl font-bold text-slate-900">Application Submitted!</h3>
        <p className="text-sm text-slate-700 max-w-md mx-auto">
          Thank you for applying for <span className="font-bold">{jobTitle}</span>. Our talent acquisition team has received your application and will review it shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border border-slate-200 bg-white p-8 shadow-sm">
      <div>
        <h3 className="font-serif text-2xl font-bold text-ink">Apply for this Position</h3>
        <p className="text-xs text-slate-500 mt-1">
          Please fill out your personal information and complete the screening questions below.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Personal Details */}
      <div className="space-y-4 border-t border-slate-200 pt-6">
        <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
          1. Your Details
        </h4>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Full Name *
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              placeholder="e.g. Alexander Wright"
              className="w-full border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-navy focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={applicantEmail}
                onChange={(e) => setApplicantEmail(e.target.value)}
                placeholder="alexander@example.com"
                className="w-full border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-navy focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                required
                value={applicantPhone}
                onChange={(e) => setApplicantPhone(e.target.value)}
                placeholder="+44 7911 123456"
                className="w-full border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-navy focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Resume / CV URL
          </label>
          <div className="relative">
            <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="url"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="Link to Google Drive, Dropbox, LinkedIn profile, or portfolio..."
              className="w-full border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-navy focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Cover Letter / Summary
          </label>
          <textarea
            rows={4}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Introduce yourself and explain why you're a great fit for PSC Global..."
            className="w-full border border-slate-300 p-3 text-sm focus:border-navy focus:outline-none"
          />
        </div>
      </div>

      {/* Screening Questions Section */}
      {questions.length > 0 && (
        <div className="space-y-4 border-t border-slate-200 pt-6">
          <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            2. Screening Questions
          </h4>

          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={q.id || idx} className="p-4 border border-slate-200 bg-slate-50 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Q{idx + 1}: {q.text} {q.required && <span className="text-red-500">*</span>}
                </label>

                {q.type === 'YES_NO' ? (
                  <div className="flex items-center gap-6 pt-1">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        value="Yes"
                        checked={answersMap[q.id] === 'Yes'}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="text-navy"
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        value="No"
                        checked={answersMap[q.id] === 'No'}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="text-navy"
                      />
                      No
                    </label>
                  </div>
                ) : (
                  <textarea
                    rows={2}
                    value={answersMap[q.id] || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    placeholder="Enter your answer here..."
                    className="w-full border border-slate-300 bg-white p-2.5 text-xs focus:border-navy focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-navy px-6 py-3.5 text-xs font-bold tracking-wider text-white hover:bg-slate-800 transition disabled:opacity-50"
      >
        <Send size={16} />
        {loading ? 'SUBMITTING APPLICATION...' : 'SUBMIT APPLICATION'}
      </button>
    </form>
  );
}
