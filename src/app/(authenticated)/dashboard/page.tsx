import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Simple Evaluation",
  description: "Your dashboard for performance evaluations",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Summary Cards */}
        <DashboardCard
          title="Pending Evaluations"
          value="0"
          description="Evaluations waiting for your input"
          link="/evaluations"
          linkText="View evaluations"
        />
        <DashboardCard
          title="Employees"
          value="0"
          description="Total employees in your organization"
          link="/employees"
          linkText="Manage employees"
        />
        <DashboardCard
          title="Job Functions"
          value="0"
          description="Defined job functions"
          link="/job-functions"
          linkText="Manage job functions"
        />
        <DashboardCard
          title="Questions"
          value="0"
          description="Evaluation questions defined"
          link="/questions"
          linkText="Manage questions"
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="text-sm text-muted-foreground">
            No recent activity to display.
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
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
        </div>
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
  value: string;
  description: string;
  link: string;
  linkText: string;
}) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="p-6 flex flex-col h-full space-y-2">
        <h3 className="font-medium">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
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
      <div className="rounded-lg border p-3 hover:bg-accent transition-colors">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
} 