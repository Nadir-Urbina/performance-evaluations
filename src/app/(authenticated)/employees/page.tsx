"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";

interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  supervisorEmail?: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!user?.organizationId) return;

      try {
        setIsLoading(true);
        const employeesRef = collection(db, "employees");
        const q = query(employeesRef, where("organizationId", "==", user.organizationId));
        const querySnapshot = await getDocs(q);
        
        const employeesList: Employee[] = [];
        querySnapshot.forEach((doc) => {
          employeesList.push({
            id: doc.id,
            ...doc.data(),
          } as Employee);
        });
        
        setEmployees(employeesList);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/employees/import"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2"
          >
            Import Employees
          </Link>
          <Link
            href="/employees/new"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2"
          >
            Add Employee
          </Link>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : employees.length === 0 ? (
        <div className="rounded-md border">
          <div className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center space-y-3">
            <h3 className="text-lg font-medium">No employees added yet</h3>
            <p className="text-sm text-muted-foreground">
              Get started by adding employees individually or importing them from a CSV file.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Link
                href="/employees/new"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 h-10"
              >
                Add Employee
              </Link>
              <Link
                href="/employees/import"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 h-10"
              >
                Import from CSV
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Supervisor</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle">{employee.fullName}</td>
                    <td className="p-4 align-middle">{employee.email}</td>
                    <td className="p-4 align-middle">{employee.role}</td>
                    <td className="p-4 align-middle">{employee.supervisorEmail || "-"}</td>
                    <td className="p-4 align-middle text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/employees/${employee.id}`}>View</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 