import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type ActivityType = 
  | "evaluation_created" 
  | "evaluation_submitted" 
  | "evaluation_approved" 
  | "evaluation_rejected" 
  | "employee_added" 
  | "job_function_added" 
  | "question_added";

interface ActivityData {
  organizationId: string;
  userId: string;
  userName?: string;
  type: ActivityType;
  title: string;
  description: string;
  link?: string;
  entityId?: string; // ID of related entity (evaluation, employee, etc.)
  metadata?: Record<string, any>; // Any additional data
}

/**
 * Create a new activity event in the activities collection
 */
export async function trackActivity(data: ActivityData): Promise<string | null> {
  try {
    const activityData = {
      ...data,
      timestamp: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, "activities"), activityData);
    return docRef.id;
  } catch (error) {
    console.error("Error tracking activity:", error);
    return null;
  }
}

/**
 * Helper for tracking evaluation-related activities
 */
export async function trackEvaluationActivity({
  organizationId,
  userId,
  userName,
  type,
  evaluationId,
  employeeName,
  status,
}: {
  organizationId: string;
  userId: string;
  userName?: string;
  type: "evaluation_created" | "evaluation_submitted" | "evaluation_approved" | "evaluation_rejected";
  evaluationId: string;
  employeeName: string;
  status?: string;
}): Promise<string | null> {
  let title = "";
  let description = "";

  switch (type) {
    case "evaluation_created":
      title = "Evaluation Created";
      description = `New evaluation for ${employeeName} was created`;
      break;
    case "evaluation_submitted":
      title = "Evaluation Submitted";
      description = `Evaluation for ${employeeName} was submitted for approval`;
      break;
    case "evaluation_approved":
      title = "Evaluation Approved";
      description = `Evaluation for ${employeeName} was approved`;
      break;
    case "evaluation_rejected":
      title = "Evaluation Rejected";
      description = `Evaluation for ${employeeName} was rejected`;
      break;
  }

  return trackActivity({
    organizationId,
    userId,
    userName,
    type,
    title,
    description,
    link: `/evaluations/${evaluationId}`,
    entityId: evaluationId,
    metadata: { employeeName, status },
  });
}

/**
 * Helper for tracking employee-related activities
 */
export async function trackEmployeeActivity({
  organizationId,
  userId,
  userName,
  type,
  employeeId,
  employeeName,
}: {
  organizationId: string;
  userId: string;
  userName?: string;
  type: "employee_added";
  employeeId: string;
  employeeName: string;
}): Promise<string | null> {
  return trackActivity({
    organizationId,
    userId,
    userName,
    type,
    title: "Employee Added",
    description: `${employeeName} was added to the organization`,
    link: `/employees`,
    entityId: employeeId,
    metadata: { employeeName },
  });
}

/**
 * Helper for tracking job function-related activities
 */
export async function trackJobFunctionActivity({
  organizationId,
  userId,
  userName,
  type,
  jobFunctionId,
  jobFunctionName,
}: {
  organizationId: string;
  userId: string;
  userName?: string;
  type: "job_function_added";
  jobFunctionId: string;
  jobFunctionName: string;
}): Promise<string | null> {
  return trackActivity({
    organizationId,
    userId,
    userName,
    type,
    title: "Job Function Added",
    description: `New job function "${jobFunctionName}" was created`,
    link: `/job-functions`,
    entityId: jobFunctionId,
    metadata: { jobFunctionName },
  });
}

/**
 * Helper for tracking question-related activities
 */
export async function trackQuestionActivity({
  organizationId,
  userId,
  userName,
  type,
  questionId,
  questionText,
}: {
  organizationId: string;
  userId: string;
  userName?: string;
  type: "question_added";
  questionId: string;
  questionText: string;
}): Promise<string | null> {
  return trackActivity({
    organizationId,
    userId,
    userName,
    type,
    title: "Evaluation Question Added",
    description: `New evaluation question was created: "${questionText.length > 50 ? questionText.substring(0, 50) + '...' : questionText}"`,
    link: `/questions`,
    entityId: questionId,
    metadata: { questionText },
  });
} 