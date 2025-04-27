"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CalendarClock, MoreHorizontal, CalendarRange } from "lucide-react";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

import { useSchedules } from "@/hooks/use-schedules";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { EvaluationSchedule } from "@/types/database";

export function SchedulesList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filterParam = searchParams.get("filter");
  const filter = filterParam as 'active' | 'draft' | 'completed' | 'canceled' | undefined;
  
  const { schedules, loading, updateStatus, removeSchedule, scheduleCounts } = useSchedules(filter);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);

  const handleChangeStatus = async (scheduleId: string, status: EvaluationSchedule['status']) => {
    await updateStatus(scheduleId, status);
  };

  const handleDelete = async () => {
    if (scheduleToDelete) {
      await removeSchedule(scheduleToDelete);
      setScheduleToDelete(null);
    }
  };

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

  const formatDate = (timestamp: Timestamp) => {
    return format(timestamp.toDate(), "MMM d, yyyy");
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/evaluations/schedules" 
          className={`text-sm font-medium px-3 py-1 rounded-full ${!filter ? 'bg-primary/10 text-primary' : ''}`}
        >
          All ({scheduleCounts.active + scheduleCounts.draft + scheduleCounts.completed + scheduleCounts.canceled})
        </Link>
        <Link 
          href="/evaluations/schedules?filter=active" 
          className={`text-sm font-medium px-3 py-1 rounded-full ${filter === 'active' ? 'bg-primary/10 text-primary' : ''}`}
        >
          Active ({scheduleCounts.active})
        </Link>
        <Link 
          href="/evaluations/schedules?filter=draft" 
          className={`text-sm font-medium px-3 py-1 rounded-full ${filter === 'draft' ? 'bg-primary/10 text-primary' : ''}`}
        >
          Draft ({scheduleCounts.draft})
        </Link>
        <Link 
          href="/evaluations/schedules?filter=completed" 
          className={`text-sm font-medium px-3 py-1 rounded-full ${filter === 'completed' ? 'bg-primary/10 text-primary' : ''}`}
        >
          Completed ({scheduleCounts.completed})
        </Link>
        <Link 
          href="/evaluations/schedules?filter=canceled" 
          className={`text-sm font-medium px-3 py-1 rounded-full ${filter === 'canceled' ? 'bg-primary/10 text-primary' : ''}`}
        >
          Canceled ({scheduleCounts.canceled})
        </Link>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-5 w-2/3 mb-2" />
                <Skeleton className="h-4 w-4/5" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : schedules.length === 0 ? (
        <div className="rounded-md border">
          <div className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CalendarClock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium">No evaluation schedules available</h3>
            <p className="text-sm text-muted-foreground">
              Create an evaluation schedule to define when performance evaluations should be completed.
            </p>
            <p className="text-sm text-muted-foreground">
              Schedules help you organize evaluation periods and set deadlines for your team.
            </p>
            <Link
              href="/evaluations/schedules/new"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 h-10 mt-4"
            >
              Create Schedule
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((schedule) => (
            <Card key={schedule.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <CalendarRange className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{schedule.name}</CardTitle>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => router.push(`/evaluations/schedules/${schedule.id}`)}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => router.push(`/evaluations/schedules/${schedule.id}/edit`)}
                      >
                        Edit Schedule
                      </DropdownMenuItem>
                      
                      {schedule.status === 'draft' && (
                        <DropdownMenuItem 
                          onClick={() => handleChangeStatus(schedule.id, 'active')}
                        >
                          Activate Schedule
                        </DropdownMenuItem>
                      )}
                      
                      {schedule.status === 'active' && (
                        <DropdownMenuItem 
                          onClick={() => handleChangeStatus(schedule.id, 'completed')}
                        >
                          Mark as Completed
                        </DropdownMenuItem>
                      )}
                      
                      {(schedule.status === 'draft' || schedule.status === 'active') && (
                        <DropdownMenuItem 
                          onClick={() => handleChangeStatus(schedule.id, 'canceled')}
                        >
                          Cancel Schedule
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => setScheduleToDelete(schedule.id)}
                      >
                        Delete Schedule
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <CardDescription>
                    {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
                  </CardDescription>
                  {getStatusBadge(schedule.status)}
                </div>
                <p className="text-sm line-clamp-2 text-muted-foreground">
                  {schedule.description || "No description provided."}
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => router.push(`/evaluations/schedules/${schedule.id}`)}
                >
                  View Schedule
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <AlertDialog open={!!scheduleToDelete} onOpenChange={(open) => !open && setScheduleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this evaluation schedule and associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 