import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evaluations | Simple Evaluation",
  description: "Manage performance evaluations for your organization",
};

export default function EvaluationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Evaluations</h1>
        <Link
          href="/evaluations/new"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2"
        >
          Create Evaluation
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <Link 
          href="/evaluations?filter=pending" 
          className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary"
        >
          Pending (0)
        </Link>
        <Link 
          href="/evaluations?filter=submitted" 
          className="text-sm font-medium px-3 py-1 rounded-full"
        >
          Submitted (0)
        </Link>
        <Link 
          href="/evaluations?filter=approved" 
          className="text-sm font-medium px-3 py-1 rounded-full"
        >
          Approved (0)
        </Link>
        <Link 
          href="/evaluations?filter=rejected" 
          className="text-sm font-medium px-3 py-1 rounded-full"
        >
          Rejected (0)
        </Link>
      </div>
      
      <div className="rounded-md border">
        <div className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center space-y-3">
          <h3 className="text-lg font-medium">No evaluations available</h3>
          <p className="text-sm text-muted-foreground">
            Start by creating an evaluation for an employee.
          </p>
          <p className="text-sm text-muted-foreground">
            Make sure you have employees and job functions set up first.
          </p>
          <Link
            href="/evaluations/new"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 h-10 mt-4"
          >
            Create Evaluation
          </Link>
        </div>
      </div>
    </div>
  );
} 