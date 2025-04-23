import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Job Function | Simple Evaluation",
  description: "Add a new job function to your organization",
};

export default function NewJobFunctionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 