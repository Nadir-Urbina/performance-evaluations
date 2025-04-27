import Link from "next/link";
import { Metadata } from "next";
import { SchedulesList } from "./schedules-list";

export const metadata: Metadata = {
  title: "Evaluation Schedules | Simple Evaluation",
  description: "Manage evaluation schedules for your organization",
};

export default function EvaluationSchedulesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Evaluation Schedules</h1>
        <Link
          href="/evaluations/schedules/new"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2"
        >
          Create Schedule
        </Link>
      </div>
      
      <SchedulesList />
    </div>
  );
} 