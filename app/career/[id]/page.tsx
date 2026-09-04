import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { careersPositions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import SiteHeader from '@/app/components/SiteHeader';
import Footer from '@/app/components/Footer';
import ApplicationForm from './ApplicationForm';
import { QuestionConfig } from '@/app/actions/careerActions';
import Link from 'next/link';
import { ArrowLeft, MapPin, Briefcase, Clock, Building2 } from 'lucide-react';

export default async function PublicJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const jobId = parseInt(id, 10);
  if (isNaN(jobId)) notFound();

  const [job] = await db.select().from(careersPositions).where(eq(careersPositions.id, jobId)).limit(1);
  if (!job || !job.isPublished) notFound();

  const questions = (job.questions as QuestionConfig[] | null) || [];

  return (
    <main id="top" className="min-h-screen bg-[#fdf9f8]">
      <SiteHeader />

      {/* Header Banner */}
      <section className="bg-navy px-6 py-16 text-white lg:px-10">
        <div className="mx-auto max-w-5xl space-y-4">
          <Link
            href="/career"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-slate-300 hover:text-white transition"
          >
            <ArrowLeft size={16} /> ALL OPEN POSITIONS
          </Link>

          <h1 className="font-serif text-4xl lg:text-5xl font-bold tracking-tight text-white">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Building2 size={16} className="text-amber-400" />
              {job.department}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={16} className="text-amber-400" />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase size={16} className="text-amber-400" />
              {job.type}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Job Spec */}
        <div className="lg:col-span-7 space-y-8">
          {job.description && (
            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-ink">Role Overview</h2>
              <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                {job.description}
              </div>
            </div>
          )}

          {job.requirements && (
            <div className="space-y-3 border-t border-slate-200 pt-8">
              <h2 className="font-serif text-2xl font-bold text-ink">Requirements & Qualifications</h2>
              <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                {job.requirements}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Application Form */}
        <div className="lg:col-span-5">
          <ApplicationForm
            jobId={job.id}
            jobTitle={job.title}
            questions={questions}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
