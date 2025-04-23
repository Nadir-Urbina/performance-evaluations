import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Question | Simple Evaluation",
  description: "Edit an existing evaluation question",
};

export default function EditQuestionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 