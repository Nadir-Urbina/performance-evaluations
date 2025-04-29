"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types/database";

export function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signUp, createUserDocument } = useAuth();
  const { toast } = useToast();

  const validateForm = () => {
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please ensure both passwords match.",
      });
      return false;
    }
    
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
      });
      return false;
    }
    
    return true;
  };

  const createOrganization = async (userId: string, orgName: string) => {
    // Create a new organization document
    const orgDocRef = doc(db, "organizations", userId); // Using userId as orgId for simplicity
    await setDoc(orgDocRef, {
      name: orgName,
      ownerId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
      isActive: true,
      seats: 1, // Start with 1 seat (admin)
      usedSeats: 1,
    });
    
    return userId; // Return orgId
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Register user with Firebase Auth & Firestore
      const user = await signUp(email, password, fullName, "pending"); // Organization ID will be set after creation
      
      // Create organization
      const orgId = await createOrganization(user.id, companyName);
      
      // Update user with organization ID
      await setDoc(doc(db, "users", user.id), {
        organizationId: orgId,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      toast({
        variant: "success",
        title: "Account created",
        description: "Welcome to Simple Evaluation!",
      });
      
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration error",
        description: error.message || "Failed to create account",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    
    try {
      // Sign in with Google
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      // Check if user document exists
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userSnapshot = await getDoc(userDocRef);
      
      // If user doesn't exist, create organization and user document
      if (!userSnapshot.exists()) {
        console.log("Creating new user document for Google signup:", firebaseUser.email);
        
        // Create user document using our auth context method
        // If company name was provided in the form, update it afterward
        const user = await createUserDocument(firebaseUser);
        
        // If company name was provided, update the organization name
        if (companyName) {
          const orgDocRef = doc(db, "organizations", user.organizationId);
          await setDoc(orgDocRef, {
            name: companyName,
            updatedAt: serverTimestamp()
          }, { merge: true });
        }
        
        toast({
          variant: "success",
          title: "Account created",
          description: "Welcome to Simple Evaluation!",
        });
      } else {
        // User already exists, just update last login
        await setDoc(userDocRef, {
          lastLoginAt: serverTimestamp()
        }, { merge: true });
        
        toast({
          variant: "default",
          title: "Welcome back",
          description: "You're already registered with this Google account.",
        });
      }
      
      // Navigate to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Google sign up error:", error);
      toast({
        variant: "destructive",
        title: "Registration error",
        description: "Failed to sign up with Google",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={handleEmailSignUp}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none" htmlFor="companyName">
              Company Name
            </label>
            <input
              id="companyName"
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Inc."
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        onClick={handleGoogleSignUp}
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Sign Up with Google"}
      </Button>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
} 