import JobFunctionForm from "@/components/forms/job-function-form";

export default function NewJobFunctionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Add Job Function</h1>
      </div>
      
      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Job Function Details</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Job functions define roles within your organization for which employees can be evaluated.
        </p>
        <JobFunctionForm />
      </div>
    </div>
  );
} 