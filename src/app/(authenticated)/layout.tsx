"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import DashboardNav from "@/components/dashboard/dashboard-nav";
import UserAccountNav from "@/components/dashboard/user-account-nav";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, firebaseUser, loading, error, createUserDocument } = useAuth();
  const [redirecting, setRedirecting] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);

  // Redirect to login if not authenticated after loading completes
  useEffect(() => {
    if (!loading && !firebaseUser && !redirecting) {
      console.log("No firebase user, redirecting to login");
      setRedirecting(true);
      redirect("/login");
    }
  }, [firebaseUser, loading, redirecting]);

  // Create user document if Firebase user exists but no user document
  useEffect(() => {
    const handleUserCreation = async () => {
      if (!loading && firebaseUser && !user && !creatingUser) {
        console.log("Firebase user exists but no user document, creating document...");
        setCreatingUser(true);
        try {
          await createUserDocument(firebaseUser);
          console.log("User document created successfully");
        } catch (error) {
          console.error("Error creating user document:", error);
        } finally {
          // Don't reset creatingUser to avoid infinite loops
          // The auth state listener will detect the document creation
        }
      }
    };

    handleUserCreation();
  }, [loading, firebaseUser, user, creatingUser, createUserDocument]);

  // Show user data loading
  if (loading || (firebaseUser && !user)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold">Loading...</h2>
          <p className="text-sm text-muted-foreground">
            Please wait while we load your data.
          </p>
          {creatingUser && (
            <p className="text-sm text-muted-foreground mt-2">
              Setting up your account...
            </p>
          )}
        </div>
      </div>
    );
  }

  // Show error state if present
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-red-500">Error</h2>
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => redirect("/login")}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Main layout when everything is loaded
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between py-4 px-4 md:px-6">
          <DashboardNav />
          {user && (
            <UserAccountNav user={user} />
          )}
        </div>
      </header>
      <main className="flex-1">
        <div className="container max-w-7xl mx-auto py-8 px-4 md:px-6">
          {children}
        </div>
      </main>
    </div>
  );
} 