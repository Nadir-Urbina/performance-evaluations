"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/providers/auth-provider";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCounts {
  pendingEvaluations: number;
  employees: number;
  jobFunctions: number;
  questions: number;
}

interface ActivityEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: Date;
  link?: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<DashboardCounts>({
    pendingEvaluations: 0,
    employees: 0,
    jobFunctions: 0,
    questions: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState<string | null>(null);

  // Fetch dashboard counts
  useEffect(() => {
    const fetchCounts = async () => {
      if (!user?.organizationId) return;
      
      try {
        setIsLoading(true);
        const orgId = user.organizationId;

        // Fetch employees count
        const employeesRef = collection(db, "employees");
        const employeesQuery = query(employeesRef, where("organizationId", "==", orgId));
        const employeesSnapshot = await getDocs(employeesQuery);
        const employeesCount = employeesSnapshot.size;
        
        // Fetch job functions count
        const jobFunctionsRef = collection(db, "jobFunctions");
        const jobFunctionsQuery = query(jobFunctionsRef, where("organizationId", "==", orgId));
        const jobFunctionsSnapshot = await getDocs(jobFunctionsQuery);
        const jobFunctionsCount = jobFunctionsSnapshot.size;

        // Fetch questions count
        const questionsRef = collection(db, "questions");
        const questionsQuery = query(questionsRef, where("organizationId", "==", orgId));
        const questionsSnapshot = await getDocs(questionsQuery);
        const questionsCount = questionsSnapshot.size;
        
        // Fetch pending evaluations count
        const evaluationsRef = collection(db, "evaluations");
        const evaluationsQuery = query(
          evaluationsRef, 
          where("organizationId", "==", orgId),
          where("status", "in", ["draft", "pending"]),
        );
        const evaluationsSnapshot = await getDocs(evaluationsQuery);
        const pendingEvaluationsCount = evaluationsSnapshot.size;

        setCounts({
          pendingEvaluations: pendingEvaluationsCount,
          employees: employeesCount,
          jobFunctions: jobFunctionsCount,
          questions: questionsCount
        });
      } catch (error) {
        console.error("Error fetching dashboard counts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, [user?.organizationId]);

  // Fetch activity events
  useEffect(() => {
    const fetchActivityEvents = async () => {
      if (!user?.organizationId) return;
      
      try {
        setActivityLoading(true);
        setActivityError(null);
        const orgId = user.organizationId;

        // Try to fetch from the activities collection
        try {
          const activitiesRef = collection(db, "activities");
          const activitiesQuery = query(
            activitiesRef, 
            where("organizationId", "==", orgId),
            orderBy("timestamp", "desc"),
            limit(10)
          );
          
          const activitiesSnapshot = await getDocs(activitiesQuery);
          
          if (!activitiesSnapshot.empty) {
            const activityList: ActivityEvent[] = [];
            activitiesSnapshot.forEach(doc => {
              const data = doc.data();
              activityList.push({
                id: doc.id,
                type: data.type,
                title: data.title,
                description: data.description,
                timestamp: data.timestamp.toDate(),
                link: data.link
              });
            });
            setActivities(activityList);
            setActivityLoading(false);
            return; // Exit early if activities are found
          }
        } catch (error) {
          console.error("Error accessing activities collection:", error);
          // Continue to fallback - don't return
        }

        // Fallback: Build activity list from other collections
        const allActivities: ActivityEvent[] = [];
        
        // Try to fetch recent evaluations as activity
        try {
          const recentEvaluationsRef = collection(db, "evaluations");
          const recentEvaluationsQuery = query(
            recentEvaluationsRef,
            where("organizationId", "==", orgId),
            orderBy("createdAt", "desc"),
            limit(5)
          );
          
          const recentEvaluationsSnapshot = await getDocs(recentEvaluationsQuery);
          recentEvaluationsSnapshot.forEach(doc => {
            const data = doc.data();
            allActivities.push({
              id: doc.id,
              type: "evaluation",
              title: "Evaluation Created",
              description: `Evaluation for ${data.employeeName || "an employee"} was created`,
              timestamp: data.createdAt?.toDate() || new Date(),
              link: `/evaluations/${doc.id}`
            });
          });
        } catch (error) {
          console.error("Error fetching evaluations for activity:", error);
        }
        
        // Fetch recent employee additions
        try {
          const recentEmployeesRef = collection(db, "employees");
          const recentEmployeesQuery = query(
            recentEmployeesRef,
            where("organizationId", "==", orgId),
            orderBy("createdAt", "desc"),
            limit(3)
          );
          
          const recentEmployeesSnapshot = await getDocs(recentEmployeesQuery);
          recentEmployeesSnapshot.forEach(doc => {
            const data = doc.data();
            allActivities.push({
              id: doc.id,
              type: "employee",
              title: "Employee Added",
              description: `${data.fullName} was added as a ${data.role}`,
              timestamp: data.createdAt?.toDate() || new Date(),
              link: `/employees`
            });
          });
        } catch (error) {
          console.error("Error fetching employees for activity:", error);
        }
        
        // Sort all activities by timestamp
        allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setActivities(allActivities);
      } catch (error) {
        console.error("Error fetching activity events:", error);
        setActivityError("Unable to load recent activity. Please try again later.");
      } finally {
        setActivityLoading(false);
      }
    };

    fetchActivityEvents();
  }, [user?.organizationId]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Summary Cards */}
        <DashboardCard
          title="Pending Evaluations"
          value={isLoading ? <Skeleton className="h-10 w-12" /> : counts.pendingEvaluations.toString()}
          description="Evaluations waiting for your input"
          link="/evaluations"
          linkText="View evaluations"
        />
        <DashboardCard
          title="Employees"
          value={isLoading ? <Skeleton className="h-10 w-12" /> : counts.employees.toString()}
          description="Total employees in your organization"
          link="/employees"
          linkText="Manage employees"
        />
        <DashboardCard
          title="Job Functions"
          value={isLoading ? <Skeleton className="h-10 w-12" /> : counts.jobFunctions.toString()}
          description="Defined job functions"
          link="/job-functions"
          linkText="Manage job functions"
        />
        <DashboardCard
          title="Questions"
          value={isLoading ? <Skeleton className="h-10 w-12" /> : counts.questions.toString()}
          description="Evaluation questions defined"
          link="/questions"
          linkText="Manage questions"
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : activityError ? (
              <div className="text-sm text-muted-foreground py-6 text-center">
                {activityError}
              </div>
            ) : activities.length === 0 ? (
              <div className="text-sm text-muted-foreground py-6 text-center">
                No recent activity to display.
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <ActivityItem 
                    key={activity.id}
                    activity={activity}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <QuickAction
                title="Create evaluation"
                description="Start a new employee evaluation"
                link="/evaluations/new"
              />
              <QuickAction
                title="Import employees"
                description="Upload a CSV file with employee data"
                link="/employees/import"
              />
              <QuickAction
                title="Add job function"
                description="Define a new job function for evaluations"
                link="/job-functions/new"
              />
              <QuickAction
                title="Create questions"
                description="Add evaluation questions"
                link="/questions/new"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  description,
  link,
  linkText,
}: {
  title: string;
  value: string | React.ReactNode;
  description: string;
  link: string;
  linkText: string;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col h-full space-y-2">
          <h3 className="font-medium text-muted-foreground">{title}</h3>
          <div className="text-3xl font-bold">
            {value}
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
          <div className="mt-auto pt-4">
            <Link
              href={link}
              className="text-sm text-primary hover:underline"
            >
              {linkText}
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ activity }: { activity: ActivityEvent }) {
  return (
    <div className="border rounded-md p-3 hover:bg-accent/50 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-sm">{activity.title}</h4>
          <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
        </span>
      </div>
      {activity.link && (
        <Link 
          href={activity.link} 
          className="text-xs text-primary hover:underline mt-2 inline-block"
        >
          View details
        </Link>
      )}
    </div>
  );
}

function QuickAction({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link: string;
}) {
  return (
    <Link href={link} className="block">
      <div className="rounded-md border p-3 hover:bg-accent/50 transition-colors">
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </Link>
  );
} 