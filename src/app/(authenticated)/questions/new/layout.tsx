import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Question | Simple Evaluation",
  description: "Add a new evaluation question to your organization",
};

export default function NewQuestionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 