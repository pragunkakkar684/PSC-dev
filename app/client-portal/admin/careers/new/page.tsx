import JobForm from '../JobForm';

export default function NewJobPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-ink">
          Create New Job Opening
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Configure title, requirements, and custom screening questions for candidate applications.
        </p>
      </div>

      <JobForm />
    </div>
  );
}
