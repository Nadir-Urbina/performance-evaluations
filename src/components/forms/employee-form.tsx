"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, collection, addDoc, updateDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { trackEmployeeActivity } from "@/lib/services/activity-service";

interface EmployeeFormProps {
  initialData?: {
    id?: string;
    fullName: string;
    email: string;
    phone?: string;
    role: string;
    supervisorEmail?: string;
  };
  isEditing?: boolean;
}

export default function EmployeeForm({ initialData, isEditing = false }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    role: initialData?.role || "",
    supervisorEmail: initialData?.supervisorEmail || "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "You must be logged in to perform this action",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if employee with email already exists
      const employeesRef = collection(db, "employees");
      const q = query(employeesRef, where("email", "==", formData.email), where("organizationId", "==", user.organizationId));
      const existingEmployees = await getDocs(q);
      
      if (!existingEmployees.empty && !isEditing) {
        toast({
          variant: "destructive",
          title: "Employee already exists",
          description: "An employee with this email already exists in your organization",
        });
        setIsLoading(false);
        return;
      }
      
      // Create employee data
      const employeeData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
        role: formData.role,
        supervisorEmail: formData.supervisorEmail || null,
        organizationId: user.organizationId,
        jobFunctionIds: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      if (isEditing && initialData?.id) {
        // Update existing employee
        const employeeRef = doc(db, "employees", initialData.id);
        await updateDoc(employeeRef, {
          ...employeeData,
          updatedAt: serverTimestamp(),
        });
        
        toast({
          variant: "success",
          title: "Employee updated",
          description: `${formData.fullName} has been updated successfully`,
        });
      } else {
        // Create new employee
        const docRef = await addDoc(collection(db, "employees"), employeeData);
        
        // Track the activity
        await trackEmployeeActivity({
          organizationId: user.organizationId,
          userId: user.id,
          userName: user.fullName,
          type: "employee_added",
          employeeId: docRef.id,
          employeeName: formData.fullName,
        });
        
        toast({
          variant: "success",
          title: "Employee added",
          description: `${formData.fullName} has been added to your organization`,
        });
      }
      
      // Redirect to employees list
      router.push("/employees");
      router.refresh();
    } catch (error) {
      console.error("Error saving employee:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save employee. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Employee" : "Add New Employee"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="fullName">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="role">
                Role <span className="text-red-500">*</span>
              </label>
              <input
                id="role"
                name="role"
                type="text"
                value={formData.role}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="supervisorEmail">
                Supervisor Email
              </label>
              <input
                id="supervisorEmail"
                name="supervisorEmail"
                type="email"
                value={formData.supervisorEmail}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-4 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEditing ? "Update Employee" : "Add Employee"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 