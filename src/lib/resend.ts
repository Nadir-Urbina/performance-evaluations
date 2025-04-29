import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender address
const fromEmail = process.env.NEXT_PUBLIC_EMAIL_FROM || 'notifications@simpleevaluation.com';

// Import email templates that exist
import WelcomeEmail from '@/emails/WelcomeEmail';
// These templates will be implemented later
// import EvaluationNotificationEmail from '@/emails/EvaluationNotificationEmail';
// import ApprovalRequestEmail from '@/emails/ApprovalRequestEmail';
// import EvaluationRejectedEmail from '@/emails/EvaluationRejectedEmail';
// import CompletedEvaluationEmail from '@/emails/CompletedEvaluationEmail';

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(
  userEmail: string,
  userName: string,
  organizationName: string
) {
  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: userEmail,
      subject: 'Welcome to Simple Evaluation',
      react: WelcomeEmail({
        userName,
        organizationName,
      }),
    });
    
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
}

/**
 * Send evaluation notification email
 * To be implemented
 */
/* 
export async function sendEvaluationNotificationEmail(
  userEmail: string,
  userName: string,
  pendingEvaluations: number,
  dueDate: Date
) {
  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: userEmail,
      subject: `You have ${pendingEvaluations} pending evaluations`,
      react: EvaluationNotificationEmail({
        userName,
        pendingEvaluations,
        dueDate,
      }),
    });
    
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send evaluation notification email:', error);
    return { success: false, error };
  }
}
*/

/**
 * Send approval request email
 * To be implemented
 */
/*
export async function sendApprovalRequestEmail(
  userEmail: string,
  userName: string,
  evaluationId: string,
  employeeName: string,
  evaluatorName: string
) {
  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: userEmail,
      subject: `Evaluation Awaiting Your Approval: ${employeeName}`,
      react: ApprovalRequestEmail({
        userName,
        evaluationId,
        employeeName,
        evaluatorName,
      }),
    });
    
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send approval request email:', error);
    return { success: false, error };
  }
}
*/

/**
 * Send evaluation rejected email
 * To be implemented
 */
/*
export async function sendEvaluationRejectedEmail(
  userEmail: string,
  userName: string,
  evaluationId: string,
  employeeName: string,
  rejectionReason: string,
  approverName: string
) {
  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: userEmail,
      subject: `Evaluation Rejected: ${employeeName}`,
      react: EvaluationRejectedEmail({
        userName,
        evaluationId,
        employeeName,
        rejectionReason,
        approverName,
      }),
    });
    
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send evaluation rejected email:', error);
    return { success: false, error };
  }
}
*/

/**
 * Send completed evaluation notification
 * To be implemented
 */
/*
export async function sendCompletedEvaluationEmail(
  userEmail: string,
  userName: string,
  evaluationId: string,
  employeeName: string,
  documentUrl?: string
) {
  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: userEmail,
      subject: `Evaluation Completed: ${employeeName}`,
      react: CompletedEvaluationEmail({
        userName,
        evaluationId,
        employeeName,
        documentUrl,
      }),
    });
    
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send completed evaluation email:', error);
    return { success: false, error };
  }
}
*/

export { resend }; 