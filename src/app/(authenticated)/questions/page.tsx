"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: string;
  text: string;
  jobFunctionIds: string[];
  evaluationCriteria: {
    type: string;
    levels: Array<{
      name: string;
      percentage: number;
    }>;
  };
  rewardValue?: number;
  createdAt: any;
  jobFunctions?: {
    id: string;
    name: string;
  }[];
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [jobFunctions, setJobFunctions] = useState<{[key: string]: {name: string}}>({}); 
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user?.organizationId) return;

    try {
      setIsLoading(true);
      
      // Fetch job functions first
      const jobFunctionsRef = collection(db, "jobFunctions");
      const jobFunctionsQuery = query(jobFunctionsRef, where("organizationId", "==", user.organizationId));
      const jobFunctionsSnapshot = await getDocs(jobFunctionsQuery);
      
      const jobFunctionsMap: {[key: string]: {name: string}} = {};
      jobFunctionsSnapshot.forEach((doc) => {
        const data = doc.data();
        jobFunctionsMap[doc.id] = { name: data.name };
      });
      
      setJobFunctions(jobFunctionsMap);
      
      // Fetch questions
      const questionsRef = collection(db, "questions");
      const q = query(questionsRef, where("organizationId", "==", user.organizationId));
      const querySnapshot = await getDocs(q);
      
      const questionsList: Question[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Question, 'id' | 'jobFunctions'>;
        
        // Map job function IDs to actual job function data
        const jobFunctionsData = data.jobFunctionIds?.map(id => ({
          id,
          name: jobFunctionsMap[id]?.name || 'Unknown'
        })) || [];
        
        questionsList.push({
          id: doc.id,
          ...data,
          jobFunctions: jobFunctionsData
        });
      });
      
      // Sort by creation date (newest first)
      questionsList.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      
      setQuestions(questionsList);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "questions", id));
      
      toast({
        title: "Question deleted",
        description: "The question has been successfully deleted.",
      });
      
      // Refresh the list
      fetchData();
    } catch (error) {
      console.error("Error deleting question:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete question. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Questions</h1>
        <Button asChild>
          <Link href="/questions/new">
            Add Question
          </Link>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : questions.length === 0 ? (
        <div className="rounded-md border">
          <div className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center space-y-3">
            <h3 className="text-lg font-medium">No questions defined yet</h3>
            <p className="text-sm text-muted-foreground">
              Get started by adding evaluation questions for your job functions.
            </p>
            <Button asChild className="mt-4">
              <Link href="/questions/new">
                Add Question
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
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Question</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Job Functions</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Criteria Type</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {questions.map((question) => (
                  <tr key={question.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">
                      <div className="max-w-md truncate">{question.text}</div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-wrap gap-1">
                        {question.jobFunctions?.map(jf => (
                          <Badge key={jf.id} variant="outline">
                            {jf.name}
                          </Badge>
                        ))}
                        {!question.jobFunctions?.length && (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      {question.evaluationCriteria?.type || "Standard"}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/questions/${question.id}/edit`}>Edit</Link>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(question.id)}
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