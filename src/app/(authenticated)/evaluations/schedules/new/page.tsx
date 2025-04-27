import { Metadata } from "next";
import Link from "next/link";
import { CalendarRange, ChevronLeft } from "lucide-react";
import { CreateScheduleForm } from "./create-schedule-form";

export const metadata: Metadata = {
  title: "Create Evaluation Schedule | Simple Evaluation",
  description: "Create a new evaluation schedule for your organization",
};

export default function CreateEvaluationSchedulePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link 
          href="/evaluations/schedules" 
          className="inline-flex items-center justify-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to schedules
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <CalendarRange className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Create Evaluation Schedule</h1>
      </div>
      
      <div className="pt-4">
        <CreateScheduleForm />
      </div>
    </div>
  );
} 