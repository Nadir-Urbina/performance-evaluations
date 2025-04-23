"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, collection, addDoc, updateDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Default evaluation criteria levels
const DEFAULT_LEVELS = [
  { name: "Exceeds Expectations", percentage: 100 },
  { name: "Meets Expectations", percentage: 75 },
  { name: "Needs Improvement", percentage: 50 },
  { name: "Unsatisfactory", percentage: 0 }
];

interface JobFunction {
  id: string;
  name: string;
}

interface QuestionFormProps {
  initialData?: {
    id?: string;
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
  };
  isEditing?: boolean;
}

export default function QuestionForm({ initialData, isEditing = false }: QuestionFormProps) {
  const [formData, setFormData] = useState({
    text: initialData?.text || "",
    jobFunctionIds: initialData?.jobFunctionIds || [],
    evaluationCriteria: initialData?.evaluationCriteria || {
      type: "standard",
      levels: [...DEFAULT_LEVELS]
    },
    rewardValue: initialData?.rewardValue || 0
  });
  
  const [jobFunctions, setJobFunctions] = useState<JobFunction[]>([]);
  const [criteriaType, setCriteriaType] = useState(initialData?.evaluationCriteria?.type || "standard");
  const [levels, setLevels] = useState(initialData?.evaluationCriteria?.levels || [...DEFAULT_LEVELS]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingJobFunctions, setIsLoadingJobFunctions] = useState(true);
  
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch job functions for the organization
  useEffect(() => {
    const fetchJobFunctions = async () => {
      if (!user?.organizationId) return;
      
      try {
        setIsLoadingJobFunctions(true);
        const jobFunctionsRef = collection(db, "jobFunctions");
        const q = query(jobFunctionsRef, where("organizationId", "==", user.organizationId));
        const querySnapshot = await getDocs(q);
        
        const jobFunctionsList: JobFunction[] = [];
        querySnapshot.forEach((doc) => {
          jobFunctionsList.push({
            id: doc.id,
            name: doc.data().name
          });
        });
        
        // Sort by name
        jobFunctionsList.sort((a, b) => a.name.localeCompare(b.name));
        
        setJobFunctions(jobFunctionsList);
      } catch (error) {
        console.error("Error fetching job functions:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load job functions. Please refresh the page.",
        });
      } finally {
        setIsLoadingJobFunctions(false);
      }
    };
    
    fetchJobFunctions();
  }, [user, toast]);
  
  // Update the form data when criteria type changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      evaluationCriteria: {
        type: criteriaType,
        levels: [...levels]
      }
    }));
  }, [criteriaType, levels]);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, text: e.target.value }));
  };
  
  const handleJobFunctionChange = (id: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        jobFunctionIds: [...prev.jobFunctionIds, id]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        jobFunctionIds: prev.jobFunctionIds.filter(jobId => jobId !== id)
      }));
    }
  };
  
  const handleCriteriaTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCriteriaType(e.target.value);
  };
  
  const handleLevelChange = (index: number, field: 'name' | 'percentage', value: string) => {
    const newLevels = [...levels];
    if (field === 'name') {
      newLevels[index].name = value;
    } else {
      // Ensure percentage is a number between 0-100
      let percentage = parseInt(value, 10);
      if (isNaN(percentage)) percentage = 0;
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;
      newLevels[index].percentage = percentage;
    }
    setLevels(newLevels);
  };
  
  const handleAddLevel = () => {
    setLevels([...levels, { name: "", percentage: 0 }]);
  };
  
  const handleRemoveLevel = (index: number) => {
    if (levels.length <= 1) return; // Don't remove the last level
    const newLevels = [...levels];
    newLevels.splice(index, 1);
    setLevels(newLevels);
  };
  
  const handleRewardValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData(prev => ({
      ...prev,
      rewardValue: isNaN(value) ? 0 : value
    }));
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
    
    if (!formData.text.trim()) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Question text is required",
      });
      return;
    }
    
    if (formData.jobFunctionIds.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Please select at least one job function",
      });
      return;
    }
    
    // Validate that all levels have names and percentages
    const invalidLevel = levels.find(level => !level.name.trim());
    if (invalidLevel) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "All evaluation criteria levels must have names",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create question data
      const questionData = {
        text: formData.text.trim(),
        jobFunctionIds: formData.jobFunctionIds,
        evaluationCriteria: {
          type: criteriaType,
          levels: levels
        },
        rewardValue: formData.rewardValue,
        organizationId: user.organizationId,
        updatedAt: serverTimestamp(),
      };
      
      if (isEditing && initialData?.id) {
        // Update existing question
        const questionRef = doc(db, "questions", initialData.id);
        await updateDoc(questionRef, questionData);
        
        toast({
          title: "Question updated",
          description: "The evaluation question has been updated successfully",
        });
      } else {
        // Create new question
        await addDoc(collection(db, "questions"), {
          ...questionData,
          createdAt: serverTimestamp(),
        });
        
        toast({
          title: "Question added",
          description: "The evaluation question has been added successfully",
        });
      }
      
      // Redirect to questions list
      router.push("/questions");
      router.refresh();
    } catch (error) {
      console.error("Error saving question:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save question. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text" className="text-base">
            Question Text <span className="text-red-500">*</span>
          </Label>
          <textarea
            id="text"
            value={formData.text}
            onChange={handleTextChange}
            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Enter the evaluation question here..."
            required
          />
          <p className="text-sm text-muted-foreground">
            The question that will be asked during the evaluation.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label className="text-base">
            Job Functions <span className="text-red-500">*</span>
          </Label>
          
          {isLoadingJobFunctions ? (
            <div className="py-2">Loading job functions...</div>
          ) : jobFunctions.length === 0 ? (
            <div className="py-2 text-amber-600">
              No job functions found. Please create job functions before adding questions.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-2">
              {jobFunctions.map((jobFunction) => (
                <div key={jobFunction.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`job-function-${jobFunction.id}`} 
                    checked={formData.jobFunctionIds.includes(jobFunction.id)}
                    onCheckedChange={(checked) => handleJobFunctionChange(jobFunction.id, checked === true)}
                  />
                  <Label 
                    htmlFor={`job-function-${jobFunction.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {jobFunction.name}
                  </Label>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-2">
            <Label className="text-sm">Selected Job Functions:</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {formData.jobFunctionIds.length > 0 ? (
                formData.jobFunctionIds.map(id => {
                  const jf = jobFunctions.find(j => j.id === id);
                  return jf ? (
                    <Badge key={id} variant="secondary">
                      {jf.name}
                    </Badge>
                  ) : null;
                })
              ) : (
                <span className="text-sm text-muted-foreground">None selected</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="criteriaType" className="text-base">
              Evaluation Criteria Type
            </Label>
            <select
              id="criteriaType"
              value={criteriaType}
              onChange={handleCriteriaTypeChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
            >
              <option value="standard">Standard</option>
              <option value="smart">SMART</option>
              <option value="custom">Custom</option>
            </select>
            <p className="text-sm text-muted-foreground mt-1">
              The type of evaluation criteria to use for this question.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-base">Evaluation Levels</Label>
            <div className="space-y-3">
              {levels.map((level, index) => (
                <div key={index} className="flex flex-wrap gap-3 items-center">
                  <div className="grow">
                    <Label htmlFor={`level-name-${index}`} className="text-sm sr-only">
                      Level Name
                    </Label>
                    <input
                      id={`level-name-${index}`}
                      type="text"
                      value={level.name}
                      onChange={(e) => handleLevelChange(index, 'name', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Level name (e.g., Exceeds Expectations)"
                      required
                    />
                  </div>
                  <div className="w-32">
                    <Label htmlFor={`level-percentage-${index}`} className="text-sm sr-only">
                      Percentage
                    </Label>
                    <div className="relative">
                      <input
                        id={`level-percentage-${index}`}
                        type="number"
                        min="0"
                        max="100"
                        value={level.percentage}
                        onChange={(e) => handleLevelChange(index, 'percentage', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background pl-3 pr-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveLevel(index)}
                    disabled={levels.length <= 1}
                    className="min-w-[80px]"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddLevel}
              className="mt-2"
            >
              Add Level
            </Button>
          </div>
          
          <div className="space-y-2 pt-2">
            <Label htmlFor="rewardValue" className="text-base">
              Reward Value
            </Label>
            <div className="relative w-32">
              <input
                id="rewardValue"
                type="number"
                min="0"
                step="0.01"
                value={formData.rewardValue}
                onChange={handleRewardValueChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Optional reward value for this question.
            </p>
          </div>
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
          {isLoading ? "Saving..." : isEditing ? "Update Question" : "Add Question"}
        </Button>
      </div>
    </form>
  );
} 