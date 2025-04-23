import { Timestamp } from 'firebase/firestore';

// User model (App Users with Login)
export interface User {
  id: string;                // Firebase Auth UID
  email: string;             // Login email
  fullName: string;          // User's name
  organizationId: string;    // Reference to organization
  role: 'admin' | 'evaluator' | 'approver'; // App roles
  isActive: boolean;         // Account status
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
}

// Employee model (Subjects of Evaluation)
export interface Employee {
  id: string;                // Generated ID (not auth ID)
  fullName: string;          // Employee name
  email?: string;            // Optional email (for notifications)
  phone?: string;            // Optional phone
  role: string;
  supervisorId?: string;     // Reference to their supervisor (employee ID)
  organizationId: string;    // Reference to organization
  jobFunctionIds: string[];  // References to job functions this applies to
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Link between Users and Employees
export interface UserEmployeeLink {
  id: string;
  userId: string;            // Reference to users collection
  employeeId: string;        // Reference to employees collection
  organizationId: string;    // Reference to organization
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Organization model
export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  trialEndsAt: Date;
  isActive: boolean;
  seats: number;
  usedSeats: number;
  subscriptionId?: string;
  subscriptionStatus?: "trial" | "active" | "canceled" | "past_due";
}

// Job Function model
export interface JobFunction {
  id: string;
  name: string;
  organizationId: string;    // Reference to organization
  managerId?: string;        // Optional reference to manager
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Evaluation Option type for questions
export interface EvaluationOption {
  label: string;             // e.g., "Green", "Always does", etc.
  value: number;             // Percentage value (0-100)
  color?: string;            // Optional color code
}

// Question model
export interface Question {
  id: string;
  text: string;
  organizationId: string;    // Reference to organization
  jobFunctionIds: string[];  // References to job functions this applies to
  rewardValue?: number;      // Value if fixed reward
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Evaluation Schedule model
export interface EvaluationSchedule {
  id: string;
  organizationId: string;
  name: string;              // Schedule name
  description?: string;
  startDate: Timestamp;      // When evaluators can start
  endDate: Timestamp;        // Deadline for completion
  reminderFrequency: 'daily' | 'weekly' | 'custom';
  jobFunctionIds: string[];  // Job functions included
  status: 'draft' | 'active' | 'completed' | 'canceled';
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Evaluation model
export interface Evaluation {
  id: string;
  employeeId: string;
  evaluatorId: string;
  jobFunctionId: string;
  organizationId: string;
  scheduledAt: Timestamp;
  status: "draft" | "submitted" | "approved" | "rejected" | "completed";
  answers: Answer[];
  approvalFlow: ApprovalStep[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  submittedAt?: Timestamp;
  completedAt?: Timestamp;
}

// Approval Modification type
export interface ApproverModification {
  approverId: string;
  previousValue: number;
  modifiedAt: Timestamp;
  reason?: string;
}

// Evaluation Response model
export interface EvaluationResponse {
  id: string;
  evaluationId: string;      // Reference to evaluation
  questionId: string;        // Reference to question
  responseValue: number;     // Selected value
  comment?: string;          // Optional comment
  modifiedByApprover?: ApproverModification[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Approval Level type
export interface ApprovalLevel {
  level: number;             // 1, 2, 3, etc.
  approverUserIds: string[]; // Users who can approve at this level
  requiredCount: number;     // How many approvers needed
}

// Approval Flow model
export interface ApprovalFlow {
  id: string;
  organizationId: string;
  name: string;              // Flow name
  description?: string;
  levels: ApprovalLevel[];
  jobFunctionIds: string[];  // Job functions this flow applies to
  isDefault: boolean;        // Is this the default flow
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Answer {
  questionId: string;
  rating: "green" | "yellow" | "red" | null;
  ratingValue: number;
  comment?: string;
}

export interface ApprovalStep {
  approverId: string;
  status: "pending" | "approved" | "rejected";
  comment?: string;
  changes?: Record<string, any>;
  processedAt?: Timestamp;
} 