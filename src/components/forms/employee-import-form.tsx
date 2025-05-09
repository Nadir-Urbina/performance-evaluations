"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trackActivity } from "@/lib/services/activity-service";
import Papa from "papaparse";

interface CSVEmployee {
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  supervisorEmail?: string;
}

export default function EmployeeImportForm() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<CSVEmployee[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [uploadStep, setUploadStep] = useState<"upload" | "preview" | "complete">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  };
  
  const parseCSV = (file: File) => {
    setIsUploading(true);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Type check and validate required fields
        const validData: CSVEmployee[] = [];
        const errors: string[] = [];
        
        results.data.forEach((row: any, index) => {
          if (!row.fullName) {
            errors.push(`Row ${index + 1}: Missing required field 'fullName'`);
            return;
          }
          
          if (!row.email) {
            errors.push(`Row ${index + 1}: Missing required field 'email'`);
            return;
          }
          
          if (!row.role) {
            errors.push(`Row ${index + 1}: Missing required field 'role'`);
            return;
          }
          
          // Add validated employee
          validData.push({
            fullName: row.fullName,
            email: row.email,
            phone: row.phone || undefined,
            role: row.role,
            supervisorEmail: row.supervisorEmail || undefined,
          });
        });
        
        if (errors.length > 0) {
          toast({
            variant: "destructive",
            title: "CSV Validation Error",
            description: `${errors.length} error(s) found in CSV file. Please fix and try again.`,
          });
          console.error("CSV validation errors:", errors);
          setFile(null);
          setIsUploading(false);
          
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          
          return;
        }
        
        setParsedData(validData);
        setUploadStep("preview");
        setIsUploading(false);
      },
      error: (error) => {
        console.error("CSV Parse Error:", error);
        toast({
          variant: "destructive",
          title: "CSV Parse Error",
          description: "Failed to parse CSV file. Please check the format and try again.",
        });
        setFile(null);
        setIsUploading(false);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    });
  };
  
  const handleImport = async () => {
    if (!user || parsedData.length === 0) {
      return;
    }
    
    setIsImporting(true);
    
    try {
      // Check for existing employees
      const employeesRef = collection(db, "employees");
      const emails = parsedData.map(emp => emp.email);
      
      // We'll need to check in batches if there are many emails
      const existingEmails: string[] = [];
      
      // Check in batches of 10 (Firestore limitation for 'in' queries)
      for (let i = 0; i < emails.length; i += 10) {
        const batch = emails.slice(i, i + 10);
        const q = query(
          employeesRef, 
          where("email", "in", batch),
          where("organizationId", "==", user.organizationId)
        );
        
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
          const data = doc.data();
          existingEmails.push(data.email);
        });
      }
      
      // Filter out existing employees
      const newEmployees = parsedData.filter(emp => !existingEmails.includes(emp.email));
      
      // Create records for new employees
      const importPromises = newEmployees.map(async (emp) => {
        return addDoc(collection(db, "employees"), {
          fullName: emp.fullName,
          email: emp.email,
          phone: emp.phone || null,
          role: emp.role,
          supervisorEmail: emp.supervisorEmail || null,
          organizationId: user.organizationId,
          jobFunctionIds: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
      
      // Wait for all employees to be created
      const addedEmployees = await Promise.all(importPromises);
      
      // Track the import activity
      if (newEmployees.length > 0) {
        await trackActivity({
          organizationId: user.organizationId,
          userId: user.id,
          userName: user.fullName,
          type: "employee_added",
          title: "Employees Imported",
          description: `${newEmployees.length} employees were imported from CSV`,
          link: "/employees",
          metadata: {
            importCount: newEmployees.length,
            skippedCount: existingEmails.length
          }
        });
      }
      
      // Show results to user
      toast({
        variant: "success",
        title: "Import Complete",
        description: `Imported ${newEmployees.length} employees. ${existingEmails.length} employees were skipped (already exist).`,
      });
      
      setUploadStep("complete");
      
      // Redirect after a short delay to allow user to see the result
      setTimeout(() => {
        router.push("/employees");
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error("Import error:", error);
      toast({
        variant: "destructive",
        title: "Import Error",
        description: "Failed to import employees. Please try again.",
      });
    } finally {
      setIsImporting(false);
    }
  };
  
  const resetForm = () => {
    setFile(null);
    setParsedData([]);
    setUploadStep("upload");
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle>Import Employees from CSV</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {uploadStep === "upload" && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-12 bg-muted/20">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label 
                htmlFor="csv-upload"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 h-12 cursor-pointer"
              >
                {isUploading ? "Processing..." : "Select CSV File"}
              </label>
              <p className="text-sm text-muted-foreground mt-4">
                {file ? file.name : "No file selected"}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                File must be a CSV with headers for fullName, email, role, and optional phone and supervisorEmail
              </p>
            </div>
          </div>
        )}
        
        {uploadStep === "preview" && parsedData.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Preview ({parsedData.length} employees)</h3>
            <div className="border rounded-md overflow-auto max-h-[400px] shadow-sm">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Supervisor</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {parsedData.slice(0, 10).map((emp, index) => (
                    <tr key={index} className="hover:bg-muted/20">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{emp.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{emp.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{emp.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{emp.phone || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{emp.supervisorEmail || "-"}</td>
                    </tr>
                  ))}
                  {parsedData.length > 10 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-sm text-muted-foreground text-center">
                        And {parsedData.length - 10} more employees...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={isImporting}>
                {isImporting ? "Importing..." : `Import ${parsedData.length} Employees`}
              </Button>
            </div>
          </div>
        )}
        
        {uploadStep === "complete" && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Import Complete!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Redirecting to employees list...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 