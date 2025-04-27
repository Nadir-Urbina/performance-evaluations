import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Simple Evaluation",
  description: "Your dashboard for performance evaluations",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 