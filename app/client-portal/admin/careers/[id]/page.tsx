import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { careersPositions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import JobForm from '../JobForm';
import { QuestionConfig } from '@/app/actions/careerActions';

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const jobId = parseInt(id, 10);
  if (isNaN(jobId)) notFound();

  const [job] = await db.select().from(careersPositions).where(eq(careersPositions.id, jobId)).limit(1);
  if (!job) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-ink">
          Edit Job Opening: {job.title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update job specifications, location, status, and candidate screening questions.
        </p>
      </div>

      <JobForm
        initialData={{
          id: job.id,
          title: job.title,
          department: job.department,
          location: job.location,
          type: job.type,
          description: job.description,
          requirements: job.requirements,
          questions: job.questions as QuestionConfig[] | null,
          isPublished: job.isPublished,
        }}
      />
    </div>
  );
}
