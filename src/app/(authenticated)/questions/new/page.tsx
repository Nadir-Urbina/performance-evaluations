import QuestionForm from "@/components/forms/question-form";

export default function NewQuestionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Add Question</h1>
      </div>
      
      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Question Details</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Create evaluation questions that can be linked to specific job functions.
        </p>
        <QuestionForm />
      </div>
    </div>
  );
} 