import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Job Function | Simple Evaluation",
  description: "Edit an existing job function in your organization",
};

export default function EditJobFunctionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 