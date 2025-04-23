"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, collection, addDoc, updateDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface JobFunctionFormProps {
  initialData?: {
    id?: string;
    name: string;
    manager?: string;
  };
  isEditing?: boolean;
}

export default function JobFunctionForm({ initialData, isEditing = false }: JobFunctionFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    manager: initialData?.manager || "",
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
      // Check if job function with name already exists in this organization
      const jobFunctionsRef = collection(db, "jobFunctions");
      const q = query(
        jobFunctionsRef, 
        where("name", "==", formData.name), 
        where("organizationId", "==", user.organizationId)
      );
      const existingFunctions = await getDocs(q);
      
      // If editing, we need to check if there's another function with the same name
      // If creating, we just need to check if there's any function with the same name
      if (
        (!isEditing && !existingFunctions.empty) || 
        (isEditing && !existingFunctions.empty && existingFunctions.docs[0].id !== initialData?.id)
      ) {
        toast({
          variant: "destructive",
          title: "Job function already exists",
          description: "A job function with this name already exists in your organization",
        });
        setIsLoading(false);
        return;
      }
      
      // Create job function data
      const jobFunctionData = {
        name: formData.name,
        manager: formData.manager || null,
        organizationId: user.organizationId,
        updatedAt: serverTimestamp(),
      };
      
      if (isEditing && initialData?.id) {
        // Update existing job function
        const jobFunctionRef = doc(db, "jobFunctions", initialData.id);
        await updateDoc(jobFunctionRef, jobFunctionData);
        
        toast({
          title: "Job function updated",
          description: `"${formData.name}" has been updated successfully`,
        });
      } else {
        // Create new job function
        await addDoc(collection(db, "jobFunctions"), {
          ...jobFunctionData,
          createdAt: serverTimestamp(),
        });
        
        toast({
          title: "Job function added",
          description: `"${formData.name}" has been added to your organization`,
        });
      }
      
      // Redirect to job functions list
      router.push("/job-functions");
      router.refresh();
    } catch (error) {
      console.error("Error saving job function:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save job function. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="name">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            required
          />
          <p className="text-sm text-muted-foreground">
            A descriptive name for the job function (e.g., Software Engineer, Project Manager)
          </p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="manager">
            Manager
          </label>
          <input
            id="manager"
            name="manager"
            type="text"
            value={formData.manager}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <p className="text-sm text-muted-foreground">
            Optional: The typical manager title for this job function
          </p>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : isEditing ? "Update Job Function" : "Add Job Function"}
        </Button>
      </div>
    </form>
  );
} 