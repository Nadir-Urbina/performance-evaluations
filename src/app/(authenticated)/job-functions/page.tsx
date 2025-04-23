"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface JobFunction {
  id: string;
  name: string;
  manager?: string;
  createdAt: any;
}

export default function JobFunctionsPage() {
  const [jobFunctions, setJobFunctions] = useState<JobFunction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchJobFunctions();
  }, [user]);

  const fetchJobFunctions = async () => {
    if (!user?.organizationId) return;

    try {
      setIsLoading(true);
      const jobFunctionsRef = collection(db, "jobFunctions");
      const q = query(jobFunctionsRef, where("organizationId", "==", user.organizationId));
      const querySnapshot = await getDocs(q);
      
      const jobFunctionsList: JobFunction[] = [];
      querySnapshot.forEach((doc) => {
        jobFunctionsList.push({
          id: doc.id,
          ...doc.data(),
        } as JobFunction);
      });
      
      // Sort by creation date (newest first)
      jobFunctionsList.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      
      setJobFunctions(jobFunctionsList);
    } catch (error) {
      console.error("Error fetching job functions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job function? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "jobFunctions", id));
      
      toast({
        title: "Job function deleted",
        description: "The job function has been successfully deleted.",
      });
      
      // Refresh the list
      fetchJobFunctions();
    } catch (error) {
      console.error("Error deleting job function:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete job function. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Job Functions</h1>
        <Button asChild>
          <Link href="/job-functions/new">
            Add Job Function
          </Link>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : jobFunctions.length === 0 ? (
        <div className="rounded-md border">
          <div className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center space-y-3">
            <h3 className="text-lg font-medium">No job functions defined yet</h3>
            <p className="text-sm text-muted-foreground">
              Get started by adding job functions for your organization.
            </p>
            <Button asChild className="mt-4">
              <Link href="/job-functions/new">
                Add Job Function
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Manager</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {jobFunctions.map((jobFunction) => (
                  <tr key={jobFunction.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">{jobFunction.name}</td>
                    <td className="p-4 align-middle">{jobFunction.manager || "—"}</td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/job-functions/${jobFunction.id}/edit`}>Edit</Link>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(jobFunction.id)}
                        >
                          Delete
                        </Button>
                      </div>
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