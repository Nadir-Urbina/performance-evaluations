import { useEffect, useState } from "react";
import { useOrganization } from "./use-organization";
import { EvaluationSchedule } from "@/types/database";
import { getSchedules, updateScheduleStatus, deleteSchedule } from "@/lib/firebase/schedules";
import { toast } from "sonner";

type ScheduleFilter = 'active' | 'draft' | 'completed' | 'canceled';

export function useSchedules(filter?: ScheduleFilter) {
  const [schedules, setSchedules] = useState<EvaluationSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { organization } = useOrganization();

  useEffect(() => {
    async function fetchSchedules() {
      if (!organization) return;
      
      setLoading(true);
      try {
        const data = await getSchedules(organization.id, filter);
        setSchedules(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching schedules:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch schedules"));
        toast.error("Error", {
          description: "Failed to load evaluation schedules."
        });
      } finally {
        setLoading(false);
      }
    }

    fetchSchedules();
  }, [organization, filter]);

  const updateStatus = async (scheduleId: string, status: EvaluationSchedule['status']) => {
    try {
      await updateScheduleStatus(scheduleId, status);
      
      // Update local state
      setSchedules(prev => 
        prev.map(schedule => 
          schedule.id === scheduleId 
            ? { ...schedule, status } 
            : schedule
        )
      );
      
      toast.success("Status updated", {
        description: `Schedule status changed to ${status}.`
      });
      
      return true;
    } catch (err) {
      console.error("Error updating schedule status:", err);
      toast.error("Error", {
        description: "Failed to update schedule status."
      });
      return false;
    }
  };

  const removeSchedule = async (scheduleId: string) => {
    try {
      await deleteSchedule(scheduleId);
      
      // Update local state
      setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
      
      toast.success("Schedule deleted", {
        description: "The evaluation schedule has been deleted."
      });
      
      return true;
    } catch (err) {
      console.error("Error deleting schedule:", err);
      toast.error("Error", {
        description: "Failed to delete schedule."
      });
      return false;
    }
  };

  // Group schedules by status
  const scheduleCounts = {
    active: schedules.filter(s => s.status === 'active').length,
    draft: schedules.filter(s => s.status === 'draft').length,
    completed: schedules.filter(s => s.status === 'completed').length,
    canceled: schedules.filter(s => s.status === 'canceled').length,
  };

  return { 
    schedules, 
    loading, 
    error, 
    updateStatus,
    removeSchedule,
    scheduleCounts
  };
} 