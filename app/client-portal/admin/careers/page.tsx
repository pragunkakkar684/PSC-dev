import { db } from '@/lib/db';
import { careersPositions, portalJobApplications } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import CareersManager from './ApplicationsList';
import { QuestionConfig, ApplicationAnswer } from '@/app/actions/careerActions';

export default async function AdminCareersPage() {
  const jobsData = await db.select().from(careersPositions).orderBy(desc(careersPositions.createdAt));
  const appsData = await db.select().from(portalJobApplications).orderBy(desc(portalJobApplications.createdAt));

  const jobMap = new Map(jobsData.map((j) => [j.id, j.title]));

  const jobs = jobsData.map((j) => {
    const qCount = Array.isArray(j.questions) ? (j.questions as QuestionConfig[]).length : 0;
    const aCount = appsData.filter((a) => a.jobId === j.id).length;
    return {
      id: j.id,
      title: j.title,
      department: j.department,
      location: j.location,
      type: j.type,
      isPublished: j.isPublished,
      questionCount: qCount,
      applicationCount: aCount,
    };
  });

  const applications = appsData.map((a) => ({
    id: a.id,
    jobId: a.jobId,
    jobTitle: jobMap.get(a.jobId) || `Job #${a.jobId}`,
    applicantName: a.applicantName,
    applicantEmail: a.applicantEmail,
    applicantPhone: a.applicantPhone,
    resumeUrl: a.resumeUrl,
    coverLetter: a.coverLetter,
    answers: (a.answers as ApplicationAnswer[] | null) || [],
    status: a.status,
    createdAt: a.createdAt,
  }));

  return <CareersManager jobs={jobs} applications={applications} />;
}
