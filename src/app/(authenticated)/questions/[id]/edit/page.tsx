"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import QuestionForm from "@/components/forms/question-form";
import { useAuth } from "@/providers/auth-provider";

export default function EditQuestionPage() {
  const [question, setQuestion] = useState<{
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
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!params.id || !user) return;
      
      try {
        setIsLoading(true);
        const questionRef = doc(db, "questions", params.id as string);
        const questionSnap = await getDoc(questionRef);
        
        if (questionSnap.exists()) {
          const data = questionSnap.data();
          
          // Verify this question belongs to the user's organization
          if (data.organizationId !== user.organizationId) {
            throw new Error("Question not found");
          }
          
          setQuestion({
            id: questionSnap.id,
            text: data.text,
            jobFunctionIds: data.jobFunctionIds || [],
            evaluationCriteria: data.evaluationCriteria || {
              type: "standard",
              levels: [
                { name: "Exceeds Expectations", percentage: 100 },
                { name: "Meets Expectations", percentage: 75 },
                { name: "Needs Improvement", percentage: 50 },
                { name: "Unsatisfactory", percentage: 0 }
              ]
            },
            rewardValue: data.rewardValue
          });
        } else {
          throw new Error("Question not found");
        }
      } catch (error) {
        console.error("Error fetching question:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuestion();
  }, [params.id, user]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!question) {
    return (
      <div className="rounded-md border p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Question Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The question you are trying to edit does not exist or you don't have permission to view it.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit Question</h1>
      </div>
      
      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Question Details</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Update the details of this evaluation question.
        </p>
        <QuestionForm initialData={question} isEditing />
      </div>
    </div>
  );
} 