"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Timestamp } from "firebase/firestore";
import { useOrganization } from "@/hooks/use-organization";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { createSchedule } from "@/lib/firebase/schedules";
import { useJobFunctions } from "@/hooks/use-job-functions";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Schedule name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  startDate: z.date({
    required_error: "A start date is required.",
  }),
  endDate: z.date({
    required_error: "An end date is required.",
  }).refine(date => date > new Date(), {
    message: "End date must be in the future.",
  }),
  reminderFrequency: z.enum(["daily", "weekly", "custom"], {
    required_error: "Please select a reminder frequency.",
  }),
  jobFunctionIds: z.array(z.string()).min(1, {
    message: "At least one job function must be selected.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateScheduleForm() {
  const router = useRouter();
  const { organization } = useOrganization();
  const { jobFunctions, loading: loadingJobFunctions } = useJobFunctions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      reminderFrequency: "daily",
      jobFunctionIds: [],
    },
  });

  async function onSubmit(values: FormValues) {
    if (!organization) return;
    
    setIsSubmitting(true);
    
    try {
      const scheduleData = {
        ...values,
        organizationId: organization.id,
        startDate: Timestamp.fromDate(values.startDate),
        endDate: Timestamp.fromDate(values.endDate),
        status: "draft" as const,
        createdBy: organization.ownerId, // This should be the current user's ID
      };
      
      await createSchedule(scheduleData);
      
      toast.success("Schedule created", {
        description: "Your evaluation schedule has been created successfully."
      });
      
      router.push("/evaluations/schedules");
    } catch (error) {
      console.error("Error creating schedule:", error);
      toast.error("Error", {
        description: "Failed to create schedule. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Q2 2023 Performance Evaluations" {...field} />
                    </FormControl>
                    <FormDescription>
                      A name to identify this evaluation period.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reminderFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reminder Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reminder frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How often should evaluators be reminded.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Details about this evaluation cycle..." 
                      {...field} 
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Additional information about this evaluation schedule.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When evaluators can start completing evaluations.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Deadline for completing evaluations.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="jobFunctionIds"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Job Functions</FormLabel>
                    <FormDescription>
                      Select job functions to include in this evaluation schedule.
                    </FormDescription>
                  </div>
                  
                  {loadingJobFunctions ? (
                    <div className="flex items-center justify-center h-20">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : jobFunctions && jobFunctions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {jobFunctions.map((jobFunction) => (
                        <FormField
                          key={jobFunction.id}
                          control={form.control}
                          name="jobFunctionIds"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={jobFunction.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(jobFunction.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, jobFunction.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== jobFunction.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-medium">
                                    {jobFunction.name}
                                  </FormLabel>
                                </div>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">
                        No job functions found. Please create job functions first.
                      </p>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/evaluations/schedules")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || loadingJobFunctions}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Schedule
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 