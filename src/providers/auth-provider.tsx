"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types/database';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, fullName: string, organizationId: string) => Promise<User>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  createUserDocument: (firebaseUser: FirebaseUser) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const createUserDocument = async (firebaseUser: FirebaseUser): Promise<User> => {
    console.log("Creating user document for:", firebaseUser.email);
    
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    
    // Create organization ID (same as user ID for simplicity)
    const organizationId = firebaseUser.uid;
    
    // User data
    const userData: Omit<User, 'id'> = {
      email: firebaseUser.email || '',
      fullName: firebaseUser.displayName || 'User',
      organizationId,
      role: 'admin',
      isActive: true,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
      lastLoginAt: serverTimestamp() as any,
    };
    
    // Create user document
    await setDoc(userDocRef, userData);
    
    // Create organization document
    const orgDocRef = doc(db, 'organizations', organizationId);
    await setDoc(orgDocRef, {
      name: firebaseUser.displayName ? `${firebaseUser.displayName}'s Organization` : 'My Organization',
      ownerId: firebaseUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
      isActive: true,
      seats: 1,
      usedSeats: 1,
    });
    
    const fullUser = { id: firebaseUser.uid, ...userData } as User;
    
    // Update user state
    setUser(fullUser);
    
    return fullUser;
  };

  // Listen to auth state changes
  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser?.email);
      setLoading(true);
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as Omit<User, 'id'>;
            const fullUser = { id: firebaseUser.uid, ...userData } as User;
            console.log("User data retrieved:", fullUser.email);
            setUser(fullUser);
            
            // Update last login time
            await updateDoc(doc(db, 'users', firebaseUser.uid), {
              lastLoginAt: serverTimestamp(),
            });
          } else {
            console.log("No user document found for:", firebaseUser.uid);
            // Don't sign out - this is a valid state during sign-in/sign-up
            // The user document will be created during the sign-in/sign-up process
            setUser(null);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Failed to load user data.');
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<User> => {
    try {
      setError(null);
      setLoading(true);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User account not found.');
      }
      
      const userData = userDoc.data() as Omit<User, 'id'>;
      
      // Update last login time
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        lastLoginAt: serverTimestamp(),
      });
      
      const fullUser = { id: firebaseUser.uid, ...userData } as User;
      setUser(fullUser);
      return fullUser;
    } catch (err: any) {
      console.error('Sign in error:', err);
      
      let errorMessage = 'Failed to sign in.';
      
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (
    email: string, 
    password: string, 
    fullName: string,
    organizationId: string
  ): Promise<User> => {
    try {
      setError(null);
      setLoading(true);
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update profile with name
      await updateProfile(firebaseUser, {
        displayName: fullName,
      });
      
      // Create user document in Firestore
      const newUser: Omit<User, 'id'> = {
        email,
        fullName,
        organizationId,
        role: 'admin', // Default role for new signups
        isActive: true,
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
        lastLoginAt: serverTimestamp() as any,
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      
      const user = { id: firebaseUser.uid, ...newUser } as User;
      setUser(user);
      
      return user;
    } catch (err: any) {
      console.error('Sign up error:', err);
      
      let errorMessage = 'Failed to create account.';
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak.';
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const logOut = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
      setError('Failed to sign out.');
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<void> => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Failed to send password reset email.');
      throw err;
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    error,
    signIn,
    signUp,
    logOut,
    resetPassword,
    createUserDocument,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
