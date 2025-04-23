# Simple Evaluation - Technical Specification

## Project Overview

Simple Evaluation is a SaaS platform that enables businesses without internal development teams to create, manage, and analyze custom performance evaluations. The system supports flexible evaluation criteria, multi-level approval workflows, and detailed analytics.

**Key Distinction**: The platform separates two user populations:
1. **App Users** - Admins, evaluators, and approvers who log into the system (consume seat licenses)
2. **Employees** - People being evaluated who don't necessarily have system access

## Target Users
- Small to medium businesses
- HR departments
- Team managers

## Technical Stack

- **Frontend**: React, Next.js (App Router), TypeScript
- **Styling**: Tailwind CSS, ShadCN UI
- **Backend/Database**: Firebase (Auth, Firestore, Storage)
- **Payments**: Stripe
- **Emails**: SendGrid or similar service through Firebase Functions
- **Deployment**: Vercel

## Database Schema

### Collections

#### Users (App Users with Login)
```typescript
interface User {
  id: string;                // Firebase Auth UID
  email: string;             // Login email
  fullName: string;          // User's name
  organizationId: string;    // Reference to organization
  role: 'admin' | 'evaluator' | 'approver' | 'multiple'; // App roles
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
  isActive: boolean;         // Account status
}
```

#### Employees (Subjects of Evaluation)
```typescript
interface Employee {
  id: string;                // Generated ID (not auth ID)
  fullName: string;          // Employee name
  email?: string;            // Optional email (for notifications)
  phone?: string;            // Optional phone
  organizationId: string;    // Reference to organization
  jobFunctionId: string;     // Reference to job function
  supervisorId?: string;     // Reference to their supervisor (employee ID)
  managerId?: string;        // Reference to managing employee
  isActive: boolean;         // Employment status
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### UserEmployeeLinks
```typescript
interface UserEmployeeLink {
  id: string;
  userId: string;            // Reference to users collection
  employeeId: string;        // Reference to employees collection
  organizationId: string;    // Reference to organization
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Organizations
```typescript
interface Organization {
  id: string;
  name: string;
  createdBy: string;         // User ID of creator
  subscriptionTier: 'trial' | 'basic' | 'premium';
  subscriptionStatus: 'active' | 'pastDue' | 'canceled';
  stripeCustomerId: string;  // Stripe customer ID
  totalSeats: number;        // Total seats purchased
  usedSeats: number;         // Seats currently in use
  trialEndsAt?: Timestamp;   // End date for trial
  createdAt: Timestamp;
  updatedAt: Timestamp;
  settings: {
    notificationsEnabled: boolean;
    documentGenerationEnabled: boolean;
    // Other org-wide settings
  }
}
```

#### JobFunctions
```typescript
interface JobFunction {
  id: string;
  organizationId: string;    // Reference to organization
  name: string;              // Job function name
  description?: string;      // Optional description
  managerId?: string;        // Optional reference to manager
  createdBy: string;         // User ID who created
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Questions
```typescript
interface Question {
  id: string;
  organizationId: string;    // Reference to organization
  text: string;              // Question text
  jobFunctionIds: string[];  // References to job functions this applies to
  rewardType: 'fixed' | 'proportional'; // Type of reward calculation
  rewardValue?: number;      // Value if fixed reward
  evaluationType: 'percentage' | 'scale' | 'custom'; // How it's measured
  evaluationOptions: {       // Custom evaluation levels
    label: string;           // e.g., "Green", "Always does", etc.
    value: number;           // Percentage value (0-100)
    color?: string;          // Optional color code
  }[];
  createdBy: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### EvaluationSchedules
```typescript
interface EvaluationSchedule {
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
```

#### Evaluations
```typescript
interface Evaluation {
  id: string;
  scheduleId: string;        // Reference to schedule
  organizationId: string;
  evaluatorId: string;       // User ID performing evaluation (from Users collection)
  employeeId: string;        // Employee being evaluated (from Employees collection)
  jobFunctionId: string;     // Job function being evaluated
  status: 'draft' | 'submitted' | 'inReview' | 'rejected' | 'approved' | 'completed';
  currentApproverLevel: number; // Current level in approval flow
  currentApproverId?: string;  // Current approver (User ID)
  submissionDate?: Timestamp;
  completionDate?: Timestamp;
  totalScore?: number;       // Calculated total score
  totalReward?: number;      // Calculated total reward
  documentUrl?: string;      // Generated document URL
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### EvaluationResponses
```typescript
interface EvaluationResponse {
  id: string;
  evaluationId: string;      // Reference to evaluation
  questionId: string;        // Reference to question
  responseValue: number;     // Selected value
  comment?: string;          // Optional comment
  modifiedByApprover?: {     // Track approver modifications
    approverId: string;
    previousValue: number;
    modifiedAt: Timestamp;
    reason?: string;
  }[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### ApprovalFlows
```typescript
interface ApprovalFlow {
  id: string;
  organizationId: string;
  name: string;              // Flow name
  description?: string;
  levels: {
    level: number;           // 1, 2, 3, etc.
    approverUserIds: string[]; // Users who can approve at this level
    requiredCount: number;   // How many approvers needed
  }[];
  jobFunctionIds: string[];  // Job functions this flow applies to
  isDefault: boolean;        // Is this the default flow
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Core Features Implementation

### 1. Authentication & User Management

```typescript
// Next.js Authentication Configuration
// /src/app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth, 
            credentials.email, 
            credentials.password
          );
          
