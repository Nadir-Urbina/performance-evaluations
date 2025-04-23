import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Functions | Simple Evaluation",
  description: "Manage job functions for your organization",
};

export default function JobFunctionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 