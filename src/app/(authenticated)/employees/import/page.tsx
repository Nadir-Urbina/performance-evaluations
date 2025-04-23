import Link from "next/link";
import EmployeeImportForm from "@/components/forms/employee-import-form";
import { Button } from "@/components/ui/button";

export default function ImportEmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Import Employees</h1>
          <p className="text-muted-foreground">
            Upload a CSV file to import multiple employees at once
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline">
            <Link href="/templates/employee-import-template.csv">
              Download Template
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="rounded-lg border p-6">
          <EmployeeImportForm />
        </div>
      </div>
    </div>
  );
} 