/**
 * Firestore Security Rules
 * 
 * This file documents the security rules for the Firestore database.
 * The actual rules are managed through the Firebase console or firebase CLI.
 */

export const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function belongsToOrg(orgId) {
      return exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.organizationId == orgId;
    }
    
    function hasRole(role) {
      return exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
    
    // User profiles - users can read/write their own profile
    match /users/{userId} {
      allow read: if isSignedIn() && (isOwner(userId) || belongsToOrg(resource.data.organizationId));
      allow create: if isSignedIn() && isOwner(userId);
      allow update: if isSignedIn() && isOwner(userId);
      allow delete: if false; // Prevent deletions for now
    }
    
    // Organizations - only admins can update, users in the org can read
    match /organizations/{orgId} {
      allow read: if isSignedIn() && belongsToOrg(orgId);
      allow create: if isSignedIn() && request.resource.data.ownerId == request.auth.uid;
      allow update: if isSignedIn() && belongsToOrg(orgId) && hasRole('admin');
      allow delete: if false; // Prevent deletions
    }
    
    // Employees - users in the org can read/write
    match /employees/{employeeId} {
      allow read: if isSignedIn() && belongsToOrg(resource.data.organizationId);
      allow create: if isSignedIn() && belongsToOrg(request.resource.data.organizationId);
      allow update: if isSignedIn() && belongsToOrg(resource.data.organizationId);
      allow delete: if isSignedIn() && belongsToOrg(resource.data.organizationId);
    }
    
    // Job Functions - users in the org can read/write
    match /jobFunctions/{jobFunctionId} {
      allow read: if isSignedIn() && belongsToOrg(resource.data.organizationId);
      allow create: if isSignedIn() && belongsToOrg(request.resource.data.organizationId);
      allow update: if isSignedIn() && belongsToOrg(resource.data.organizationId);
      allow delete: if isSignedIn() && belongsToOrg(resource.data.organizationId);
    }
    
    // Questions - users in the org can read/write
    match /questions/{questionId} {
      allow read: if isSignedIn() && belongsToOrg(resource.data.organizationId);
      allow create: if isSignedIn() && belongsToOrg(request.resource.data.organizationId);
      allow update: if isSignedIn() && belongsToOrg(resource.data.organizationId);
      allow delete: if isSignedIn() && belongsToOrg(resource.data.organizationId);
    }
    
    // Evaluations - users in the org can read/write based on roles
    match /evaluations/{evaluationId} {
      allow read: if isSignedIn() && belongsToOrg(resource.data.organizationId);
      allow create: if isSignedIn() && belongsToOrg(request.resource.data.organizationId);
      allow update: if isSignedIn() && belongsToOrg(resource.data.organizationId);
      allow delete: if isSignedIn() && belongsToOrg(resource.data.organizationId);
    }
    
    // Evaluation Responses - users in the org can read/write based on roles
    match /evaluationResponses/{responseId} {
      allow read: if isSignedIn() && belongsToOrg(resource.data.organizationId);
      allow create: if isSignedIn() && belongsToOrg(request.resource.data.organizationId);
      allow update: if isSignedIn() && belongsToOrg(resource.data.organizationId);
      allow delete: if isSignedIn() && belongsToOrg(resource.data.organizationId);
    }
    
    // Activities - users can only write (track) activities for their own org, and read their org's activities
    match /activities/{activityId} {
      allow read: if isSignedIn() && belongsToOrg(resource.data.organizationId);
      allow create: if isSignedIn() && belongsToOrg(request.resource.data.organizationId);
      allow update: if false; // Activities should be immutable
      allow delete: if false; // Prevent deletions
    }
  }
}
`;

/**
 * This export allows you to access the rules easily from other files
 * or deploy them programmatically if needed.
 */
export default firestoreRules; 