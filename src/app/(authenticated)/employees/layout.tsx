import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employees | Simple Evaluation",
  description: "Manage your organization's employees",
};

export default function EmployeesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 