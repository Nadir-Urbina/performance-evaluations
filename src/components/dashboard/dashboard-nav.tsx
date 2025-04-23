"use client";

import Link from "next/link";

export default function DashboardNav() {
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link
        href="/dashboard"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Dashboard
      </Link>
      <Link
        href="/evaluations"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Evaluations
      </Link>
      <Link
        href="/job-functions"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Job Functions
      </Link>
      <Link
        href="/questions"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Questions
      </Link>
      <Link
        href="/employees"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Employees
      </Link>
      <Link
        href="/settings"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Settings
      </Link>
    </nav>
  );
} 