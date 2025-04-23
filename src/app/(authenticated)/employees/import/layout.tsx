import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Import Employees | Simple Evaluation",
  description: "Import employees from a CSV file",
};

export default function ImportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 