          const user = userCredential.user;
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (!userDoc.exists()) return null;
          
          const userData = userDoc.data();
          
          return {
            id: user.uid,
            email: user.email,
            name: userData.fullName,
            role: userData.role,
            organizationId: userData.organizationId
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.organizationId = token.organizationId;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.organizationId = user.organizationId;
      }
      return token;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 2. Organization & Team Setup

```typescript
// Organization Import Service
// /src/services/organizationService.ts

import { db, storage } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, batch, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Papa from 'papaparse';

export const importEmployeeData = async (
  organizationId: string, 
  fileData: File, 
  userId: string
): Promise<{ success: boolean; imported: number; errors: any[] }> => {
  try {
    // Parse CSV data
    const results = await new Promise<Papa.ParseResult<any>>((resolve, reject) => {
      Papa.parse(fileData, {
        header: true,
        skipEmptyLines: true,
        complete: resolve,
        error: reject,
      });
    });
    
    // Validate required fields
    const errors = [];
    const validEmployees = results.data.filter((employee, index) => {
      if (!employee.fullName) {
        errors.push({
          row: index + 2, // +2 for header row and 0-indexing
          message: 'Missing required field (fullName)',
          data: employee,
        });
        return false;
      }
      return true;
    });
    
    // Batch import valid employees
    const batchSize = 500;
    const batches = [];
    
    for (let i = 0; i < validEmployees.length; i += batchSize) {
      const currentBatch = batch();
      const employeesChunk = validEmployees.slice(i, i + batchSize);
      
      for (const employee of employeesChunk) {
        const newEmployeeRef = doc(collection(db, 'employees'));
        
        currentBatch.set(newEmployeeRef, {
          id: newEmployeeRef.id,
          fullName: employee.fullName,
          email: employee.email || null,
          phone: employee.phone || null,
          jobFunctionId: employee.jobFunctionId || null,
          supervisorId: employee.supervisorId || null,
          organizationId,
          isActive: true,
          createdBy: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        
        // If this employee also has app access, check if they exist in users and create link
        if (employee.email && employee.hasAppAccess === 'true') {
          // This would be handled separately through user management
          // Here we would typically check if a user with this email exists
          // and create a UserEmployeeLink if needed
        }
      }
      
      batches.push(currentBatch);
    }
    
    // Commit all batches
    await Promise.all(batches.map(batch => batch.commit()));
    
    // No need to update used seats as employees don't consume seat licenses
    // Only app users (admin, evaluators, approvers) consume seats
    
    return {
      success: true,
      imported: validEmployees.length,
      errors,
    };
  } catch (error) {
    console.error('Error importing employees:', error);
    return {
      success: false,
      imported: 0,
      errors: [{ message: error.message }],
    };
  }
};
```

### 3. Job Functions & Questions

```typescript
// Job Function Hooks
// /src/hooks/useJobFunctions.ts

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

export function useJobFunctions() {
  const [jobFunctions, setJobFunctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  
  const fetchJobFunctions = async () => {
    try {
      setLoading(true);
      const jobFunctionsRef = collection(db, 'jobFunctions');
      const q = query(
        jobFunctionsRef, 
        where('organizationId', '==', user.organizationId),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const jobFunctionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setJobFunctions(jobFunctionsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching job functions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const createJobFunction = async (jobFunctionData) => {
    try {
      const newJobFunction = {
        ...jobFunctionData,
        organizationId: user.organizationId,
        createdBy: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const docRef = await addDoc(collection(db, 'jobFunctions'), newJobFunction);
      
      return {
        id: docRef.id,
        ...newJobFunction,
      };
    } catch (err) {
      console.error('Error creating job function:', err);
      throw err;
    }
  };
  
  const updateJobFunction = async (id, data) => {
    try {
      const jobFunctionRef = doc(db, 'jobFunctions', id);
      await updateDoc(jobFunctionRef, {
        ...data,
        updatedAt: new Date(),
      });
      
      return { id, ...data };
    } catch (err) {
      console.error('Error updating job function:', err);
      throw err;
    }
  };
  
  const deleteJobFunction = async (id) => {
    try {
      await deleteDoc(doc(db, 'jobFunctions', id));
      return true;
    } catch (err) {
      console.error('Error deleting job function:', err);
      throw err;
    }
  };
  
  useEffect(() => {
    if (user?.organizationId) {
      fetchJobFunctions();
    }
  }, [user?.organizationId]);
  
  return {
    jobFunctions,
    loading,
    error,
    fetchJobFunctions,
    createJobFunction,
    updateJobFunction,
    deleteJobFunction,
  };
}
```

### 4. Evaluation Process

```typescript
// Evaluation Component
// /src/components/evaluation/EvaluationForm.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

export function EvaluationForm({ evaluationId, isReadOnly = false }) {
  const [evaluation, setEvaluation] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchEvaluationData = async () => {
      try {
        // Fetch evaluation details
        const evaluationDoc = await getDoc(doc(db, 'evaluations', evaluationId));
        if (!evaluationDoc.exists()) {
          toast({ 
            title: 'Error',
            description: 'Evaluation not found',
            variant: 'destructive'
          });
          router.push('/evaluations');
          return;
        }
        
        const evaluationData = { id: evaluationDoc.id, ...evaluationDoc.data() };
        setEvaluation(evaluationData);
        
        // Fetch employee details (from Employees collection, not Users)
        const employeeDoc = await getDoc(doc(db, 'employees', evaluationData.employeeId));
        if (employeeDoc.exists()) {
          setEmployee({ id: employeeDoc.id, ...employeeDoc.data() });
        }
        
        // Fetch job function details to get questions
        const jobFunctionDoc = await getDoc(doc(db, 'jobFunctions', evaluationData.jobFunctionId));
        
        // Fetch questions for this job function
        const questionsRef = collection(db, 'questions');
        const q = query(
          questionsRef,
          where('jobFunctionIds', 'array-contains', evaluationData.jobFunctionId),
          where('isActive', '==', true)
        );
        
        const questionsSnapshot = await getDocs(q);
        const questionsData = questionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuestions(questionsData);
        
        // Fetch existing responses if any
        if (evaluationData.status !== 'draft') {
          const responsesRef = collection(db, 'evaluationResponses');
          const responsesQuery = query(
            responsesRef,
            where('evaluationId', '==', evaluationId)
          );
          
          const responsesSnapshot = await getDocs(responsesQuery);
          const responsesData = {};
          const commentsData = {};
          
          responsesSnapshot.docs.forEach(doc => {
            const data = doc.data();
            responsesData[data.questionId] = data.responseValue;
            if (data.comment) {
              commentsData[data.questionId] = data.comment;
            }
          });
          
          setResponses(responsesData);
          setComments(commentsData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching evaluation data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load evaluation data',
          variant: 'destructive'
        });
        setLoading(false);
      }
    };
    
    if (evaluationId) {
      fetchEvaluationData();
    }
  }, [evaluationId, router]);
  
  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const handleCommentChange = (questionId, comment) => {
    setComments(prev => ({
      ...prev,
      [questionId]: comment
    }));
  };
  
  const saveAsDraft = async () => {
    if (submitting) return;
    
    try {
      setSubmitting(true);
      await saveResponses('draft');
      toast({
        title: 'Success',
        description: 'Evaluation saved as draft'
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: 'Error',
        description: 'Failed to save draft',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const submitEvaluation = async () => {
    if (submitting) return;
    
    // Validate all questions are answered
    const unansweredQuestions = questions.filter(q => !responses[q.id]);
    if (unansweredQuestions.length > 0) {
      toast({
        title: 'Incomplete Evaluation',
        description: `Please answer all ${unansweredQuestions.length} remaining questions before submitting`,
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setSubmitting(true);
      await saveResponses('submitted');
      toast({
        title: 'Success',
        description: 'Evaluation submitted successfully'
      });
      router.push('/evaluations');
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit evaluation',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const saveResponses = async (status) => {
    const batch = writeBatch(db);
    
    // Update evaluation status
    const evaluationRef = doc(db, 'evaluations', evaluationId);
    const updateData = {
      status,
      updatedAt: new Date()
    };
    
    if (status === 'submitted') {
      updateData.submissionDate = new Date();
      updateData.currentApproverLevel = 1; // Start approval process
      
      // Calculate total score
      let totalScore = 0;
      let totalReward = 0;
      
      questions.forEach(question => {
        const response = responses[question.id] || 0;
        totalScore += response;
        
        if (question.rewardType === 'fixed' && question.rewardValue) {
          totalReward += (response / 100) * question.rewardValue;
        }
      });
      
      // For proportional rewards, calculate based on job function
      if (evaluation.proportionalReward) {
        totalReward += evaluation.proportionalReward;
      }
      
      updateData.totalScore = totalScore / questions.length;
      updateData.totalReward = totalReward;
    }
    
    batch.update(evaluationRef, updateData);
    
    // Save/update responses
    for (const questionId in responses) {
      const responseValue = responses[questionId];
      const comment = comments[questionId] || '';
      
      // Check if response already exists
      const responsesRef = collection(db, 'evaluationResponses');
      const q = query(
        responsesRef,
        where('evaluationId', '==', evaluationId),
        where('questionId', '==', questionId)
      );
      
      const responseSnapshot = await getDocs(q);
      
      if (responseSnapshot.empty) {
        // Create new response
        const newResponseRef = doc(collection(db, 'evaluationResponses'));
        batch.set(newResponseRef, {
          evaluationId,
          questionId,
          responseValue,
          comment,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } else {
        // Update existing response
        const responseDoc = responseSnapshot.docs[0];
        batch.update(doc(db, 'evaluationResponses', responseDoc.id), {
          responseValue,
          comment,
          updatedAt: new Date()
        });
      }
    }
    
    return batch.commit();
  };
  
  if (loading) {
    return <div className="flex justify-center p-8">Loading evaluation...</div>;
  }
  
  return (
    <div className="container max-w-3xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>{evaluation?.employeeName} - Performance Evaluation</CardTitle>
        </CardHeader>
        <CardContent>
          {questions.map((question, index) => (
            <div key={question.id} className="mb-8 border-b pb-6">
              <h3 className="text-lg font-medium mb-4">
                {index + 1}. {question.text}
              </h3>
              
              <RadioGroup
                value={responses[question.id]?.toString()}
                onValueChange={(value) => handleResponseChange(question.id, parseInt(value))}
                disabled={isReadOnly}
                className="mb-4"
              >
                {question.evaluationOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option.value.toString()}
                      id={`${question.id}-${option.value}`}
                    />
                    <Label
                      htmlFor={`${question.id}-${option.value}`}
                      className="flex items-center"
                    >
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: option.color }}
                      />
                      {option.label} ({option.value}%)
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              <div>
                <Label htmlFor={`comment-${question.id}`}>Comments</Label>
                <Textarea
                  id={`comment-${question.id}`}
                  placeholder="Add comments about this criterion..."
                  value={comments[question.id] || ''}
                  onChange={(e) => handleCommentChange(question.id, e.target.value)}
                  disabled={isReadOnly}
                  className="mt-2"
                />
              </div>
            </div>
          ))}
        </CardContent>
        
        {!isReadOnly && (
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={saveAsDraft} disabled={submitting}>
              Save as Draft
            </Button>
            <Button onClick={submitEvaluation} disabled={submitting}>
              Submit Evaluation
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
```

### 5. Approval Workflow

```typescript
// Approval Component
// /src/components/approvals/ApprovalView.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { EvaluationForm } from '@/components/evaluation/EvaluationForm';
import { ModificationForm } from '@/components/approvals/ModificationForm';

export function ApprovalView({ evaluationId }) {
  const [evaluation, setEvaluation] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [evaluator, setEvaluator] = useState(null);
  const [approvalFlow, setApprovalFlow] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showModifyDialog, setShowModifyDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchApprovalData = async () => {
      try {
        // Fetch evaluation details
        const evaluationDoc = await getDoc(doc(db, 'evaluations', evaluationId));
        if (!evaluationDoc.exists()) {
          toast({ 
            title: 'Error',
            description: 'Evaluation not found',
            variant: 'destructive'
          });
          router.push('/approvals');
          return;
        }
        
        const evaluationData = { id: evaluationDoc.id, ...evaluationDoc.data() };
        setEvaluation(evaluationData);
        
        // Fetch employee details
        const employeeDoc = await getDoc(doc(db, 'users', evaluationData.employeeId));
        setEmployee(employeeDoc.exists() ? { id: employeeDoc.id, ...employeeDoc.data() } : null);
        
        // Fetch evaluator details
        const evaluatorDoc = await getDoc(doc(db, 'users', evaluationData.evaluatorId));
        setEvaluator(evaluatorDoc.exists() ? { id: evaluatorDoc.id, ...evaluatorDoc.data() } : null);
        
        // Fetch job function to get approval flow
        const jobFunctionDoc = await getDoc(doc(db, 'jobFunctions', evaluationData.jobFunctionId));
        
        // Find applicable approval flow
        const flowsRef = collection(db, 'approvalFlows');
        const q = query(
          flowsRef,
          where('organizationId', '==', evaluationData.organizationId),
          where('jobFunctionIds', 'array-contains', evaluationData.jobFunctionId)
        );
        
        const flowsSnapshot = await getDocs(q);
        let flow = null;
        
        // First check for specific flow for this job function
        flowsSnapshot.docs.forEach(doc => {
          flow = { id: doc.id, ...doc.data() };
        });
        
        // If no specific flow, get default flow
        if (!flow) {
          const defaultFlowQuery = query(
            flowsRef,
            where('organizationId', '==', evaluationData.organizationId),
            where('isDefault', '==', true)
          );
          
          const defaultFlowSnapshot = await getDocs(defaultFlowQuery);
          if (!defaultFlowSnapshot.empty) {
            flow = { id: defaultFlowSnapshot.docs[0].id, ...defaultFlowSnapshot.docs[0].data() };
          }
        }
        
        setApprovalFlow(flow);
        
        // Set current level
        if (flow) {
          const currentLevelData = flow.levels.find(l => l.level === evaluationData.currentApproverLevel);
          setCurrentLevel(currentLevelData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching approval data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load approval data',
          variant: 'destructive'
        });
        setLoading(false);
      }
    };
    
    if (evaluationId) {
      fetchApprovalData();
    }
  }, [evaluationId, router]);
  
  const handleApprove = async () => {
    if (submitting) return;
    
    try {
      setSubmitting(true);
      
      const nextLevel = currentLevel.level + 1;
      const hasNextLevel = approvalFlow.levels.some(l => l.level === nextLevel);
      
      const evaluationRef = doc(db, 'evaluations', evaluationId);
      const updateData = {
        updatedAt: new Date()
      };
      
      if (hasNextLevel) {
        // Move to next approval level
        updateData.currentApproverLevel = nextLevel;
        updateData.currentApproverId = null; // Reset current approver
      } else {
        // Final approval
        updateData.status = 'completed';
        updateData.completionDate = new Date();
        // Here you would trigger document generation
      }
      
      await updateDoc(evaluationRef, updateData);
      
      toast({
        title: 'Success',
        description: hasNextLevel 
          ? 'Evaluation approved and moved to next approval level' 
          : 'Evaluation fully approved and completed'
      });
      
      router.push('/approvals');
    } catch (error) {
      console.error('Error approving evaluation:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve evaluation',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleReject = async () => {
    if (submitting || !rejectionReason.trim()) return;
    
    try {
      setSubmitting(true);
      
      const evaluationRef = doc(db, 'evaluations', evaluationId);
      await updateDoc(evaluationRef, {
        status: 'rejected',
        rejectionReason,
        rejectedBy: auth.currentUser.uid,
        rejectedAt: new Date(),
        updatedAt: new Date()
      });
      
      toast({
        title: 'Evaluation Rejected',
        description: 'The evaluation has been rejected and returned to the evaluator'
      });
      
      router.push('/approvals');
    } catch (error) {
      console.error('Error rejecting evaluation:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject evaluation',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleModificationsSubmitted = () => {
    setShowModifyDialog(false);
    toast({
      title: 'Modifications Saved',
      description: 'Your modifications have been saved and the evaluation has been approved'
    });
    router.push('/approvals');
  };
  
  if (loading) {
    return <div className="flex justify-center p-8">Loading approval data...</div>;
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Approval Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Employee</h3>
              <p>{employee?.fullName}</p>
            </div>
            <div>
              <h3 className="font-medium">Job Function</h3>
              <p>{evaluation?.jobFunctionName}</p>
            </div>
            <div>
              <h3 className="font-medium">Evaluator</h3>
              <p>{evaluator?.fullName}</p>
            </div>
            <div>
              <h3 className="font-medium">Submission Date</h3>
              <p>{evaluation?.submissionDate.toDate().toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-medium">Overall Score</h3>
              <p>{evaluation?.totalScore.toFixed(1)}%</p>
            </div>
            <div>
              <h3 className="font-medium">Total Reward</h3>
              <p>${evaluation?.totalReward.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="evaluation">
        <TabsList className="mb-4">
          <TabsTrigger value="evaluation">Evaluation Details</TabsTrigger>
          <TabsTrigger value="approval">Approval Actions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="evaluation">
          <EvaluationForm evaluationId={evaluationId} isReadOnly={true} />
        </TabsContent>
        
        <TabsContent value="approval">
          <Card>
            <CardHeader>
              <CardTitle>Approval Decision</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="font-medium mb-2">Rejection Reason (required if rejecting)</h3>
                <Textarea
                  placeholder="Provide feedback on why this evaluation is being rejected..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="destructive" 
                onClick={handleReject}
                disabled={submitting || !rejectionReason.trim()}
              >
                Reject Evaluation
              </Button>
              
              <div className="space-x-4">
                <Dialog open={showModifyDialog} onOpenChange={setShowModifyDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Modify & Approve</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Modify Evaluation</DialogTitle>
                    </DialogHeader>
                    <ModificationForm 
                      evaluationId={evaluationId} 
                      onSubmitted={handleModificationsSubmitted} 
                    />
                  </DialogContent>
                </Dialog>
                
                <Button onClick={handleApprove} disabled={submitting}>
                  Approve
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

## User Flows

### 1. Registration & Onboarding Flow
1. User lands on marketing homepage
2. Clicks "Start 14-day trial"
3. Completes registration form
   - Name, company, email, password
   - Selects number of seats needed (for app users only)
   - Enters payment information (but not charged until trial ends)
4. Email verification sent
5. Upon verification, redirected to onboarding dashboard
6. Downloads employee template
7. Uploads completed template with employee data (people to be evaluated)
8. Creates job functions
9. Creates evaluation questions linked to job functions
10. Adds additional app users (evaluators/approvers) using purchased seats
11. Sets up approval flows
12. Schedules first evaluation period

### 2. Evaluator Flow
1. Evaluator receives email notification about pending evaluations
2. Logs into platform
3. Views dashboard with pending evaluation count
4. Selects an employee to evaluate
5. Fills out evaluation form with ratings and comments
6. Saves as draft or submits for approval
7. Receives notifications about approval status

### 3. Approver Flow
1. Approver receives notification about pending approval
2. Logs into platform
3. Views dashboard with pending approvals
4. Selects evaluation to review
5. Reviews ratings and comments
6. Can:
   - Approve (moves to next level or completes process)
   - Reject with comments (returns to evaluator)
   - Modify and approve (with tracked changes)
7. Receives confirmation of action

## Implementation Phases

### Phase 1: Core Infrastructure (Weeks 1-2)
- Authentication system
- Organization and user management
- Database schema setup
- Subscription handling with Stripe

### Phase 2: Evaluation Setup (Weeks 3-4)
- Job function management
- Question management
- Team structure import
- Basic dashboard

### Phase 3: Evaluation Process (Weeks 5-6)
- Evaluation form creation
- Draft saving functionality
- Submission process
- Email notifications

### Phase 4: Approval Workflow (Weeks 7-8)
- Approval flow configuration
- Approval review interface
- Modification tracking
- Rejection handling

### Phase 5: Analytics & Documents (Weeks 9-10)
- Basic analytics dashboard
- Document generation
- Export functionality
- Performance optimizations

## UI Components

Key UI components needed:
- OrganizationSetup
- UserManagement
- JobFunctionEditor
- QuestionEditor
- EvaluationForm
- ApprovalView
- AnalyticsDashboard
- ScheduleCalendar
- ImportExportTools

## Next Steps

1. Create Firebase project and configure security rules
2. Setup Next.js project with TypeScript and Tailwind
3. Implement authentication flow
4. Build database models
5. Create organization import functionality