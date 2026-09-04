'use client';

import { useState } from 'react';
import { ApplicationAnswer, updateApplicationStatusAction, deleteJobOpeningAction } from '@/app/actions/careerActions';
import {
  Search,
  Eye,
  FileText,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Edit,
  Trash2,
  Plus,
  Briefcase,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';

interface ApplicationItem {
  id: number;
  jobId: number;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  resumeUrl: string | null;
  coverLetter: string | null;
  answers: ApplicationAnswer[] | null;
  status: string;
  createdAt: Date;
}

interface JobOpeningItem {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  isPublished: boolean;
  questionCount: number;
  applicationCount: number;
}

interface CareersManagerProps {
  jobs: JobOpeningItem[];
  applications: ApplicationItem[];
}

export default function CareersManager({ jobs, applications }: CareersManagerProps) {
  const [activeTab, setActiveTab] = useState<'JOB_OPENINGS' | 'APPLICATIONS'>('JOB_OPENINGS');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (appId: number, newStatus: string) => {
    setUpdating(true);
    await updateApplicationStatusAction(appId, newStatus);
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
    setUpdating(false);
  };

  const handleDeleteJob = async (jobId: number, title: string) => {
    if (confirm(`Are you sure you want to delete job opening "${title}"?`)) {
      await deleteJobOpeningAction(jobId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-ink">
            Careers & Candidate Applications
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Configure job openings with custom screening questions and view candidate applications.
          </p>
        </div>
        <Link
          href="/client-portal/admin/careers/new"
          className="inline-flex items-center gap-2 bg-navy px-4 py-2.5 text-xs font-bold tracking-wider text-white hover:bg-slate-800 transition shrink-0"
        >
          <Plus size={16} /> NEW JOB OPENING
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('JOB_OPENINGS')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold tracking-wider transition border-b-2 ${
            activeTab === 'JOB_OPENINGS'
              ? 'border-navy text-navy bg-white'
              : 'border-transparent text-slate-500 hover:text-ink'
          }`}
        >
          <Briefcase size={16} /> JOB OPENINGS ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('APPLICATIONS')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold tracking-wider transition border-b-2 ${
            activeTab === 'APPLICATIONS'
              ? 'border-navy text-navy bg-white'
              : 'border-transparent text-slate-500 hover:text-ink'
          }`}
        >
          <UserCheck size={16} /> CANDIDATE APPLICATIONS ({applications.length})
        </button>
      </div>

      {/* TAB 1: JOB OPENINGS */}
      {activeTab === 'JOB_OPENINGS' && (
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="border border-slate-200 bg-white p-12 text-center space-y-4">
              <Briefcase size={36} className="mx-auto text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No job openings created yet.</p>
              <Link
                href="/client-portal/admin/careers/new"
                className="inline-flex items-center gap-2 bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                <Plus size={14} /> CREATE FIRST JOB OPENING
              </Link>
            </div>
          ) : (
            <div className="border border-slate-200 bg-white divide-y divide-slate-100">
              <div className="grid grid-cols-12 bg-slate-50 px-6 py-3 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                <div className="col-span-4">POSITION TITLE</div>
                <div className="col-span-2">DEPARTMENT</div>
                <div className="col-span-2">LOCATION</div>
                <div className="col-span-1 text-center">QUESTIONS</div>
                <div className="col-span-1 text-center">APPLICATIONS</div>
                <div className="col-span-2 text-right">ACTIONS</div>
              </div>

              {jobs.map((job) => (
                <div key={job.id} className="grid grid-cols-12 items-center px-6 py-4 text-xs font-medium text-slate-700 hover:bg-slate-50/50">
                  <div className="col-span-4 pr-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/client-portal/admin/careers/${job.id}`} className="font-bold text-ink hover:underline">
                        {job.title}
                      </Link>
                      {job.isPublished ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                          PUBLISHED
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 text-[10px] font-bold">
                          DRAFT
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">ID: #{job.id} • {job.type}</p>
                  </div>
                  <div className="col-span-2 text-slate-600">{job.department}</div>
                  <div className="col-span-2 text-slate-600">{job.location}</div>
                  <div className="col-span-1 text-center font-bold text-slate-700">{job.questionCount}</div>
                  <div className="col-span-1 text-center font-bold text-navy">{job.applicationCount}</div>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <Link
                      href={`/client-portal/admin/careers/${job.id}`}
                      className="p-1.5 text-slate-500 hover:text-navy transition"
                      title="Edit Job & Questions"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDeleteJob(job.id, job.title)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition"
                      title="Delete Job"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CANDIDATE APPLICATIONS */}
      {activeTab === 'APPLICATIONS' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200 bg-white p-4">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidate name, email..."
                className="w-full border border-slate-200 pl-9 pr-3 py-1.5 text-xs focus:border-navy focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-400">STATUS:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-200 px-3 py-1.5 text-xs focus:border-navy focus:outline-none"
              >
                <option value="ALL">ALL STATUSES</option>
                <option value="NEW">NEW</option>
                <option value="REVIEWED">REVIEWED</option>
                <option value="SHORTLISTED">SHORTLISTED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="border border-slate-200 bg-white p-12 text-center text-slate-500 text-xs">
              No candidate applications match your filters.
            </div>
          ) : (
            <div className="border border-slate-200 bg-white divide-y divide-slate-100">
              <div className="grid grid-cols-12 bg-slate-50 px-6 py-3 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                <div className="col-span-3">CANDIDATE NAME</div>
                <div className="col-span-3">POSITION APPLIED</div>
                <div className="col-span-3">CONTACT DETAILS</div>
                <div className="col-span-1">STATUS</div>
                <div className="col-span-2 text-right">ACTION</div>
              </div>

              {filteredApplications.map((app) => (
                <div key={app.id} className="grid grid-cols-12 items-center px-6 py-4 text-xs font-medium text-slate-700 hover:bg-slate-50/50">
                  <div className="col-span-3">
                    <p className="font-bold text-ink">{app.applicantName}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Applied {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="col-span-3 font-semibold text-slate-800 pr-2">
                    {app.jobTitle}
                  </div>
                  <div className="col-span-3 space-y-0.5 text-slate-500 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Mail size={12} className="text-slate-400 shrink-0" />
                      <a href={`mailto:${app.applicantEmail}`} className="hover:underline">
                        {app.applicantEmail}
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone size={12} className="text-slate-400 shrink-0" />
                      <span>{app.applicantPhone}</span>
                    </div>
                  </div>
                  <div className="col-span-1">
                    {app.status === 'NEW' && (
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[10px] font-bold">
                        NEW
                      </span>
                    )}
                    {app.status === 'REVIEWED' && (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-[10px] font-bold">
                        REVIEWED
                      </span>
                    )}
                    {app.status === 'SHORTLISTED' && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                        SHORTLISTED
                      </span>
                    )}
                    {app.status === 'REJECTED' && (
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 text-[10px] font-bold">
                        REJECTED
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 text-right">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-bold text-ink transition"
                    >
                      <Eye size={14} /> VIEW DETAILS
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Candidate Details Drawer Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-ink">
                  Candidate Application: {selectedApp.applicantName}
                </h3>
                <p className="text-xs text-slate-500">
                  Applied for <span className="font-semibold text-navy">{selectedApp.jobTitle}</span> on{' '}
                  {new Date(selectedApp.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-ink text-xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Contact Card */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">EMAIL</p>
                  <a href={`mailto:${selectedApp.applicantEmail}`} className="text-xs font-bold text-navy hover:underline">
                    {selectedApp.applicantEmail}
                  </a>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">PHONE</p>
                  <p className="text-xs font-bold text-slate-700">{selectedApp.applicantPhone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">RESUME LINK</p>
                  {selectedApp.resumeUrl ? (
                    <a
                      href={selectedApp.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-navy hover:underline"
                    >
                      <ExternalLink size={12} /> OPEN RESUME
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">Not provided</span>
                  )}
                </div>
              </div>

              {/* Cover Letter */}
              {selectedApp.coverLetter && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    COVER LETTER / ADDITIONAL NOTES
                  </h4>
                  <div className="p-4 border border-slate-200 bg-white text-xs text-slate-700 whitespace-pre-wrap">
                    {selectedApp.coverLetter}
                  </div>
                </div>
              )}

              {/* Screening Question Responses */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  SCREENING QUESTION RESPONSES
                </h4>
                {!selectedApp.answers || selectedApp.answers.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No screening questions were answered.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedApp.answers.map((ans, i) => (
                      <div key={i} className="p-3 border border-slate-200 bg-slate-50 space-y-1">
                        <p className="text-xs font-bold text-slate-800">
                          Q{i + 1}: {ans.questionText}
                        </p>
                        <p className="text-xs font-medium text-navy bg-white border border-slate-200 px-3 py-1.5 inline-block">
                          Answer: {ans.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">SET STATUS:</span>
                <button
                  disabled={updating}
                  onClick={() => handleStatusChange(selectedApp.id, 'REVIEWED')}
                  className={`px-3 py-1 text-xs font-bold tracking-wide transition ${
                    selectedApp.status === 'REVIEWED'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  REVIEWED
                </button>
                <button
                  disabled={updating}
                  onClick={() => handleStatusChange(selectedApp.id, 'SHORTLISTED')}
                  className={`px-3 py-1 text-xs font-bold tracking-wide transition ${
                    selectedApp.status === 'SHORTLISTED'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  SHORTLISTED
                </button>
                <button
                  disabled={updating}
                  onClick={() => handleStatusChange(selectedApp.id, 'REJECTED')}
                  className={`px-3 py-1 text-xs font-bold tracking-wide transition ${
                    selectedApp.status === 'REJECTED'
                      ? 'bg-rose-600 text-white'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  REJECTED
                </button>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="bg-slate-200 hover:bg-slate-300 px-4 py-1.5 text-xs font-bold text-slate-700"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
