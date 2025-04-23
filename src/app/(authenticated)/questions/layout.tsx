import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evaluation Questions | Simple Evaluation",
  description: "Manage evaluation questions for your organization",
};

export default function QuestionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 