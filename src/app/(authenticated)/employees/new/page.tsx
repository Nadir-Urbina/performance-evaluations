import { Metadata } from "next";
import EmployeeForm from "@/components/forms/employee-form";

export const metadata: Metadata = {
  title: "Add Employee | Simple Evaluation",
  description: "Add a new employee to your organization",
};

export default function NewEmployeePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Add Employee</h1>
      </div>
      
      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Employee Information</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Enter the details of the new employee.
        </p>
        <EmployeeForm />
      </div>
    </div>
  );
} 