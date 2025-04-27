"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, CalendarRange, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getScheduleById, updateScheduleStatus } from "@/lib/firebase/schedules";
import { EvaluationSchedule } from "@/types/database";
import { useJobFunctions } from "@/hooks/use-job-functions";

export default function ScheduleDetailsPage({ params }) {
  const [schedule, setSchedule] = useState<EvaluationSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const { jobFunctions } = useJobFunctions();
  const router = useRouter();

  useEffect(() => {
    async function fetchSchedule() {
      setLoading(true);
      try {
        const scheduleData = await getScheduleById(params.id);
        setSchedule(scheduleData);
      } catch (error) {
        console.error("Error fetching schedule:", error);
        toast.error("Error", {
          description: "Failed to load schedule details. Please try again."
        });
      } finally {
        setLoading(false);
      }
    }

    fetchSchedule();
  }, [params.id]);

  const getStatusBadge = (status: EvaluationSchedule['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">Active</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'completed':
        return <Badge className="bg-blue-600">Completed</Badge>;
      case 'canceled':
        return <Badge variant="destructive">Canceled</Badge>;
      default:
        return null;
    }
  };

  const handleActivate = async () => {
    if (!schedule) return;
    
    try {
      await updateScheduleStatus(schedule.id, 'active');
      setSchedule({
        ...schedule,
        status: 'active',
      });
      toast.success("Schedule activated", {
        description: "The evaluation schedule is now active."
      });
    } catch (error) {
      console.error("Error activating schedule:", error);
      toast.error("Error", {
        description: "Failed to activate schedule. Please try again."
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!schedule) {
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
        
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <h2 className="text-xl font-semibold">Schedule not found</h2>
          <p className="text-muted-foreground mt-2">
            The requested evaluation schedule could not be found.
          </p>
          <Button 
            className="mt-4" 
            onClick={() => router.push("/evaluations/schedules")}
          >
            Return to Schedules
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (date: any) => {
    if (!date) return "N/A";
    return format(date.toDate(), "MMMM d, yyyy");
  };
  
  const getJobFunctionNames = () => {
    if (!jobFunctions) return "Loading...";
    
    return schedule.jobFunctionIds.map(id => {
      const jobFunction = jobFunctions.find(jf => jf.id === id);
      return jobFunction ? jobFunction.name : "Unknown job function";
    }).join(", ");
  };

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
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <CalendarRange className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{schedule.name}</h1>
            <p className="text-muted-foreground">
              {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(schedule.status)}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => router.push(`/evaluations/schedules/${schedule.id}/edit`)}
            >
              Edit
            </Button>
            {schedule.status === 'draft' && (
              <Button onClick={handleActivate}>
                Activate
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Schedule Details</CardTitle>
          <CardDescription>
            Information about this evaluation schedule
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">Description</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {schedule.description || "No description provided."}
            </p>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium">Start Date</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatDate(schedule.startDate)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium">End Date</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatDate(schedule.endDate)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Status</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Reminder Frequency</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {schedule.reminderFrequency.charAt(0).toUpperCase() + schedule.reminderFrequency.slice(1)}
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium">Job Functions</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {getJobFunctionNames()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 