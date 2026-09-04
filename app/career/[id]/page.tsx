import { ArrowLeft, ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { careersPositions } from '@/lib/db/schema';
import AnimatedSection from '@/app/components/AnimatedSection';
import SiteHeader from '@/app/components/SiteHeader';
import Footer from '@/app/components/Footer';
import ApplicationForm from './ApplicationForm';
import { QuestionConfig } from '@/app/actions/careerActions';

export default async function PublicJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const jobId = parseInt(id, 10);
  if (isNaN(jobId)) notFound();

  const [job] = await db
    .select()
    .from(careersPositions)
    .where(eq(careersPositions.id, jobId))
    .limit(1);

  if (!job || !job.isPublished) notFound();

  const questions = (job.questions as QuestionConfig[] | null) || [];

  return (
    <main id="top">
      <SiteHeader />

      {/* HEADER */}
      <AnimatedSection className="border-b border-slate-200 bg-[#fdf8f3] px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="flex flex-wrap items-center gap-2 font-mono text-xs tracking-[.14em] text-sky-700 uppercase">
            <Link href="/careers" className="inline-flex items-center gap-1.5 hover:text-ink">
              <ArrowLeft size={13} /> CAREERS
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="/careers#open-roles" className="hover:text-ink">
              OPEN POSITIONS
            </Link>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">{job.title}</span>
          </p>

          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-2xl font-serif text-5xl leading-[1.05] tracking-[-.03em] text-ink sm:text-6xl">
                {job.title}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {job.location}
                </span>
                <span className="text-slate-300">·</span>
                <span>{job.department}</span>
                <span className="text-slate-300">·</span>
                <span>{job.type}</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 self-start border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-bold tracking-wide text-ink uppercase">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              Application Open
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* CONTENT */}
      <AnimatedSection className="px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.7fr_1fr]">
          {/* LEFT: JOB DETAILS */}
          <div className="space-y-12">
            {job.description && (
              <div>
                <p className="font-mono text-xs tracking-[.18em] text-slate-500 uppercase">Job Overview</p>
                <p className="mt-4 text-base leading-7 whitespace-pre-wrap text-slate-600">
                  {job.description}
                </p>
              </div>
            )}

            {job.requirements && (
              <div className="border-t border-slate-200 pt-10">
                <p className="font-mono text-xs tracking-[.18em] text-slate-500 uppercase">
                  What We&apos;re Looking For
                </p>
                <p className="mt-4 text-sm leading-6 whitespace-pre-wrap text-slate-600">
                  {job.requirements}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: ROLE AT A GLANCE */}
          <div>
            <div className="sticky top-28 border border-slate-200 bg-white p-8">
              <h3 className="font-serif text-2xl text-ink">Role at a Glance</h3>
              <div className="mt-6 divide-y divide-slate-200 text-sm">
                <div className="pb-4">
                  <span className="block font-mono text-[11px] tracking-[.1em] text-slate-500 uppercase">
                    Practice Area
                  </span>
                  <span className="mt-1 block text-base font-bold text-ink">{job.department}</span>
                </div>
                <div className="py-4">
                  <span className="block font-mono text-[11px] tracking-[.1em] text-slate-500 uppercase">
                    Location
                  </span>
                  <span className="mt-1 block text-base font-bold text-ink">{job.location}</span>
                </div>
                <div className="pt-4">
                  <span className="block font-mono text-[11px] tracking-[.1em] text-slate-500 uppercase">
                    Employment Type
                  </span>
                  <span className="mt-1 block text-base font-bold text-ink">{job.type}</span>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-200 pt-6">
                <p className="font-mono text-xs tracking-[.14em] text-slate-500 uppercase">Questions?</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  If you have questions about this position, contact our recruitment team.
                </p>
                <a
                  href="mailto:careers@pscglobal.com"
                  className="mt-3 flex items-center gap-1.5 text-xs font-bold tracking-wide text-ink hover:text-sky-700"
                >
                  CONTACT CAREERS <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* APPLICATION FORM (real, DB-wired) */}
      <AnimatedSection id="apply" className="border-t border-slate-200 bg-slate-50 px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs tracking-[.18em] text-slate-500 uppercase">Application Process</p>
            <h2 className="mt-4 font-serif text-4xl text-ink lg:text-5xl">Apply for This Position</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600 lg:text-base">
              Complete the form below and our talent team will be in touch if your experience aligns with the role.
            </p>
          </div>

          <div className="mt-14">
            <ApplicationForm jobId={job.id} jobTitle={job.title} questions={questions} />
          </div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="flex flex-col items-center justify-center border-t border-slate-200 bg-sky-50 px-6 py-24 text-center">
        <h2 className="max-w-2xl font-serif text-5xl leading-[1.05] text-ink lg:text-6xl">
          Explore More Opportunities
        </h2>
        <p className="mt-4 max-w-md text-sm leading-6 text-slate-600 lg:text-base">
          Looking for a different role? Browse our current openings and find where your expertise fits.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/career#open-roles"
            className="bg-ink px-5 py-3 text-xs font-bold text-white transition hover:bg-slate-800"
          >
            VIEW ALL OPEN POSITIONS
          </Link>
          <Link
            href="/career"
            className="border border-ink px-5 py-3 text-xs font-bold text-ink transition hover:bg-slate-100"
          >
            BACK TO CAREERS
          </Link>
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  );
}