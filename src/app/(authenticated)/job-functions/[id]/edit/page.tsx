"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import JobFunctionForm from "@/components/forms/job-function-form";
import { useAuth } from "@/providers/auth-provider";

export default function EditJobFunctionPage() {
  const [jobFunction, setJobFunction] = useState<{
    id: string;
    name: string;
    manager?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchJobFunction = async () => {
      if (!params.id || !user) return;
      
      try {
        setIsLoading(true);
        const jobFunctionRef = doc(db, "jobFunctions", params.id as string);
        const jobFunctionSnap = await getDoc(jobFunctionRef);
        
        if (jobFunctionSnap.exists()) {
          const data = jobFunctionSnap.data();
          
          // Verify this job function belongs to the user's organization
          if (data.organizationId !== user.organizationId) {
            throw new Error("Job function not found");
          }
          
          setJobFunction({
            id: jobFunctionSnap.id,
            name: data.name,
            manager: data.manager || undefined,
          });
        } else {
          throw new Error("Job function not found");
        }
      } catch (error) {
        console.error("Error fetching job function:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobFunction();
  }, [params.id, user]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!jobFunction) {
    return (
      <div className="rounded-md border p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Job Function Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The job function you are trying to edit does not exist or you don't have permission to view it.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit Job Function</h1>
      </div>
      
      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Job Function Details</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Update the details of this job function.
        </p>
        <JobFunctionForm initialData={jobFunction} isEditing />
      </div>
    </div>
  );
} 